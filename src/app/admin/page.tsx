"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, Package, Bell,
  Trash2, LogOut, Settings2, Eye, ShieldCheck, Zap, Activity, Menu,
  RefreshCcw, Volume2, VolumeX, Download, X as CloseIcon, AlertTriangle, MessageSquare, Phone,
  MapPin, Navigation, Clock, CreditCard, Box, Calendar, TrendingUp, Globe, CheckCircle2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

const STATUS_CONFIG: any = {
  pending:   { label: "Pending",   color: "bg-amber-500/20 text-amber-300 border-amber-500/30",   dot: "bg-amber-400" },
  verified:  { label: "Verified",  color: "bg-blue-500/20 text-blue-300 border-blue-500/30",      dot: "bg-blue-400" },
  called:    { label: "Called",    color: "bg-purple-500/20 text-purple-300 border-purple-500/30", dot: "bg-purple-400" },
  completed: { label: "Completed", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
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
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Paddlog@2024") {
      setIsAuthenticated(true);
      localStorage.setItem("paddlog_admin_auth", "true");
      if (audioRef.current) {
        audioRef.current.play().then(() => { audioRef.current!.pause(); audioRef.current!.currentTime = 0; }).catch(() => {});
      }
      if ("Notification" in window) Notification.requestPermission();
    } else {
      alert("Invalid Access Key");
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
    const logoUrl = window.location.origin + '/logo.png';

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
      <main className="min-h-screen bg-[#0A0C14] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWExZjJlIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-sm"
        >
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <img src="/logo.png" className="h-20 w-auto object-contain drop-shadow-2xl mb-4" alt="Paddlog Logo" />
              <h1 className="text-white text-2xl font-bold">Paddlog Command</h1>
              <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Admin Access Portal</p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Enter access key..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all text-white placeholder-slate-600 font-medium tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <button className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-4 rounded-2xl font-bold tracking-widest text-sm transition-all shadow-lg shadow-red-900/40 active:scale-95">
                AUTHENTICATE →
              </button>
            </form>
          </div>
          <p className="text-center text-slate-600 text-xs mt-6 uppercase tracking-widest">Paddlog Operations Center v2.0</p>
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
    <main className="min-h-screen bg-[#0A0C14] text-white flex font-roboto select-none overflow-x-hidden">
      <audio ref={audioRef} src={NOTIFICATION_SOUND} preload="auto" />

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111827] border border-white/10 rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Delete Record?</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">This entry will be permanently wiped from the database. This action cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setDeleteId(null)} className="py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-bold hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                {isDeleting ? <RefreshCcw size={18} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117] border-b border-white/10 flex items-center justify-between px-5 z-[60]">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-9 w-auto object-contain drop-shadow-lg" alt="Paddlog Logo" />
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white">
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
                "bg-[#0D1117] border-r border-white/10 flex flex-col py-8 px-5",
                isMobile ? "fixed inset-y-0 left-0 w-72 z-[80]" : "sticky top-0 h-screen w-72 shrink-0"
              )}
            >
              {/* Logo Area */}
              <div className="flex items-start px-2 mb-6">
                <img src="/logo.png" className="h-28 w-auto object-contain drop-shadow-lg" alt="Paddlog Logo" />
              </div>

              {/* Status Badge */}
              <div className="mx-3 mb-6 flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider">Systems Online</span>
              </div>

              {/* Nav Items */}
              <nav className="flex flex-col gap-1.5">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-3 mb-2">Navigation</p>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); if (item.id === 'leads') setNewLeadsAlert(false); if (item.id === 'bookings') setNewBookingsAlert(false); setIsSidebarOpen(false); }}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group",
                      activeTab === item.id ? "bg-white/10 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg transition-all",
                        activeTab === item.id ? item.gradient + " shadow-black/30" : "from-white/5 to-white/10 shadow-none"
                      )}>
                        <item.icon size={17} className={activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
                      </div>
                      <span className="text-sm font-bold">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.alert && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />}
                      {item.count !== undefined && (
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-bold", activeTab === item.id ? "bg-white/20 text-white" : "bg-white/5 text-slate-500")}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </nav>

              {/* Bottom */}
              <div className="mt-auto px-1">
                <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm border border-transparent hover:border-red-500/20">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col min-w-0", isMobile && "pt-16")}>

        {/* Top Topbar */}
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-20 bg-[#0A0C14]/90 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-black tracking-tight text-white capitalize">
                {activeTab === 'overview' ? "Dashboard" : activeTab === 'leads' ? "Inbound Leads" : activeTab === 'bookings' ? "Shipment Orders" : "Site Control"}
              </h1>
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Paddlog Operations Command</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAlertActive && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                <Bell size={14} className="text-amber-400 animate-bounce" />
                <span className="text-amber-300 text-[11px] font-bold uppercase tracking-wider hidden sm:block">New Incoming</span>
              </motion.div>
            )}
            <button
              onClick={() => { setSoundEnabled(!soundEnabled); }}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all",
                soundEnabled ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-white/5 border-white/10 text-slate-500")}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="hidden sm:inline">{soundEnabled ? "ON" : "OFF"}</span>
            </button>
            <button onClick={fetchData} className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 rounded-xl transition-all">
              <RefreshCcw size={17} className={loading ? "animate-spin" : ""} />
            </button>
            {(activeTab === 'leads' || activeTab === 'bookings') && (
              <button onClick={() => exportToCSV(currentData, activeTab)} className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                <Download size={14} /> Export
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
            const sourceCount = contacts.reduce((acc: any, c) => {
              const src = c.source || 'contact_form';
              acc[src] = (acc[src] || 0) + 1;
              return acc;
            }, {});
            const SOURCE_LABELS: any = {
              contact_form: { label: 'Contact Form', color: 'from-blue-500 to-cyan-500', dot: 'bg-blue-400' },
              exit_popup: { label: 'Exit Popup', color: 'from-rose-500 to-red-600', dot: 'bg-rose-400' },
              other: { label: 'Other', color: 'from-slate-500 to-slate-600', dot: 'bg-slate-400' },
            };
            return (
            <div className="space-y-8 max-w-7xl mx-auto">

              {/* Top Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Leads",    value: contacts.length, icon: Users,      gradient: "from-blue-500 to-cyan-500",     glow: "shadow-blue-900/30",    onClick: () => setActiveTab('leads') },
                  { label: "Total Bookings", value: bookings.length, icon: Package,    gradient: "from-emerald-500 to-teal-500",  glow: "shadow-emerald-900/30", onClick: () => setActiveTab('bookings') },
                  { label: "Unread Leads",   value: unviewedLeads,   icon: Bell,       gradient: "from-amber-500 to-orange-500",  glow: "shadow-amber-900/30",   onClick: () => setActiveTab('leads') },
                  { label: "Pending Action", value: lc.pending + bc.pending, icon: Activity, gradient: "from-red-500 to-rose-600", glow: "shadow-red-900/30", onClick: fetchData },
                ].map((card, i) => (
                  <motion.div key={i} whileHover={{ y: -4, scale: 1.01 }} onClick={card.onClick}
                    className="bg-[#111827] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-white/20 transition-all">
                    <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl mb-4", card.gradient, card.glow)}>
                      <card.icon size={22} className="text-white" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{card.value}</div>
                    <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">{card.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Source + Viewed/Unviewed row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Sources */}
                <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
                  <div className="px-7 py-5 border-b border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Globe size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">Lead Sources</h3>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Where leads are coming from</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    {Object.entries(sourceCount).length === 0 ? (
                      <div className="text-center text-slate-600 font-bold py-6">No leads yet</div>
                    ) : Object.entries(sourceCount).map(([src, count]: any) => {
                      const cfg = SOURCE_LABELS[src] || SOURCE_LABELS.other;
                      const pct = contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0;
                      return (
                        <div key={src} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                          <span className={cn("w-3 h-3 rounded-full shrink-0", cfg.dot)} />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-bold text-sm">{cfg.label}</div>
                            <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full bg-gradient-to-r", cfg.color)} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <div className="text-2xl font-black text-white shrink-0">{count}</div>
                          <div className="text-slate-500 text-[10px] font-bold">{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Viewed / Unviewed */}
                <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
                  <div className="px-7 py-5 border-b border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Eye size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">Lead Engagement</h3>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Viewed vs Unread leads</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-center">
                      <div className="text-4xl font-black text-amber-300 mb-1">{unviewedLeads}</div>
                      <div className="text-amber-400 text-[10px] font-black uppercase tracking-widest">● Unread</div>
                      <div className="text-slate-500 text-[10px] mt-1">Not yet opened</div>
                    </div>
                    <div className="p-6 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-center">
                      <div className="text-4xl font-black text-emerald-300 mb-1">{viewedLeads}</div>
                      <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">✓ Viewed</div>
                      <div className="text-slate-500 text-[10px] mt-1">Admin reviewed</div>
                    </div>
                    <div className="col-span-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Read Rate</span>
                        <span className="text-white font-black text-sm">{contacts.length > 0 ? Math.round((viewedLeads/contacts.length)*100) : 0}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                          style={{ width: `${contacts.length > 0 ? Math.round((viewedLeads/contacts.length)*100) : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown - Leads + Bookings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
                  <div className="px-7 py-5 border-b border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Users size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">Leads Pipeline</h3>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Status breakdown</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-3">
                    {(['pending','verified','called','completed'] as const).map(s => {
                      const sc = STATUS_CONFIG[s];
                      const count = lc[s];
                      const pct = contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0;
                      return (
                        <div key={s} className={cn("p-4 rounded-2xl border", sc.color)}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn("w-2 h-2 rounded-full", sc.dot)} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
                          </div>
                          <div className="text-2xl font-black">{count}</div>
                          <div className="text-[10px] mt-1 opacity-70 font-bold">{pct}% of total</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
                  <div className="px-7 py-5 border-b border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Package size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">Bookings Pipeline</h3>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Status breakdown</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-3">
                    {(['pending','verified','called','completed'] as const).map(s => {
                      const sc = STATUS_CONFIG[s];
                      const count = bc[s];
                      const pct = bookings.length > 0 ? Math.round((count / bookings.length) * 100) : 0;
                      return (
                        <div key={s} className={cn("p-4 rounded-2xl border", sc.color)}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={cn("w-2 h-2 rounded-full", sc.dot)} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
                          </div>
                          <div className="text-2xl font-black">{count}</div>
                          <div className="text-[10px] mt-1 opacity-70 font-bold">{pct}% of total</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
                <div className="px-7 py-5 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold">Recent Activity</h3>
                    <p className="text-slate-500 text-xs mt-0.5 uppercase tracking-widest font-bold">Latest leads & bookings</p>
                  </div>
                  <Globe size={18} className="text-slate-600" />
                </div>
                <div className="divide-y divide-white/5">
                  {[...contacts.slice(0,3).map(c => ({...c, _type:'lead'})), ...bookings.slice(0,2).map(b => ({...b, _type:'booking'}))]
                    .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0,5).map((item: any, i) => {
                      const sc = STATUS_CONFIG[(item.status || 'pending')] || STATUS_CONFIG.pending;
                      const isUnread = item._type === 'lead' && !item.viewed;
                      return (
                      <div key={i} className={cn("flex items-center gap-5 px-7 py-5 hover:bg-white/5 transition-all cursor-pointer", isUnread && "bg-amber-500/5")} onClick={() => item._type === 'lead' ? markAsViewed(item, 'lead') : setSelectedDetail(item)}>
                        <div className="relative">
                          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
                            item._type === 'lead' ? "from-blue-500 to-cyan-500" : "from-emerald-500 to-teal-500")}>
                            {item._type === 'lead' ? <Users size={18} className="text-white" /> : <Package size={18} className="text-white" />}
                          </div>
                          {isUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-[#111827]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm truncate">{item.name || item.customer_name || "Unknown"}</span>
                            {isUnread && <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">NEW</span>}
                          </div>
                          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mt-0.5">
                            {item._type === 'lead' ? (item.source === 'exit_popup' ? '⚡ Urgent Popup' : '📬 Contact Form') : '📦 Booking'} · {item.phone || item.customer_phone || 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border hidden sm:inline-flex items-center gap-1.5", sc.color)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />{item.status || 'pending'}
                          </span>
                          <div className="text-slate-600 text-xs font-bold">{new Date(item.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )})}
                  {contacts.length === 0 && bookings.length === 0 && (
                    <div className="p-12 text-center text-slate-600 font-bold">No data yet. Waiting for incoming leads...</div>
                  )}
                </div>
              </div>
            </div>
          );
          })()}

          {/* ── LEADS / BOOKINGS TABLE ────────────── */}
          {(activeTab === 'leads' || activeTab === 'bookings') && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-white font-bold text-lg">{activeTab === 'leads' ? 'Inbound Leads' : 'Shipment Orders'}</h2>
                    <p className="text-slate-500 text-xs mt-0.5 font-bold uppercase tracking-widest">{currentData.length} records in database</p>
                  </div>
                  <button onClick={() => exportToCSV(currentData, activeTab)} className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 rounded-xl text-xs font-bold">
                    <Download size={13} />
                  </button>
                </div>
                {currentData.length === 0 ? (
                  <div className="p-20 text-center">
                    <Package size={40} className="text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-600 font-bold">No {activeTab} found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client</th>
                          <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                          <th className="hidden sm:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Service</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {currentData.map((item, idx) => {
                          const statusKey = (item.status || 'pending') as keyof typeof STATUS_CONFIG;
                          const sc = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                          return (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="hover:bg-white/5 transition-all group cursor-pointer"
                              onClick={() => setSelectedDetail(item)}
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 text-white font-black text-sm", ICON_GRADIENTS[idx % ICON_GRADIENTS.length])}>
                                      {(item.name || item.customer_name || "?")[0].toUpperCase()}
                                    </div>
                                    {activeTab === 'leads' && !item.viewed && (
                                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-[#111827] flex items-center justify-center" />
                                    )}
                                  </div>
                                  <div>
                                    <div className={cn("font-bold text-sm", activeTab === 'leads' && !item.viewed ? "text-white" : "text-slate-300")}>
                                      {item.name || item.customer_name || "Unknown"}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {activeTab === 'leads' && item.source && (
                                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border",
                                          item.source === 'exit_popup'
                                            ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
                                            : "bg-blue-500/20 border-blue-500/30 text-blue-400")}>
                                          {item.source === 'exit_popup' ? '⚡ Popup' : '📬 Form'}
                                        </span>
                                      )}
                                      {item.company && <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">{item.company}</span>}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="hidden md:table-cell px-6 py-5">
                                <div className="text-slate-300 text-sm font-bold">{item.phone || item.customer_phone || '—'}</div>
                                <div className="text-slate-600 text-xs mt-0.5 truncate max-w-[160px]">{item.email || item.customer_email || '—'}</div>
                              </td>
                              <td className="hidden sm:table-cell px-6 py-5">
                                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold rounded-xl uppercase tracking-wider">
                                  {item.service || item.service_type || 'General'}
                                </span>
                              </td>
                              <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                                <select
                                  value={item.status || 'pending'}
                                  onClick={e => e.stopPropagation()}
                                  onChange={(e) => { e.stopPropagation(); updateStatus(item.id, activeTab === 'leads' ? 'contacts' : 'bookings', e.target.value); }}
                                  className={cn("text-[10px] font-bold uppercase px-3 py-2 rounded-xl border cursor-pointer tracking-wider transition-all appearance-none min-w-[90px]", sc.color)}
                                  style={{ background: 'transparent' }}
                                >
                                  {['pending','verified','called','completed'].map(s => <option key={s} value={s} className="bg-[#111827] text-white normal-case font-bold">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                                </select>
                              </td>
                              <td className="px-6 py-5 text-slate-500 text-xs font-bold">
                                {new Date(item.created_at).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}
                              </td>
                              <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button onClick={(e) => { e.stopPropagation(); activeTab === 'leads' ? markAsViewed(item, 'lead') : setSelectedDetail(item); }} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 border border-white/10 hover:border-blue-500/30 rounded-xl transition-all" title="View Details">
                                    <Eye size={14} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); exportToPDF(item, activeTab === 'leads' ? 'lead' : 'booking'); }} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-xl transition-all" title="Export PDF">
                                    <Download size={14} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); setDeleteId({ table: activeTab === 'leads' ? 'contacts' : 'bookings', id: item.id }); }} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all" title="Delete">
                                    <Trash2 size={14} />
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
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-7 border-b border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-900/30">
                    <Zap size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Site Controller</h3>
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Manage section visibility</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(settings.section_visibility || {}).map(([key, val]: any) => (
                      <div key={key} className={cn(
                        "flex flex-col gap-4 p-5 border rounded-2xl transition-all cursor-pointer",
                        val ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10 hover:border-white/20"
                      )}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-white font-bold text-sm capitalize">{key.replace(/_/g, ' ')}</div>
                            <div className={cn("text-xs mt-0.5 font-bold uppercase tracking-wider", val ? "text-emerald-400" : "text-slate-500")}>
                              {val ? '● Visible' : '○ Hidden'}
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              const newVal = { ...settings.section_visibility, [key]: !val };
                              await supabase.from('site_settings').update({ value: newVal }).eq('key', 'section_visibility');
                              fetchData();
                            }}
                            className={cn("w-14 h-7 rounded-full transition-all relative flex items-center px-1 shrink-0", val ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-white/10")}
                          >
                            <div className={cn("w-5 h-5 bg-white rounded-full transition-all shadow-md", val ? "translate-x-7" : "translate-x-0")} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {Object.keys(settings.section_visibility || {}).length === 0 && (
                    <div className="p-12 text-center text-slate-600 font-bold">No settings found in database.</div>
                  )}
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
              onClick={() => setSelectedDetail(null)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-[#111827] border border-white/10 w-full max-w-4xl rounded-t-3xl md:rounded-3xl shadow-2xl z-10 overflow-hidden max-h-[95vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="relative px-7 py-6 border-b border-white/10 flex items-center justify-between gap-4 shrink-0 bg-gradient-to-r from-[#0D1117] to-[#111827]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-900/40 text-white font-black text-lg">
                    {(selectedDetail.name || selectedDetail.customer_name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xl">{selectedDetail.name || selectedDetail.customer_name || "Unknown"}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 text-xs font-bold">ID: {selectedDetail.id?.slice(0,8)}...</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Status Switcher */}
                  <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-1">
                    {['pending','verified','called','completed'].map(s => {
                      const sc = STATUS_CONFIG[s];
                      return (
                        <button key={s} onClick={() => updateStatus(selectedDetail.id, activeTab === 'leads' ? 'contacts' : 'bookings', s)}
                          className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all tracking-wider border",
                            selectedDetail.status === s ? sc.color : "text-slate-600 border-transparent hover:text-slate-300 hover:bg-white/5")}>
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setSelectedDetail(null)} className="w-10 h-10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 rounded-xl flex items-center justify-center transition-all">
                    <CloseIcon size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
                  
                  {/* Left - Client Info */}
                  <div className="border-b md:border-b-0 md:border-r border-white/10 p-7 space-y-6">
                    {/* Status badge */}
                    {(() => {
                      const sc = STATUS_CONFIG[(selectedDetail.status || 'pending')] || STATUS_CONFIG.pending;
                      return (
                        <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider", sc.color)}>
                          <span className={cn("w-2 h-2 rounded-full", sc.dot)} />
                          {selectedDetail.status || 'Pending'}
                        </div>
                      );
                    })()}

                    <div>
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">Client Details</p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                            <Users size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Name</p>
                            <p className="text-white font-bold text-sm">{selectedDetail.name || selectedDetail.customer_name || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shrink-0">
                            <Phone size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Phone</p>
                            <p className="text-white font-bold text-sm">{selectedDetail.phone || selectedDetail.customer_phone || 'N/A'}</p>
                          </div>
                        </div>
                        {(selectedDetail.email || selectedDetail.customer_email) && (
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shrink-0">
                              <MessageSquare size={16} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Email</p>
                              <p className="text-white font-bold text-xs break-all">{selectedDetail.email || selectedDetail.customer_email}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                            <Calendar size={16} className="text-white" />
                          </div>
                          <div>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Registered</p>
                            <p className="text-white font-bold text-sm">{new Date(selectedDetail.created_at).toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'})}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile status switcher */}
                    <div className="sm:hidden space-y-2">
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Update Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['pending','verified','called','completed'].map(s => {
                          const sc = STATUS_CONFIG[s];
                          return (
                            <button key={s} onClick={() => updateStatus(selectedDetail.id, activeTab === 'leads' ? 'contacts' : 'bookings', s)}
                              className={cn("px-3 py-3 text-[10px] font-black uppercase rounded-xl border transition-all text-center tracking-wider",
                                selectedDetail.status === s ? sc.color : "bg-white/5 border-white/10 text-slate-600")}>
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right - Technical Data List */}
                  <div className="p-7">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-5 flex items-center gap-3">
                      Technical Specifications <Activity size={12} className="text-blue-400" />
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
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <CheckCircle2 size={40} className="text-slate-700 mb-4" />
                          <p className="text-slate-600 font-bold">No additional technical data</p>
                        </div>
                      );

                      return (
                        <div className="space-y-3">
                          {filteredData.map(([k, v]: [string, any], index) => {
                            const Icon = KEY_ICONS[k.toLowerCase()] || Activity;
                            const gradient = ICON_GRADIENTS[index % ICON_GRADIENTS.length];
                            return (
                              <motion.div key={k}
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl group transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg", gradient)}>
                                    <Icon size={16} className="text-white" />
                                  </div>
                                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{getLabel(k)}</div>
                                </div>
                                <div className="text-white font-black text-sm tracking-tight">{formatValue(v)}</div>
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
              <div className="border-t border-white/10 px-7 py-5 shrink-0 flex items-center justify-between gap-3 bg-[#0D1117]">
                <span className="text-slate-600 text-xs font-bold uppercase tracking-widest hidden sm:block">Paddlog Admin · {activeTab === 'leads' ? 'Lead' : 'Booking'} Detail</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToPDF(selectedDetail, activeTab === 'leads' ? 'lead' : 'booking')}
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded-2xl font-bold text-sm transition-all"
                  >
                    <Download size={15} /> Export PDF
                  </button>
                  <button onClick={() => setSelectedDetail(null)}
                    className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-2xl font-bold text-sm transition-all">
                    <CloseIcon size={15} /> Close
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
