export default function ServicesLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin" />
        </div>
        <span className="text-slate-400 text-sm font-semibold tracking-widest uppercase">Loading...</span>
      </div>
    </div>
  );
}
