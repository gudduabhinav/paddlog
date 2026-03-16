"use client";

import { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, Users, Package, Bell,
  Trash2, CheckCircle, ExternalLink, LogOut, 
  Settings2, Eye, ShieldCheck, Zap, Activity, Menu,
  RefreshCcw, Database, Volume2, VolumeX, Download, X as CloseIcon, AlertTriangle, MessageSquare, Phone,
  MapPin, Navigation, Clock, CreditCard, Box, Calendar
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATION_SOUND = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

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

  // Responsive Check Utility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); // Reset sidebar state on desktop
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const KEY_ICONS: any = {
    phone: Phone,
    email: MessageSquare,
    weight: Activity,
    origin: MapPin,
    pickup: MapPin,
    destination: Navigation,
    cargo: Package,
    service: Zap,
    status: ShieldCheck,
    notes: MessageSquare,
    boxtype: Box,
    company: Users,
    duration: Clock,
    quantity: Package,
    material: Box,
    date: Calendar,
    payment: CreditCard
  };

  const [deleteId, setDeleteId] = useState<{table: string, id: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persistence check
  useEffect(() => {
    const auth = localStorage.getItem("paddlog_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Paddlog@2024") {
      setIsAuthenticated(true);
      localStorage.setItem("paddlog_admin_auth", "true");
      // Unlock audio context on user interaction
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current!.pause();
          audioRef.current!.currentTime = 0;
        }).catch(e => console.log("Audio unlock failed", e));
      }
      if ("Notification" in window) {
        Notification.requestPermission();
      }
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
      
      const settingsMap = siteSettings?.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
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
      
        const channel = supabase
        .channel('paddlog_admin_v5')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'contacts' },
          () => {
            handleNewEntry('leads');
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'bookings' },
          () => {
            handleNewEntry('shipments');
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated]);

  const handleNewEntry = (type: 'leads' | 'shipments') => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn("Audio blocked", e));
    }
    
    if (type === 'leads') {
      setNewLeadsAlert(true);
      setTimeout(() => setNewLeadsAlert(false), 8000);
    } else {
      setNewBookingsAlert(true);
      setTimeout(() => setNewBookingsAlert(false), 8000);
    }

    setIsAlertActive(true);
    setTimeout(() => setIsAlertActive(false), 5000);
    fetchData();
  };

  const updateStatus = async (id: string, table: string, newStatus: string) => {
    try {
      const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
      if (error) {
        console.error(`Supabase Update Error [${table}]:`, error);
        throw error;
      }
      
      // Update local state
      if (table === 'contacts') {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        if (selectedDetail?.id === id) setSelectedDetail((prev: any) => ({ ...prev, status: newStatus }));
      } else {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        if (selectedDetail?.id === id) setSelectedDetail((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err: any) {
      console.error("Critical Status Failure:", err.message || err);
      alert(`Status update failed: ${err.message || "Please ensure 'status' column exists in Supabase"}`);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId || isDeleting) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.from(deleteId.table).delete().eq('id', deleteId.id);
      if (error) throw error;
      
      if (deleteId.table === 'contacts') setContacts(prev => prev.filter(c => c.id !== deleteId.id));
      else setBookings(prev => prev.filter(b => b.id !== deleteId.id));
      
      setDeleteId(null);
    } catch (err) {
      alert("Database error: Could not delete.");
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const exportToCSV = (tableData: any[], fileName: string) => {
    if (tableData.length === 0) return;
    const headers = Object.keys(tableData[0]).join(",");
    const rows = tableData.map(row => 
      Object.values(row).map(value => typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value).join(",")
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-roboto">
        <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] w-full max-w-sm shadow-2xl">
          <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
             <img src="/logo.png" className="w-16 h-16 object-contain" alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Paddlog Ops</h1>
          <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Administrative Control</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="password" 
              placeholder="System Access Key"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:border-[#E53935] focus:ring-4 focus:ring-[#E53935]/5 transition-all text-center font-bold tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-[#E53935] hover:bg-[#B71C1C] text-white py-4 rounded-2xl font-bold tracking-widest text-sm transition-all shadow-lg active:scale-95">
              AUTHENTICATE
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-roboto select-none overflow-x-hidden">
      <audio ref={audioRef} src={NOTIFICATION_SOUND} preload="auto" />

      {/* Mobile Header Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-[60] shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-8 w-auto object-contain" alt="logo" />
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-50 text-slate-500 rounded-xl border border-slate-100"
          >
            {isSidebarOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>
      )}
      
      {/* Custom Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-50 text-[#E53935] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Delete Record?</h3>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">This entry will be wiped from our secure database clusters forever.</p>
            <div className="grid grid-cols-2 gap-4">
               <button 
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all font-roboto"
               >
                Cancel
               </button>
               <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="py-4 px-6 bg-[#E53935] text-white rounded-2xl font-bold hover:bg-[#B71C1C] transition-all shadow-lg shadow-red-200 flex items-center justify-center font-roboto"
               >
                {isDeleting ? <RefreshCcw size={20} className="animate-spin" /> : "Verify Delete"}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Sidebar Drawer */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <>
            {/* Mobile Overlay */}
            {isMobile && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]"
              />
            )}
            
            <motion.aside 
              initial={isMobile ? { x: -320 } : undefined}
              animate={{ x: 0 }}
              exit={isMobile ? { x: -320 } : undefined}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "bg-white border-r border-slate-200 flex flex-col p-8 font-roboto",
                isMobile 
                  ? "fixed inset-y-0 left-0 w-80 z-[80] shadow-2xl" 
                  : "sticky top-0 h-screen w-80 shrink-0"
              )}
            >
              <div className="flex flex-col items-center mb-12 px-2">
                <img src="/logo.png" className="h-24 w-auto object-contain mb-4" alt="logo" />
                <div className="h-px w-full bg-slate-100 mt-6" />
              </div>

              <div className="flex flex-col gap-2">
                <NavItem active={activeTab === 'overview'} icon={LayoutDashboard} label="Live Monitoring" onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} />
                <NavItem active={activeTab === 'leads'} icon={Users} label="Inbound Leads" onClick={() => { setActiveTab('leads'); setNewLeadsAlert(false); setIsSidebarOpen(false); }} count={contacts.length} alert={newLeadsAlert} />
                <NavItem active={activeTab === 'bookings'} icon={Package} label="Shipment Orders" onClick={() => { setActiveTab('bookings'); setNewBookingsAlert(false); setIsSidebarOpen(false); }} count={bookings.length} alert={newBookingsAlert} />
                <NavItem active={activeTab === 'settings'} icon={Settings2} label="Site Control" onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} />
              </div>
              
              <button 
                onClick={logout} 
                className="mt-auto flex items-center justify-center gap-4 px-5 py-5 text-slate-400 hover:text-[#E53935] hover:bg-red-50 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest border border-transparent hover:border-red-100"
              >
                <LogOut size={18} /> Disconnect Session
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className={cn("flex-1 flex flex-col min-w-0 font-roboto", isMobile && "pt-16")}>
        <header className="h-20 border-b border-slate-100 px-6 md:px-8 flex items-center justify-between sticky top-0 md:top-0 z-20 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4 md:gap-6">
             <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-green-50 rounded-xl md:rounded-2xl border border-green-100">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] md:text-[10px] font-bold text-green-700 uppercase tracking-widest">Live Uptime</span>
             </div>
             <div className="hidden lg:flex items-center gap-2 text-slate-300">
               <Database size={14} />
               <span className="text-[10px] font-bold uppercase">Node: Supabase Stable</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 font-roboto">
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled && audioRef.current) {
                  audioRef.current.play().catch(() => {});
                }
              }}
              className={cn("flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl md:rounded-2xl border transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest", 
                soundEnabled ? "bg-red-50 border-red-100 text-[#E53935] shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400")}
            >
              {soundEnabled ? <Volume2 size={14} className="md:w-4 md:h-4" /> : <VolumeX size={14} className="md:w-4 md:h-4" />}
              <span className="hidden xs:inline">{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
            </button>

            <button 
              onClick={fetchData} 
              className={cn("p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-100 rounded-xl md:rounded-2xl transition-all", loading && "animate-spin")}
            >
              <RefreshCcw size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </header>

        <div className="p-6 md:p-12">
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
            
            {/* New Alert Banner */}
            {isAlertActive && (
              <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl animate-in slide-in-from-top-10 duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#E53935] rounded-2xl flex items-center justify-center animate-pulse">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg uppercase">Update Detected</h4>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">New data stream confirmed across clusters.</p>
                  </div>
                </div>
                <button onClick={() => setIsAlertActive(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors">
                  <CloseIcon size={20} />
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                   {activeTab === 'overview' ? "Dashboard" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                   <span className="text-[#E53935] ml-1">.</span>
                </h1>
                <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mt-3 md:mt-4">Operational Fleet Monitoring</p>
              </div>
              
              {(activeTab === 'leads' || activeTab === 'bookings') && (
                <button 
                  onClick={() => exportToCSV(activeTab === 'leads' ? contacts : bookings, activeTab)}
                  className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl w-full md:w-auto"
                >
                  <Download size={16} /> Export Cloud Data
                </button>
              )}
            </div>

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard 
                  label="Leads Ingress" 
                  value={contacts.length} 
                  icon={MessageSquare} 
                  color="red" 
                  onClick={() => setActiveTab('leads')}
                  activeSection={true}
                />
                <StatCard 
                  label="Order Stack" 
                  value={bookings.length} 
                  icon={Package} 
                  color="blue" 
                  onClick={() => setActiveTab('bookings')}
                  activeSection={true}
                />
                <StatCard 
                  label="Live Uptime" 
                  value="100%" 
                  icon={Activity} 
                  color="green" 
                  onClick={fetchData}
                  activeSection={false}
                />
              </div>
            )}

            {(activeTab === 'leads' || activeTab === 'bookings') && (
              <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden font-roboto">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Identification</th>
                        <th className="hidden sm:table-cell px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Service Unit</th>
                        <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Date Logged</th>
                        <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Cluster Ops</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(activeTab === 'leads' ? contacts : bookings).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-4 md:px-8 py-4 md:py-6">
                            <div className="font-bold text-base md:text-lg text-slate-800 leading-tight truncate max-w-[120px] md:max-w-none">
                              {item.name || item.customer_name || "Unknown Client"}
                            </div>
                            <div className="flex flex-col gap-0.5 mt-1">
                              { (item.phone || item.customer_phone) && (
                                <div className="text-[10px] md:text-[11px] text-[#E53935] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                  <Phone size={10} />
                                  {item.phone || item.customer_phone}
                                </div>
                              )}
                              {(item.email || item.customer_email) && !(item.email?.includes('exitpopup')) && (
                                <div className="hidden sm:block text-[10px] text-slate-400 font-bold uppercase tracking-wider opacity-80 truncate max-w-[150px]">
                                  {item.email || item.customer_email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-4 md:px-8 py-4 md:py-6">
                            <span className="px-2 md:px-3 py-1 bg-white border border-slate-200 text-slate-500 text-[9px] md:text-[10px] font-bold rounded-lg md:rounded-xl uppercase tracking-widest shadow-sm">
                              {item.service || item.service_type || 'General'}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs text-slate-400 font-bold uppercase">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                            <div className="flex items-center justify-end gap-1 md:gap-2">
                              <button 
                                onClick={() => setSelectedDetail(item)}
                                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-100 rounded-lg md:rounded-xl transition-all"
                              >
                                <Eye size={16} className="md:w-[18px] md:h-[18px]" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteId({ table: activeTab === 'leads' ? 'contacts' : 'bookings', id: item.id });
                                }}
                                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white text-slate-200 hover:text-[#E53935] hover:bg-red-50 hover:border-red-100 border border-slate-100 rounded-lg md:rounded-xl transition-all"
                              >
                                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/30">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-[#E53935] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Main Logic Controller</h3>
                </div>
                <div className="space-y-4 font-roboto">
                  {Object.entries(settings.section_visibility || {}).map(([key, val]: any) => (
                    <div key={key} className="flex items-center justify-between p-7 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-[#E53935]/20 transition-all group">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors uppercase">{key.replace('_', ' ')}</span>
                      <button 
                        onClick={async () => {
                          const newVal = { ...settings.section_visibility, [key]: !val };
                          await supabase.from('site_settings').update({ value: newVal }).eq('key', 'section_visibility');
                          fetchData();
                        }}
                        className={cn("w-14 h-7 rounded-full transition-all relative flex items-center px-1.5", val ? "bg-[#E53935] shadow-lg shadow-red-200" : "bg-slate-300")}
                      >
                        <div className={cn("w-4 h-4 bg-white rounded-full transition-all shadow-md", val ? "translate-x-7" : "translate-x-0")} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal - Fully Responsive High-Fidelity Dashboard */}
      <AnimatePresence>
        {selectedDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetail(null)}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 1, y: '100%' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white w-full h-full md:h-auto md:max-w-6xl md:rounded-[2.5rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-screen md:max-h-[94vh]"
            >
                {/* Header Section - Mobile Optimized */}
                <div className="bg-slate-900 text-white p-5 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 shrink-0">
                   <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-[#E53935] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                         <Package size={24} className="md:hidden" />
                         <Package size={32} className="hidden md:block" />
                      </div>
                      <div className="min-w-0">
                         <h3 className="text-xl md:text-3xl font-black tracking-tight uppercase truncate">Operational Intel</h3>
                         <div className="flex items-center gap-2 md:gap-3 mt-1">
                             <span className="px-2 py-0.5 bg-white/10 rounded text-[8px] md:text-[10px] font-black tracking-widest uppercase truncate max-w-[120px]">ID: {selectedDetail.id?.slice(0,12)}</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between md:justify-end gap-4">
                      {/* Desktop Status Pill Group */}
                      <div className="hidden md:flex bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-1">
                        {['pending', 'verified', 'called', 'completed'].map((s) => (
                          <button 
                            key={s}
                            onClick={() => updateStatus(selectedDetail.id, activeTab === 'leads' ? 'contacts' : 'bookings', s)}
                            className={cn("px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all", 
                              selectedDetail.status === s 
                                ? "bg-[#E53935] text-white" 
                                : "text-white/30 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      
                      {/* Mobile Visible Close Button */}
                      <button 
                        onClick={() => setSelectedDetail(null)}
                        className="ml-auto w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-[#E53935] text-white rounded-xl md:rounded-2xl flex items-center justify-center transition-all border border-white/10"
                      >
                        <CloseIcon size={24} />
                      </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
                   <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
                      
                      {/* Left Column: Fixed core info on desktop, stacks on mobile */}
                      <div className="bg-white border-b lg:border-b-0 lg:border-r border-slate-100 p-6 md:p-12 space-y-10 md:space-y-12">
                         <section>
                            <h4 className="text-[10px] font-black text-[#E53935] uppercase tracking-[0.4em] mb-6 md:mb-10 flex items-center gap-2">
                               <span className="w-1 h-4 bg-[#E53935] rounded-full" />
                               Primary Target
                            </h4>
                            
                            <div className="space-y-8">
                               <div>
                                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-widest block mb-1">Legal Identifier</label>
                                  <div className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase break-words">
                                     {selectedDetail.name || selectedDetail.customer_name || "Unknown Entity"}
                                  </div>
                               </div>

                               <div className="space-y-4">
                                  <div className="p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100">
                                     <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Direct Line</label>
                                     <div className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3">
                                        <Phone size={18} className="text-[#E53935]" />
                                        {selectedDetail.phone || selectedDetail.customer_phone || "No Link"}
                                     </div>
                                  </div>
                                  {selectedDetail.email && !selectedDetail.email.includes('no-email') && (
                                     <div className="p-5 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Encrypted Mail</label>
                                        <div className="text-sm font-bold text-slate-700 flex items-center gap-3 break-all">
                                           <MessageSquare size={18} className="text-slate-300" />
                                           {selectedDetail.email}
                                        </div>
                                     </div>
                                  )}
                               </div>
                            </div>
                         </section>

                         {/* Mobile Status Controls */}
                         <div className="md:hidden space-y-4">
                            <label className="text-[9px] font-bold text-slate-300 uppercase tracking-widest block font-black">Status Management</label>
                            <div className="grid grid-cols-2 gap-2">
                               {['pending', 'verified', 'called', 'completed'].map((s) => (
                                <button 
                                   key={s}
                                   onClick={() => updateStatus(selectedDetail.id, activeTab === 'leads' ? 'contacts' : 'bookings', s)}
                                   className={cn("px-4 py-3 text-[10px] font-black uppercase rounded-xl border transition-all text-center", 
                                     selectedDetail.status === s 
                                       ? "bg-[#E53935] text-white border-[#E53935]" 
                                       : "bg-white text-slate-400 border-slate-100"
                                   )}
                                >
                                   {s}
                                </button>
                               ))}
                            </div>
                         </div>

                         <section className="pt-8 border-t border-slate-50">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                               <span className="text-[9px] font-black text-slate-400 uppercase">Registered</span>
                               <span className="text-[10px] font-black text-slate-900">{new Date(selectedDetail.created_at).toLocaleDateString()}</span>
                            </div>
                         </section>
                      </div>

                      {/* Right Column: Cards Grid */}
                      <div className="p-6 md:p-12 lg:p-16">
                         <div className="max-w-5xl mx-auto">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-8 md:mb-12 flex items-center gap-4">
                               Technical Specs 
                               <Activity size={12} className="text-[#E53935]" />
                            </h4>
                            
                            {(() => {
                               let displayData = selectedDetail.service_details || selectedDetail.message || {};
                               if (typeof displayData === 'string' && displayData.startsWith('{')) {
                                  try { displayData = JSON.parse(displayData); } catch(e) {}
                               }

                               if (typeof displayData === 'object' && Object.keys(displayData).length > 0) {
                                  // Organise data into a clean list instead of cards
                                  const getLabel = (key: string) => {
                                    const labels: any = {
                                      serviceId: 'Service Type', isDG: 'Dangerous Goods', unNumber: 'UN Number',
                                      packingGroup: 'Packing Group', origin: 'Origin Hub', destination: 'Target Hub',
                                      cargoType: 'Cargo Classification', boxType: 'Packaging Type', isImport: 'Importation'
                                    };
                                    return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                                  };

                                  const formatValue = (val: any) => {
                                    if (typeof val === 'boolean') return val ? 'YES' : 'NO';
                                    if (val === 'true') return 'YES';
                                    if (val === 'false') return 'NO';
                                    return String(val);
                                  };

                                  const filteredData = Object.entries(displayData).filter(([k]) => 
                                    !['name', 'email', 'phone', 'customer_name', 'customer_email', 'customer_phone', 'id', 'created_at'].includes(k.toLowerCase())
                                  );

                                  return (
                                    <div className="space-y-1">
                                      {filteredData.map(([k, v]: [string, any], index) => {
                                        const Icon = KEY_ICONS[k.toLowerCase()] || Activity;
                                        return (
                                          <motion.div 
                                            key={k}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between py-5 px-6 md:px-10 hover:bg-slate-50 border-b border-slate-100 group transition-all"
                                          >
                                            <div className="flex items-center gap-5">
                                              <div className="w-10 h-10 bg-white border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-[#E53935] group-hover:text-white transition-all shadow-sm">
                                                <Icon size={16} />
                                              </div>
                                              <div>
                                                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{getLabel(k)}</div>
                                              </div>
                                            </div>
                                            <div className="text-slate-900 font-black text-sm md:text-lg tracking-tight uppercase pl-14 sm:pl-0">
                                              {formatValue(v)}
                                            </div>
                                          </motion.div>
                                        );
                                      })}
                                    </div>
                                  );
                               }

                               return (
                                  <div className="p-10 md:p-20 bg-white rounded-[2rem] md:rounded-[4rem] border border-slate-100 text-center">
                                     <p className="text-lg md:text-2xl font-black text-slate-900 italic opacity-40">
                                        "{String(displayData) || "Payload empty."}"
                                     </p>
                                  </div>
                               );
                            })()}

                            <div className="mt-12 md:mt-20 pt-10 border-t border-slate-100">
                                <button 
                                   onClick={() => setSelectedDetail(null)}
                                   className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-[#E53935] transition-all flex items-center justify-center gap-3"
                                >
                                   <ShieldCheck size={18} /> Exit Matrix
                                </button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
     </main>
  );
}

function NavItem({ active, icon: Icon, label, onClick, count, alert }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest h-16 relative",
        active ? "bg-slate-900 text-white shadow-2xl" : "text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Icon size={20} className={cn(active ? "text-[#E53935]" : "text-slate-300")} />
          {alert && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
        {label}
      </div>
      {count !== undefined && (
        <span className={cn("text-[10px] px-2.5 py-1 rounded-lg font-bold", active ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400")}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color, onClick, activeSection }: any) {
  const styles: any = {
    red: "bg-red-50 text-[#E53935] border-red-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100"
  };
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-100 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/20 flex flex-col items-center text-center group hover:-translate-y-2 transition-all cursor-pointer",
        activeSection && "hover:border-[#E53935]/30"
      )}
    >
      <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 border shadow-sm group-hover:scale-110 transition-transform", styles[color])}>
        <Icon size={24} className="md:w-8 md:h-8" />
      </div>
      <div className="text-4xl md:text-6xl font-black text-slate-900 mb-2 leading-none">{value}</div>
      <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none mt-2">{label}</div>
    </div>
  );
}
