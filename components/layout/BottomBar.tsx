interface BottomBarProps {
  onAddNode: (color: string) => void;
}

export function BottomBar({ onAddNode }: BottomBarProps) {
  const buttons = [
    { color: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20", value: "#4f46e5" },
    { color: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20", value: "#059669" },
    { color: "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20", value: "#e11d48" },
    { color: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20", value: "#d97706" }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="h-14 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 flex items-center px-3 gap-2 group">
        {buttons.map((btn, i) => (
          <button 
            key={i}
            onClick={() => onAddNode(btn.value)}
            className={`h-9 w-9 rounded-xl ${btn.color} text-white transition-all duration-200 flex items-center justify-center border border-white/10 active:scale-90 shadow-lg`}
            aria-label={`Add node ${i + 1}`}
          >
            {/* Button content empty */}
          </button>
        ))}
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button 
          className="h-9 w-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-200 flex items-center justify-center border border-white/10 active:scale-90"
          aria-label="More"
        >
          {/* Button content empty */}
        </button>
      </div>
    </div>
  );
}
