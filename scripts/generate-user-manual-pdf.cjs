/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");
const { jsPDF } = require("jspdf");

function usage() {
  // Keep it simple: no fancy CLI parsing.
  console.log("Usage: node scripts/generate-user-manual-pdf.cjs [input.md] [output.pdf]");
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function fileToDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : null;

  if (!mime) {
    throw new Error(`Unsupported image format: ${ext}`);
  }

  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:${mime};base64,${base64}`;
}

function resolveImagePath(mdDir, imagePath) {
  const cleaned = imagePath.trim().replace(/^['"]|['"]$/g, "");
  if (!cleaned) return null;

  // Absolute paths are used as-is. Relative paths resolve from markdown directory.
  return path.isAbsolute(cleaned) ? cleaned : path.resolve(mdDir, cleaned);
}

function generatePdfFromMarkdown({ inputPath, outputPath }) {
  const mdDir = path.dirname(inputPath);
  const md = readUtf8(inputPath);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 48;
  const marginTop = 54;
  const marginBottom = 54;
  const contentWidth = pageWidth - marginX * 2;
  const footerY = pageHeight - 28;

  let y = marginTop;

  const ensureSpace = (neededHeight) => {
    if (y + neededHeight <= pageHeight - marginBottom) return;
    doc.addPage();
    y = marginTop;
  };

  const setTextStyle = ({ size, bold, color }) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color ?? 33);
  };

  const writeParagraph = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setTextStyle({ size: 11, bold: false, color: 45 });
    const lines = doc.splitTextToSize(trimmed, contentWidth);
    const lineHeight = 11 * 1.45;
    ensureSpace(lines.length * lineHeight);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], marginX, y + i * lineHeight);
    }
    y += lines.length * lineHeight + 8;
  };

  const writeHeading = (level, text) => {
    const title = text.trim();
    if (!title) return;

    const style =
      level === 1
        ? { size: 20, spacingBefore: 10, spacingAfter: 10 }
        : level === 2
          ? { size: 15, spacingBefore: 10, spacingAfter: 8 }
          : { size: 12, spacingBefore: 8, spacingAfter: 6 };

    ensureSpace(style.spacingBefore + style.size * 1.6);
    y += style.spacingBefore;

    setTextStyle({ size: style.size, bold: true, color: 20 });
    const lines = doc.splitTextToSize(title, contentWidth);
    const lineHeight = style.size * 1.3;
    ensureSpace(lines.length * lineHeight);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], marginX, y + i * lineHeight);
    }
    y += lines.length * lineHeight + style.spacingAfter;
  };

  const writeBullet = (text) => {
    const item = text.trim();
    if (!item) return;

    setTextStyle({ size: 11, bold: false, color: 45 });
    const bulletIndent = 14;
    const lineHeight = 11 * 1.45;
    const lines = doc.splitTextToSize(item, contentWidth - bulletIndent);
    ensureSpace(lines.length * lineHeight);

    doc.text("•", marginX, y);
    for (let i = 0; i < lines.length; i++) {
      doc.text(lines[i], marginX + bulletIndent, y + i * lineHeight);
    }
    y += lines.length * lineHeight + 4;
  };

  const writeImage = (alt, imagePath) => {
    const resolved = resolveImagePath(mdDir, imagePath);
    if (!resolved) return;
    if (!fs.existsSync(resolved)) {
      writeParagraph(`[Image missing: ${alt || "image"}]`);
      return;
    }

    const dataUri = fileToDataUri(resolved);
    const props = doc.getImageProperties(dataUri);
    const maxW = contentWidth;
    const maxH = Math.max(220, (pageHeight - marginBottom) - y - 20);

    let w = maxW;
    let h = (props.height / props.width) * w;
    if (h > maxH) {
      h = maxH;
      w = (props.width / props.height) * h;
    }

    ensureSpace(h + 24);

    const x = marginX + (contentWidth - w) / 2;
    const format = (props.fileType || "PNG").toUpperCase();
    doc.addImage(dataUri, format, x, y, w, h);
    y += h + 10;

    if (alt && alt.trim()) {
      setTextStyle({ size: 9, bold: false, color: 110 });
      const caption = alt.trim();
      const capLines = doc.splitTextToSize(caption, contentWidth);
      const capLineH = 9 * 1.35;
      ensureSpace(capLines.length * capLineH + 6);
      for (let i = 0; i < capLines.length; i++) {
        doc.text(capLines[i], marginX, y + i * capLineH);
      }
      y += capLines.length * capLineH + 10;
    } else {
      y += 8;
    }
  };

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let paragraphBuffer = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    writeParagraph(paragraphBuffer.join(" ").replace(/\s+/g, " "));
    paragraphBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Blank line => paragraph break
    if (!line.trim()) {
      flushParagraph();
      y += 2;
      continue;
    }

    // Horizontal rule => visual break (new paragraph spacing)
    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      ensureSpace(18);
      y += 10;
      doc.setDrawColor(220);
      doc.setLineWidth(1);
      doc.line(marginX, y, marginX + contentWidth, y);
      y += 14;
      continue;
    }

    // Headings
    const hMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (hMatch) {
      flushParagraph();
      writeHeading(hMatch[1].length, hMatch[2]);
      continue;
    }

    // Images: ![alt](path)
    const imgMatch = /^!\[(.*?)]\((.*?)\)\s*$/.exec(line.trim());
    if (imgMatch) {
      flushParagraph();
      writeImage(imgMatch[1], imgMatch[2]);
      continue;
    }

    // Bullets
    const bulletMatch = /^-\s+(.+)$/.exec(line.trim());
    if (bulletMatch) {
      flushParagraph();
      writeBullet(bulletMatch[1]);
      continue;
    }

    // Otherwise: paragraph content
    paragraphBuffer.push(line.trim());
  }

  flushParagraph();

  // Footer (page numbers)
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Paddlog DG Solutions • User Manual`, marginX, footerY);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX, footerY, {
      align: "right",
    });
  }

  const pdfArrayBuffer = doc.output("arraybuffer");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(pdfArrayBuffer));
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    usage();
    process.exit(0);
  }

  const repoRoot = path.resolve(__dirname, "..");
  const inputPath = args[0]
    ? path.resolve(process.cwd(), args[0])
    : path.join(repoRoot, "docs", "user-manual.md");
  const outputPath = args[1]
    ? path.resolve(process.cwd(), args[1])
    : path.join(repoRoot, "docs", "Paddlog-User-Manual.pdf");

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    usage();
    process.exit(1);
  }

  generatePdfFromMarkdown({ inputPath, outputPath });
  console.log(`PDF generated: ${outputPath}`);
}

main();

