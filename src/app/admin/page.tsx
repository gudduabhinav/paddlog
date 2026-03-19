"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, Package, Bell,
  Trash2, LogOut, Settings2, Eye, EyeOff, ShieldCheck, Zap, Activity, Menu,
  RefreshCcw, Volume2, VolumeX, Download, X as CloseIcon, AlertTriangle, MessageSquare, Phone,
  MapPin, Navigation, Clock, CreditCard, Box, Calendar, TrendingUp, Globe, CheckCircle2
} from "lucide-react";
import { verifyAdminPassword } from "./actions";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

const STATUS_CONFIG: any = {
  pending:   { label: "Pending",   color: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-500" },
  verified:  { label: "Verified",  color: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-500" },
  called:    { label: "Called",    color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  completed: { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'bookings' | 'settings'>('overview');
  const [contacts, setContacts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [newLeadsAlert, setNewLeadsAlert] = useState(false);
  const [newBookingsAlert, setNewBookingsAlert] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deleteId, setDeleteId] = useState<{table: string, id: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio(NOTIFICATION_SOUND);
    }
  }, []);

  const KEY_ICONS: any = {
    phone: Phone, email: MessageSquare, weight: TrendingUp,
    origin: MapPin, pickup: MapPin, destination: Navigation,
    cargo: Package, service: Zap, status: ShieldCheck,
    notes: MessageSquare, boxtype: Box, company: Users,
    duration: Clock, quantity: Package, material: Box,
    date: Calendar, payment: CreditCard
  };

  const ICON_GRADIENTS = [
    "from-violet-500 to-purple-600", "from-blue-500 to-cyan-400",
    "from-emerald-500 to-teal-400", "from-orange-500 to-amber-400",
    "from-pink-500 to-rose-400", "from-indigo-500 to-blue-400",
    "from-teal-500 to-green-400", "from-red-500 to-orange-400",
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("paddlog_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await verifyAdminPassword(password);
      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem("paddlog_admin_auth", "true");
        if (audioRef.current) {
          audioRef.current.play().then(() => { audioRef.current!.pause(); audioRef.current!.currentTime = 0; }).catch(() => {});
        }
        if ("Notification" in window) Notification.requestPermission();
      } else {
        alert(result.message || "Invalid Access Key");
      }
    } catch (err) {
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("paddlog_admin_auth");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: leads }, { data: shipments }, { data: siteSettings }] = await Promise.all([
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*')
      ]);
      setContacts(leads || []);
      setBookings(shipments || []);
      const settingsMap = siteSettings?.reduce((acc: any, curr: any) => { acc[curr.key] = curr.value; return acc; }, {});
      setSettings(settingsMap || {});
    } catch (err) {
      console.error("Sync Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const channel = supabase.channel('paddlog_admin_v6')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contacts' }, () => handleNewEntry('leads'))
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, () => handleNewEntry('shipments'))
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated]);

  const handleNewEntry = (type: 'leads' | 'shipments') => {
    if (soundEnabled && audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}); }
    if (type === 'leads') { setNewLeadsAlert(true); setTimeout(() => setNewLeadsAlert(false), 8000); }
    else { setNewBookingsAlert(true); setTimeout(() => setNewBookingsAlert(false), 8000); }
    setIsAlertActive(true);
    setTimeout(() => setIsAlertActive(false), 5000);
    fetchData();
  };

  const updateStatus = async (id: string, table: string, newStatus: string) => {
    try {
      const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      if (table === 'contacts') {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        if (selectedDetail?.id === id) setSelectedDetail((prev: any) => ({ ...prev, status: newStatus }));
      } else {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        if (selectedDetail?.id === id) setSelectedDetail((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err: any) {
      alert(`Status update failed: ${err.message || "Please ensure 'status' column exists in Supabase"}`);
    }
  };

  const markAsViewed = async (item: any, type: 'lead' | 'booking') => {
    if (type === 'lead' && !item.viewed) {
      try {
        await supabase.from('contacts').update({ viewed: true }).eq('id', item.id);
        setContacts(prev => prev.map(c => c.id === item.id ? { ...c, viewed: true } : c));
      } catch {}
    }
    setSelectedDetail({ ...item, _detailType: type });
  };

  const confirmDelete = async () => {
    if (!deleteId || isDeleting) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from(deleteId.table).delete().eq('id', deleteId.id);
      if (error) throw error;
      if (deleteId.table === 'contacts') setContacts(prev => prev.filter(c => c.id !== deleteId.id));
      else setBookings(prev => prev.filter(b => b.id !== deleteId.id));
    } catch (err) { alert("Database error: Could not delete."); }
    finally { setIsDeleting(false); setDeleteId(null); }
  };

  const exportToCSV = (tableData: any[], fileName: string) => {
    if (tableData.length === 0) return;
    const headers = Object.keys(tableData[0]).join(",");
    const rows = tableData.map(row => Object.values(row).map(value => typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${fileName}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const exportToPDF = (item: any, type: string) => {
    const name = item.name || item.customer_name || 'Unknown';
    const phone = item.phone || item.customer_phone || 'N/A';
    const email = item.email || item.customer_email || '';
    const status = item.status || 'pending';
    const date = new Date(item.created_at).toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'});
    const logoUrl = window.location.origin + '/paddlog-logo.png';

    let details = item.service_details || item.message || {};
    if (typeof details === 'string' && details.startsWith('{')) { try { details = JSON.parse(details); } catch(e) {} }
    const SKIP = ['name','email','phone','customer_name','customer_email','customer_phone','id','created_at'];
    const LABELS: any = { serviceId:'Service Type', isDG:'Dangerous Goods', unNumber:'UN Number', packingGroup:'Packing Group', origin:'Origin Hub', destination:'Target Hub', cargoType:'Cargo Classification', boxType:'Packaging Type', isImport:'Importation' };
    const getLabel = (k: string) => LABELS[k] || k.replace(/([A-Z])/g,' $1').replace(/_/g,' ').trim();
    const fmtVal = (v: any) => { if (typeof v === 'boolean') return v ? 'Yes' : 'No'; if (v === 'true') return 'Yes'; if (v === 'false') return 'No'; return String(v); };
    const rows = typeof details === 'object' ? Object.entries(details).filter(([k,v]) =>
      !SKIP.includes(k.toLowerCase()) && v !== null && v !== undefined && v !== '' && v !== 'null' && v !== 'undefined'
    ) : [];

    const STATUS_COLORS: any = { pending: '#f59e0b', verified: '#3b82f6', called: '#a855f7', completed: '#10b981' };
    const detailRows = rows.map(([k,v]) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap">${getLabel(k)}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:13px;font-weight:600;text-align:right">${fmtVal(v)}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Paddlog ${type} Report – ${name}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;color:#1e293b}@media print{body{background:#fff}.no-print{display:none}}</style></head>
<body style="padding:0">
  <div style="max-width:700px;margin:0 auto;background:#fff;min-height:100vh">
    <!-- Header Banner -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%);padding:36px 40px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:16px">
        <img src="${logoUrl}" style="height:52px;width:auto;object-fit:contain;filter:brightness(1.1)" />
      </div>
      <div style="text-align:right">
        <div style="color:rgba(255,255,255,0.5);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em">Report Type</div>
        <div style="color:#fff;font-size:18px;font-weight:900;letter-spacing:-0.02em;margin-top:2px">${type.toUpperCase()} REPORT</div>
        <div style="color:rgba(255,255,255,0.4);font-size:10px;margin-top:4px">${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</div>
      </div>
    </div>

    <!-- Status Bar -->
    <div style="background:${STATUS_COLORS[status] || '#f59e0b'}15;border-left:4px solid ${STATUS_COLORS[status] || '#f59e0b'};padding:14px 40px;display:flex;align-items:center;gap:10px">
      <div style="width:10px;height:10px;border-radius:50%;background:${STATUS_COLORS[status] || '#f59e0b'}"></div>
      <span style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:${STATUS_COLORS[status] || '#f59e0b'}">${status}</span>
      <span style="color:#94a3b8;font-size:11px;margin-left:auto">ID: ${item.id?.slice(0,12) || 'N/A'}</span>
    </div>

    <!-- Client Section -->
    <div style="padding:32px 40px">
      <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:#94a3b8;margin-bottom:16px">Client Information</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">
          <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px">Full Name</div>
          <div style="font-size:18px;font-weight:900;color:#0f172a">${name}</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">
          <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px">Phone</div>
          <div style="font-size:18px;font-weight:900;color:#0f172a">${phone}</div>
        </div>
        ${email ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">
          <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px">Email</div>
          <div style="font-size:14px;font-weight:700;color:#0f172a;word-break:break-all">${email}</div>
        </div>` : ''}
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px">
          <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;margin-bottom:4px">Registered On</div>
          <div style="font-size:14px;font-weight:700;color:#0f172a">${date}</div>
        </div>
      </div>
    </div>

    ${rows.length > 0 ? `
    <!-- Technical Specs -->
    <div style="padding:0 40px 32px">
      <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.3em;color:#94a3b8;margin-bottom:16px">Shipment Details</div>
      <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          ${detailRows}
        </table>
      </div>
    </div>` : ''}

    <!-- Footer -->
    <div style="margin:0 40px;padding:20px 0;border-top:2px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:10px">
        <img src="${logoUrl}" style="height:24px;width:auto;object-fit:contain;opacity:0.5" />
        <span style="color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em">Paddlog Logistics</span>
      </div>
      <span style="color:#cbd5e1;font-size:10px">Confidential · Admin Report · ${new Date().getFullYear()}</span>
    </div>
  </div>
  <script>window.onload=function(){window.print();}<\/script>
</body></html>`;

    const win = window.open('','_blank');
    if (win) { win.document.write(html); win.document.close(); }
  };

  // ─── LOGIN SCREEN ────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-roboto">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-100 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTI4ZjAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-sm"
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl shadow-slate-200/50">
            <Link href="/" className="flex flex-col items-center mb-10 text-center group">
              <img
                src="/paddlog-logo.png"
                alt="Paddlog"
                className="h-20 w-auto object-contain transition-transform group-hover:scale-[1.03]"
              />
              <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.4em] font-black">Operations Hub</p>
            </Link>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Access Key"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-900 placeholder-slate-400 font-black tracking-widest text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black tracking-widest text-xs transition-all shadow-lg shadow-red-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "AUTHENTICATING..." : "ENTER COMMAND →"}
              </button>
            </form>
          </div>
          <p className="text-center text-slate-400 text-[10px] mt-6 font-black uppercase tracking-[0.3em]">Paddlog Systems v3.0</p>
        </motion.div>
      </main>
    );
  }

  // ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
  const navItems = [
    { id: 'overview',  icon: LayoutDashboard, label: "Dashboard",       gradient: "from-violet-500 to-purple-600", alert: false },
    { id: 'leads',     icon: Users,           label: "Inbound Leads",   gradient: "from-blue-500 to-cyan-500",     alert: newLeadsAlert,    count: contacts.length },
    { id: 'bookings',  icon: Package,         label: "Shipment Orders", gradient: "from-emerald-500 to-teal-500",  alert: newBookingsAlert,  count: bookings.length },
    { id: 'settings',  icon: Settings2,       label: "Site Control",    gradient: "from-orange-500 to-amber-500",  alert: false },
  ];

  const currentData = activeTab === 'leads' ? contacts : bookings;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex font-roboto select-none overflow-x-hidden">
      <audio ref={audioRef} src={NOTIFICATION_SOUND} preload="auto" />

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-inner">
              <AlertTriangle size={36} className="text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Wipe Record?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">This action will permanently purge the record from the database. This is irreversible.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setDeleteId(null)} className="px-6 py-4 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Abort</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="px-6 py-4 bg-rose-600 text-white hover:bg-rose-700 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2">
                {isDeleting ? <RefreshCcw size={18} className="animate-spin" /> : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Header */}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 z-[60]">
           <Link href="/" className="flex items-center">
             <img src="/paddlog-logo.png" className="h-10 w-auto object-contain" alt="Paddlog" />
           </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900">
            {isSidebarOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <>
            {isMobile && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" />
            )}
            <motion.aside
              initial={isMobile ? { x: -280 } : undefined}
              animate={{ x: 0 }}
              exit={isMobile ? { x: -280 } : undefined}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "bg-white border-r border-slate-200 flex flex-col py-8 px-5 shadow-xl shadow-slate-200/50",
                isMobile ? "fixed inset-y-0 left-0 w-72 z-[80]" : "sticky top-0 h-screen w-72 shrink-0"
              )}
            >
              {/* Logo Area */}
              <Link href="/" className="flex items-center px-3 mb-10 group shrink-0">
                <img
                  src="/paddlog-logo.png"
                  alt="Paddlog"
                  className="h-14 w-auto object-contain transition-transform group-hover:scale-[1.03]"
                />
              </Link>

              {/* Status Badge */}
              <div className="mx-3 mb-6 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 text-[11px] font-black uppercase tracking-wider">Systems Online</span>
              </div>

              {/* Nav Items */}
              <nav className="flex flex-col gap-1.5">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-3 mb-2">Navigation Control</p>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); if (item.id === 'leads') setNewLeadsAlert(false); if (item.id === 'bookings') setNewBookingsAlert(false); setIsSidebarOpen(false); }}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group",
                      activeTab === item.id ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md transition-all",
                        activeTab === item.id ? item.gradient : "from-slate-100 to-slate-200 shadow-none border border-slate-200/50"
                      )}>
                        <item.icon size={17} className={activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-700"} />
                      </div>
                      <span className="text-sm font-black tracking-tight">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                      {item.count !== undefined && (
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-black", activeTab === item.id ? "bg-white text-slate-900 border border-slate-200" : "bg-slate-100 text-slate-500")}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </nav>

              {/* Bottom */}
              <div className="mt-auto px-1">
                <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border border-transparent hover:border-red-100">
                  <LogOut size={14} /> Logout Session
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col min-w-0", isMobile && "pt-16")}>

        {/* Top Topbar */}
        <header className="h-20 border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 capitalize">
                {activeTab === 'overview' ? "Command Dashboard" : activeTab === 'leads' ? "Inbound Leads" : activeTab === 'bookings' ? "Shipment Orders" : "System Control"}
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Paddlog Operations Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAlertActive && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                <Bell size={14} className="text-amber-500 animate-bounce" />
                <span className="text-amber-700 text-[11px] font-black uppercase tracking-wider hidden sm:block">New Lead</span>
              </motion.div>
            )}
            <button
              onClick={() => { setSoundEnabled(!soundEnabled); }}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                soundEnabled ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-slate-200 text-slate-400")}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="hidden sm:inline">ALERTS: {soundEnabled ? "ON" : "OFF"}</span>
            </button>
            <button onClick={fetchData} className="p-2.5 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-xl transition-all shadow-sm">
              <RefreshCcw size={17} className={loading ? "animate-spin" : ""} />
            </button>
            {(activeTab === 'leads' || activeTab === 'bookings') && (
              <button onClick={() => exportToCSV(currentData, activeTab)} className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200">
                <Download size={14} /> Export CSV
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-5 md:p-8 overflow-auto">

          {/* ── OVERVIEW ─────────────────────────── */}
          {activeTab === 'overview' && (() => {
            const countByStatus = (arr: any[]) => {
              const r = { pending: 0, verified: 0, called: 0, completed: 0 };
              arr.forEach(i => { const s = (i.status || 'pending') as keyof typeof r; if (r[s] !== undefined) r[s]++; });
              return r;
            };
            const lc = countByStatus(contacts);
            const bc = countByStatus(bookings);
            const unviewedLeads = contacts.filter(c => !c.viewed).length;
            const viewedLeads = contacts.filter(c => c.viewed).length;
            
            // Calculate trends for the last 7 days
            const getTrendData = () => {
              const days = Array.from({length: 7}, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toLocaleDateString('en-IN', {day:'2-digit', month:'short'});
              });
              
              const leadCounts = days.map(day => 
                contacts.filter(c => new Date(c.created_at).toLocaleDateString('en-IN', {day:'2-digit', month:'short'}) === day).length
              );
              const bookingCounts = days.map(day => 
                bookings.filter(b => new Date(b.created_at).toLocaleDateString('en-IN', {day:'2-digit', month:'short'}) === day).length
              );
              
              const max = Math.max(...leadCounts, ...bookingCounts, 5);
              return { days, leadCounts, bookingCounts, max };
            };
            const trend = getTrendData();

            const SOURCE_LABELS: any = {
              contact_form: { label: 'Contact Form', color: 'from-blue-500 to-cyan-500', dot: 'bg-blue-400' },
              exit_popup: { label: 'Exit Popup', color: 'from-rose-500 to-red-600', dot: 'bg-rose-400' },
              other: { label: 'Other', color: 'from-slate-500 to-slate-600', dot: 'bg-slate-400' },
            };
            
            const sourceCount = contacts.reduce((acc: any, c) => {
              const src = c.source || 'contact_form';
              acc[src] = (acc[src] || 0) + 1;
              return acc;
            }, {});

            return (
            <div className="space-y-8 max-w-7xl mx-auto">

              {/* Top Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Leads",    value: contacts.length, icon: Users,      gradient: "from-blue-600 to-cyan-500",     glow: "shadow-blue-200",    onClick: () => setActiveTab('leads') },
                  { label: "Total Bookings", value: bookings.length, icon: Package,    gradient: "from-emerald-600 to-teal-500",  glow: "shadow-emerald-200", onClick: () => setActiveTab('bookings') },
                  { label: "Unread Leads",   value: unviewedLeads,   icon: Bell,       gradient: "from-amber-600 to-orange-500",  glow: "shadow-amber-200",   onClick: () => setActiveTab('leads') },
                  { label: "Pending Action", value: lc.pending + bc.pending, icon: Activity, gradient: "from-red-600 to-rose-600", glow: "shadow-red-200", onClick: fetchData },
                ].map((card, i) => (
                  <motion.div key={i} whileHover={{ y: -4, scale: 1.01 }} onClick={card.onClick}
                    className="bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-slate-300 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
                    <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl mb-4", card.gradient, card.glow)}>
                      <card.icon size={22} className="text-white" />
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">{card.value}</div>
                    <div className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{card.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Source + Viewed/Unviewed row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Trend Chart */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                        <TrendingUp size={16} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-slate-900 font-black text-sm">Activity Analysis</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">7-Day Transaction Flow</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400">Leads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400">Bookings</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-end min-h-[300px]">
                    <div className="flex items-end justify-between h-40 gap-2 relative">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} className="w-full border-t border-slate-50" />
                        ))}
                      </div>
                      
                      {trend.days.map((day, i) => {
                        const lp = (trend.leadCounts[i] / trend.max) * 100;
                        const bp = (trend.bookingCounts[i] / trend.max) * 100;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                            <div className="flex gap-1 w-full justify-center h-full items-end pb-1">
                              <motion.div 
                                initial={{ height: 0 }} 
                                animate={{ height: `${lp}%` }}
                                className="w-2 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm shadow-sm" 
                              />
                              <motion.div 
                                initial={{ height: 0 }} 
                                animate={{ height: `${bp}%` }} 
                                className="w-2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm shadow-sm" 
                              />
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter w-full text-center truncate">{day}</span>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 bg-slate-900 text-white p-2 rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                              L: {trend.leadCounts[i]} | B: {trend.bookingCounts[i]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Lead Sources */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                      <Globe size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-sm">Lead Analytics</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Acquisition Channels</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    {Object.entries(sourceCount).length === 0 ? (
                      <div className="text-center text-slate-400 font-bold py-6">No data active</div>
                    ) : Object.entries(sourceCount).map(([src, count]: any) => {
                      const cfg = SOURCE_LABELS[src] || SOURCE_LABELS.other;
                      const pct = contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0;
                      return (
                        <div key={src} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <span className={cn("w-3 h-3 rounded-full shrink-0", cfg.dot)} />
                          <div className="flex-1 min-w-0">
                            <div className="text-slate-700 font-black text-sm">{cfg.label}</div>
                            <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full bg-gradient-to-r", cfg.color)} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <div className="text-2xl font-black text-slate-900 shrink-0">{count}</div>
                          <div className="text-slate-400 text-[10px] font-black">{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Viewed / Unviewed */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Eye size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-sm">Attention Tracking</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Unread vs Reviewed</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl border bg-amber-50 border-amber-100 text-center">
                      <div className="text-4xl font-black text-amber-600 mb-1">{unviewedLeads}</div>
                      <div className="text-amber-700 text-[10px] font-black uppercase tracking-widest">● PENDING</div>
                      <div className="text-slate-400 text-[10px] mt-1 font-bold">Awaiting Action</div>
                    </div>
                    <div className="p-6 rounded-2xl border bg-emerald-50 border-emerald-100 text-center">
                      <div className="text-4xl font-black text-emerald-600 mb-1">{viewedLeads}</div>
                      <div className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">✓ REVIEWED</div>
                      <div className="text-slate-400 text-[10px] mt-1 font-bold">Processed</div>
                    </div>
                    <div className="col-span-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Efficiency Rate</span>
                        <span className="text-slate-900 font-black text-sm">{contacts.length > 0 ? Math.round((viewedLeads/contacts.length)*100) : 0}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                          style={{ width: `${contacts.length > 0 ? Math.round((viewedLeads/contacts.length)*100) : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown - Leads + Bookings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <Users size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-sm">Leads Pipeline</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Fulfillment Status</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-3">
                    {(['pending','verified','called','completed'] as const).map(s => {
                      const sc = STATUS_CONFIG[s];
                      const count = lc[s];
                      const pct = contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0;
                      return (
                        <div key={s} className={cn("p-4 rounded-2xl border shadow-sm", sc.color)}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn("w-2 h-2 rounded-full", sc.dot)} />
                            <span className="text-[10px] font-black uppercase tracking-[0.1em]">{s}</span>
                          </div>
                          <div className="text-2xl font-black">{count}</div>
                          <div className="text-[10px] mt-1 opacity-70 font-black">{pct}% Share</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
                      <Package size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-sm">Orders Lifecycle</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Logistics Flow</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-3">
                    {(['pending','verified','called','completed'] as const).map(s => {
                      const sc = STATUS_CONFIG[s];
                      const count = bc[s];
                      const pct = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;
                      return (
                        <div key={s} className={cn("p-4 rounded-2xl border shadow-sm", sc.color)}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn("w-2 h-2 rounded-full", sc.dot)} />
                            <span className="text-[10px] font-black uppercase tracking-[0.1em]">{s}</span>
                          </div>
                          <div className="text-2xl font-black">{count}</div>
                          <div className="text-[10px] mt-1 opacity-70 font-black">{pct}% Share</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-slate-900 font-black text-sm">Real-time Stream</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] mt-0.5">Latest Transactions</p>
                  </div>
                  <Activity size={18} className="text-slate-300" />
                </div>
                <div className="divide-y divide-slate-100">
                  {[...contacts.slice(0,3).map(c => ({...c, _type:'lead'})), ...bookings.slice(0,2).map(b => ({...b, _type:'booking'}))]
                    .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0,5).map((item: any, i) => {
                      const sc = STATUS_CONFIG[(item.status || 'pending')] || STATUS_CONFIG.pending;
                      const isUnread = item._type === 'lead' && !item.viewed;
                      return (
                      <div key={i} className={cn("flex items-center gap-5 px-7 py-5 hover:bg-slate-50 transition-all cursor-pointer", isUnread && "bg-amber-50/50")} onClick={() => item._type === 'lead' ? markAsViewed(item, 'lead') : setSelectedDetail(item)}>
                        <div className="relative">
                          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-md",
                            item._type === 'lead' ? "from-blue-600 to-cyan-500" : "from-emerald-600 to-teal-500")}>
                            {item._type === 'lead' ? <Users size={18} className="text-white" /> : <Package size={18} className="text-white" />}
                          </div>
                          {isUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900 font-black text-sm truncate">{item.name || item.customer_name || "Unknown"}</span>
                            {isUnread && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 shrink-0">NEW</span>}
                          </div>
                          <div className="text-slate-400 text-[10px] font-black uppercase tracking-wide mt-0.5">
                            {item._type === 'lead' ? (item.source === 'exit_popup' ? '⚡ Priority Popup' : '📬 Standard Lead') : '📦 Customer Order'} · {item.phone || item.customer_phone || 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border hidden sm:inline-flex items-center gap-1.5 shadow-sm", sc.color)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />{item.status || 'pending'}
                          </span>
                          <div className="text-slate-400 text-[10px] font-black uppercase">{new Date(item.created_at).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}</div>
                        </div>
                      </div>
                    )})}
                  {contacts.length === 0 && bookings.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-bold">Waiting for incoming data stream...</div>
                  )}
                </div>
              </div>
            </div>
          );
          })()}

          {/* ── LEADS / BOOKINGS TABLE ────────────── */}
          {(activeTab === 'leads' || activeTab === 'bookings') && (
            <div className="max-w-7xl mx-auto font-roboto">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-slate-900 font-black text-lg">{activeTab === 'leads' ? 'Lead Pipeline' : 'Shipment Register'}</h2>
                    <p className="text-slate-400 text-[10px] mt-0.5 font-black uppercase tracking-[0.2em]">{currentData.length} records verified</p>
                  </div>
                  <button onClick={() => exportToCSV(currentData, activeTab)} className="sm:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">
                    <Download size={13} /> Export
                  </button>
                </div>
                {currentData.length === 0 ? (
                  <div className="p-20 text-center">
                    <Package size={40} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No data records found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner / Client</th>
                          <th className="hidden md:table-cell px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Details</th>
                          <th className="hidden sm:table-cell px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Level</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date Logged</th>
                          <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {currentData.map((item, idx) => {
                          const statusKey = (item.status || 'pending') as keyof typeof STATUS_CONFIG;
                          const sc = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                          return (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="hover:bg-slate-50 transition-all group cursor-pointer"
                              onClick={() => setSelectedDetail(item)}
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 text-white font-black text-sm shadow-md", ICON_GRADIENTS[idx % ICON_GRADIENTS.length])}>
                                      {(item.name || item.customer_name || "?")[0].toUpperCase()}
                                    </div>
                                    {activeTab === 'leads' && !item.viewed && (
                                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center" />
                                    )}
                                  </div>
                                  <div>
                                    <div className={cn("font-black text-sm tracking-tight", activeTab === 'leads' && !item.viewed ? "text-slate-900" : "text-slate-700")}>
                                      {item.name || item.customer_name || "Unknown Entity"}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {activeTab === 'leads' && item.source && (
                                        <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded border shadow-sm",
                                          item.source === 'exit_popup'
                                            ? "bg-rose-50 border-rose-100 text-rose-600"
                                            : "bg-blue-50 border-blue-100 text-blue-600")}>
                                          {item.source === 'exit_popup' ? '⚡ PRIORITY' : '📬 STANDARD'}
                                        </span>
                                      )}
                                      {item.company && <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{item.company}</span>}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="hidden md:table-cell px-6 py-5">
                                <div className="text-slate-900 text-sm font-black">{item.phone || item.customer_phone || '—'}</div>
                                <div className="text-slate-400 text-[10px] mt-0.5 font-bold truncate max-w-[160px] uppercase">{item.email || item.customer_email || 'NODATA@PADDLOG.COM'}</div>
                              </td>
                              <td className="hidden sm:table-cell px-6 py-5">
                                <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-sm">
                                  {item.service || item.service_type || 'GENERAL DG'}
                                </span>
                              </td>
                              <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                                <select
                                  value={item.status || 'pending'}
                                  onClick={e => e.stopPropagation()}
                                  onChange={(e) => { e.stopPropagation(); updateStatus(item.id, activeTab === 'leads' ? 'contacts' : 'bookings', e.target.value); }}
                                  className={cn("text-[10px] font-black uppercase px-3 py-2 rounded-xl border cursor-pointer tracking-widest transition-all appearance-none min-w-[100px] shadow-sm", sc.color)}
                                  style={{ background: 'white' }}
                                >
                                  {['pending','verified','called','completed'].map(s => <option key={s} value={s} className="bg-white text-slate-900 normal-case font-bold">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                                </select>
                              </td>
                              <td className="px-6 py-5 text-slate-400 text-[11px] font-black uppercase">
                                {new Date(item.created_at).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}
                              </td>
                              <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button onClick={(e) => { e.stopPropagation(); activeTab === 'leads' ? markAsViewed(item, 'lead') : setSelectedDetail(item); }} className="w-9 h-9 flex items-center justify-center bg-white hover:bg-blue-600 text-slate-400 hover:text-white border border-slate-200 hover:border-blue-600 rounded-xl transition-all shadow-sm" title="Review Detail">
                                    <Eye size={15} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); exportToPDF(item, activeTab === 'leads' ? 'lead' : 'booking'); }} className="w-9 h-9 flex items-center justify-center bg-white hover:bg-emerald-600 text-slate-400 hover:text-white border border-slate-200 hover:border-emerald-600 rounded-xl transition-all shadow-sm" title="Generate Report">
                                    <Download size={15} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); setDeleteId({ table: activeTab === 'leads' ? 'contacts' : 'bookings', id: item.id }); }} className="w-9 h-9 flex items-center justify-center bg-white hover:bg-red-600 text-slate-400 hover:text-white border border-slate-200 hover:border-red-600 rounded-xl transition-all shadow-sm" title="Wipe Data">
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SETTINGS ─────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto font-roboto">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-7 border-b border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                    <Settings2 size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-black text-lg">Platform Controller</h3>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Frontend Module Toggles</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(settings.section_visibility || {})
                      .filter(([key]) => !['dg_visualizer', 'faq'].includes(key)) // Hide removed sections
                      .map(([key, val]: any) => (
                      <div key={key} className={cn(
                        "flex flex-col gap-4 p-5 border rounded-2xl transition-all cursor-pointer",
                        val ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      )}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-slate-900 font-black text-sm capitalize">{key.replace(/_/g, ' ')}</div>
                            <div className={cn("text-[10px] mt-0.5 font-black uppercase tracking-wider", val ? "text-emerald-600" : "text-slate-400")}>
                              {val ? '● ACTIVE' : '○ DISABLED'}
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              const newVal = { ...settings.section_visibility, [key]: !val };
                              await supabase.from('site_settings').update({ value: newVal }).eq('key', 'section_visibility');
                              fetchData();
                            }}
                            className={cn("w-14 h-7 rounded-full transition-all relative flex items-center px-1 shrink-0", val ? "bg-emerald-500" : "bg-slate-200")}
                          >
                            <div className={cn("w-5 h-5 bg-white rounded-full transition-all shadow-md", val ? "translate-x-7" : "translate-x-0")} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                    <div className="flex gap-3">
                      <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                      <div className="text-amber-800 text-xs leading-relaxed">
                        <p className="font-black uppercase tracking-wider mb-1 text-amber-900">Legacy Notice</p>
                        Some sections (DG Visualizer, FAQ) have been removed from the platform code and are no longer controllable via this dashboard.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDetail(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white border border-slate-200 w-full max-w-4xl rounded-t-3xl md:rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[95vh] flex flex-col font-roboto"
            >
              {/* Modal Header */}
              <div className="relative px-7 py-6 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-white">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg text-white font-black text-lg", ICON_GRADIENTS[Math.floor(Math.random() * ICON_GRADIENTS.length)])}>
                    {(selectedDetail.name || selectedDetail.customer_name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-black text-xl tracking-tight">{selectedDetail.name || selectedDetail.customer_name || "Unknown"}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">REF ID: {selectedDetail.id?.slice(0,8)}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Status Switcher */}
                  <div className="hidden sm:flex bg-slate-50 border border-slate-200 rounded-2xl p-1 gap-1">
                    {['pending','verified','called','completed'].map(s => {
                      const sc = STATUS_CONFIG[s];
                      return (
                        <button key={s} onClick={() => updateStatus(selectedDetail.id, activeTab === 'leads' ? 'contacts' : 'bookings', s)}
                          className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all tracking-wider border",
                            selectedDetail.status === s ? sc.color : "text-slate-400 border-transparent hover:text-slate-900 hover:bg-white")}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setSelectedDetail(null)} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-xl flex items-center justify-center transition-all shadow-sm">
                    <CloseIcon size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1 bg-slate-50/30">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
                  
                  {/* Left - Client Info */}
                  <div className="border-b md:border-b-0 md:border-r border-slate-100 p-7 space-y-7 bg-white">
                    {/* Status badge */}
                    {(() => {
                      const sc = STATUS_CONFIG[(selectedDetail.status || 'pending')] || STATUS_CONFIG.pending;
                      return (
                        <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.1em] shadow-sm", sc.color)}>
                          <span className={cn("w-2 h-2 rounded-full", sc.dot)} />
                          {selectedDetail.status || 'Pending'}
                        </div>
                      );
                    })()}

                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Engagement Intel</p>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <Users size={16} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-0.5">Client Name</p>
                            <p className="text-slate-900 font-black text-sm">{selectedDetail.name || selectedDetail.customer_name || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <Phone size={16} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-0.5">Primary Contact</p>
                            <p className="text-slate-900 font-black text-sm">{selectedDetail.phone || selectedDetail.customer_phone || 'N/A'}</p>
                          </div>
                        </div>
                        {(selectedDetail.email || selectedDetail.customer_email) && (
                          <div className="flex items-start gap-4">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              <MessageSquare size={16} className="text-slate-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-0.5">Email Address</p>
                              <p className="text-slate-900 font-black text-xs break-all truncate">{selectedDetail.email || selectedDetail.customer_email}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <Calendar size={16} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-0.5">Request Date</p>
                            <p className="text-slate-900 font-black text-sm">{new Date(selectedDetail.created_at).toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'})}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile status switcher */}
                    <div className="sm:hidden space-y-3">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Update Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['pending','verified','called','completed'].map(s => {
                          const sc = STATUS_CONFIG[s];
                          return (
                            <button key={s} onClick={() => updateStatus(selectedDetail.id, activeTab === 'leads' ? 'contacts' : 'bookings', s)}
                              className={cn("px-3 py-3 text-[9px] font-black uppercase rounded-xl border transition-all text-center tracking-wider",
                                selectedDetail.status === s ? sc.color : "bg-slate-50 border-slate-100 text-slate-400")}>
                                {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right - Technical Data List */}
                  <div className="p-7">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                      Shipment Matrix <Activity size={12} className="text-blue-600" />
                    </p>
                    {(() => {
                      let displayData = selectedDetail.service_details || selectedDetail.message || {};
                      if (typeof displayData === 'string' && displayData.startsWith('{')) {
                        try { displayData = JSON.parse(displayData); } catch(e) {}
                      }
                      const getLabel = (key: string) => {
                        const labels: any = { serviceId:'Service Type', isDG:'Dangerous Goods', unNumber:'UN Number', packingGroup:'Packing Group', origin:'Origin Hub', destination:'Target Hub', cargoType:'Cargo Classification', boxType:'Packaging Type', isImport:'Importation' };
                        return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                      };
                      const formatValue = (val: any) => {
                        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
                        if (val === 'true') return 'Yes'; if (val === 'false') return 'No';
                        return String(val);
                      };
                      const EMPTY_VALS = [null, undefined, '', 'null', 'undefined', 'N/A', 'n/a'];
                      const filteredData = typeof displayData === 'object' ? Object.entries(displayData).filter(([k, v]) =>
                        !['name','email','phone','customer_name','customer_email','customer_phone','id','created_at'].includes(k.toLowerCase()) &&
                        !EMPTY_VALS.includes(v as any) && String(v).trim() !== ''
                      ) : [];

                      if (filteredData.length === 0) return (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-100 rounded-[32px] shadow-inner">
                          <CheckCircle2 size={48} className="text-slate-100 mb-4" />
                          <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No Technical Meta</p>
                        </div>
                      );

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredData.map(([k, v]: [string, any], index) => {
                            const Icon = KEY_ICONS[k.toLowerCase()] || Activity;
                            return (
                              <motion.div key={k}
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}
                                className="flex flex-col p-5 bg-white border border-slate-100 rounded-2xl group hover:border-slate-300 transition-all shadow-sm"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                    <Icon size={14} className="text-slate-400" />
                                  </div>
                                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{getLabel(k)}</div>
                                </div>
                                <div className="text-slate-900 font-black text-sm tracking-tight">{formatValue(v)}</div>
                              </motion.div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-100 px-7 py-5 shrink-0 flex items-center justify-between gap-3 bg-white">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Paddlog Operations Command Hub</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => exportToPDF(selectedDetail, (selectedDetail as any).customer_name ? 'booking' : 'lead')}
                    className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-slate-200"
                  >
                    <Download size={14} /> Download Report
                  </button>
                  <button onClick={() => { setDeleteId({ table: (selectedDetail as any).customer_name ? 'bookings' : 'contacts', id: selectedDetail.id }); setSelectedDetail(null); }}
                    className="flex items-center gap-2 px-4 py-3.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-2xl transition-all shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
