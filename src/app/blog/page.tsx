"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  FileText,
  Package,
  Compass,
  ClipboardCheck,
  Layers,
  Plane,
  Ship,
  Truck,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const blogCategories = ["All", "Packaging", "Regulations", "Logistics", "Safety"];

const blogPosts = [
  {
    id: "un-packaging",
    category: "Packaging",
    title: "The Importance of UN Certified Packaging",
    blurb: "Why tested, rated packaging is the backbone of safe hazmat movement across air, ocean, and road.",
    date: "March 10, 2026",
    author: "Compliance Team",
    icon: Package,
    gradient: "from-red-500 to-rose-600",
    image: "/dg-hazmat.png",
    content: "UN certified packaging is a fundamental requirement for the transport of dangerous goods. Our experts explain the rigorous testing processes involved and how to interpret the UN specification marks on your containers. From drop tests to leakproofness, every mark counts towards a safer supply chain."
  },
  {
    id: "dgd",
    category: "Regulations",
    title: "Mastering the Dangerous Goods Declaration",
    blurb: "Demystifying the DGD so shippers avoid holds, fines, and rejections at acceptance counters.",
    date: "March 8, 2026",
    author: "Logistics Lead",
    icon: ClipboardCheck,
    gradient: "from-orange-500 to-red-500",
    image: "/dg-hero.png",
    content: "The Shipper's Declaration for Dangerous Goods (DGD) is one of the most critical documents in hazardous transport. Errors here cause 80% of shipment rejections. Learn how to accurately declare your goods and meet IATA/IMDG requirements every single time."
  },
  {
    id: "solutions",
    category: "Logistics",
    title: "Integrated DG Logistics Solutions",
    blurb: "End-to-end services that keep hazardous supply chains compliant, visible, and predictable.",
    date: "March 5, 2026",
    author: "Operations Manager",
    icon: Layers,
    gradient: "from-blue-500 to-cyan-500",
    image: "/dg-air.png",
    content: "Handling DG logistics requires more than just transport. It requires an integrated approach that includes classification, documentation, and mode-specific expertise. Explore how Paddlog manages global routes while maintaining 100% compliance record."
  },
  {
    id: "chemical-safety",
    category: "Safety",
    title: "Chemical Safety & Storage Protocols",
    blurb: "Best practices for short-term and long-term storage of chemicals in transit.",
    date: "March 1, 2026",
    author: "Safety Officer",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-500",
    image: "/dg-sea.png",
    content: "Storage of hazardous materials in warehouses requires strict adherence to segregation and temperature control rules. We break down the IMDG segregation tables and safety protocols for modern dgWarehousing."
  }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-body">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-100 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Paddlog Insights</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900">The DG <span className="text-primary italic">Playbook</span></h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Professional guidance, regulatory updates, and expert tips on hazardous material logistics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full font-bold text-sm transition-all border",
                  activeCategory === cat 
                    ? "bg-primary border-primary text-white shadow-premium" 
                    : "bg-white border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-24 relative z-10 flex-grow">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="h-full bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-premium transition-all hover:border-primary/20 flex flex-col overflow-hidden">
                    {post.image ? (
                      <div className="h-48 relative overflow-hidden">
                        <img src={post.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={post.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-4 left-6 bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">
                          <post.icon size={20} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className={cn("h-48 flex items-center justify-center bg-gradient-to-br", post.gradient)}>
                        <post.icon size={48} className="text-white" />
                      </div>
                    )}
                    
                    <div className="p-8 flex-grow flex flex-col">
                    
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-bold uppercase tracking-widest">
                       <span className="text-primary">{post.category}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-200" />
                       <span>{post.date}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                      {post.blurb}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <User size={14} className="text-slate-400" />
                        </div>
                        <span className="text-xs text-slate-500 font-bold">{post.author}</span>
                      </div>
                      <ArrowRight size={20} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Article Detail Overlay */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedPost(null)} />
            
            <motion.div
              layoutId={selectedPost.id}
              className="relative bg-white border border-slate-200 w-full max-w-4xl max-h-full overflow-y-auto rounded-[3rem] p-8 md:p-16 custom-scrollbar shadow-2xl"
            >
               <button 
                 onClick={() => setSelectedPost(null)}
                 className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center font-bold"
               >
                 ✕
               </button>

               <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 bg-gradient-to-r text-white", selectedPost.gradient)}>
                 {selectedPost.category}
               </div>

               <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-slate-900">{selectedPost.title}</h2>
               
               <div className="flex items-center gap-6 mb-10 text-slate-400 text-sm font-medium">
                 <div className="flex items-center gap-2">
                   <Calendar size={16} />
                   {selectedPost.date}
                 </div>
                 <div className="flex items-center gap-2">
                   <User size={16} />
                   By {selectedPost.author}
                 </div>
               </div>

               <div className="prose prose-slate max-w-none">
                 <p className="text-xl text-slate-600 leading-relaxed font-medium italic mb-10 border-l-4 border-primary pl-6">
                    {selectedPost.blurb}
                 </p>
                 <div className="text-slate-500 text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedPost.content}
                    {"\n\n"}
                    Our team at Paddlog specializes in these complex operations, ensuring that your chemical shipments move through global channels with zero friction. Whether you are shipping Lithium batteries or Class 3 flammables, the principles of UN containment remain the same: Test, Mark, and Inspect.
                    {"\n\n"}
                    Stay tuned for more updates on IMO regulations for 2026.
                 </div>
               </div>
               
               <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                   <h4 className="text-xl font-bold mb-2 text-slate-900">Have specific project questions?</h4>
                   <p className="text-slate-500">Our DG specialists are available 24/7 for consultation.</p>
                 </div>
                 <a href="/contact" className="red-gradient px-8 py-4 rounded-2xl font-bold shadow-premium hover:shadow-red-glow transition-all text-white">
                   Contact Specialists
                 </a>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
