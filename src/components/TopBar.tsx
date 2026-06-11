import { Bell, HelpCircle, Clock, Share2, ChevronDown, Sparkles, LayoutGrid, Zap, PanelLeft, Users } from 'lucide-react';
import useStore from '../store/useStore';

export default function TopBar() {
  const base = useStore(s => s.getActiveBase());
  const sidebarOpen = useStore(s => s.ui.sidebarOpen);
  const setSidebarOpen = useStore(s => s.setSidebarOpen);

  return (
    <div className="h-[44px] flex items-center px-3 gap-1" style={{ background: '#4338A0' }}>
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded hover:bg-white/15 text-white/80 mr-1"
        >
          <PanelLeft size={16} />
        </button>
      )}

      {/* Airtable logo */}
      <div className="flex items-center mr-1">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
          <path d="M11.5 3.5L2 8l9.5 4.5L21 8l-9.5-4.5z" fill="#FCB400"/>
          <path d="M12.5 3.5L22 8l-9.5 4.5L3 8l9.5-4.5z" fill="#18BFFF"/>
          <path d="M12 13v8l-10-5V8l10 5z" fill="#F82B60"/>
          <path d="M12 13v8l10-5V8L12 13z" fill="#7C3AED"/>
        </svg>
      </div>

      {/* Base name and icon */}
      <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 cursor-pointer">
        <div className="w-5 h-5 rounded flex items-center justify-center text-white" style={{ background: base.color }}>
          <LayoutGrid size={12} />
        </div>
        <span className="text-white font-semibold text-[13px]">{base.name}</span>
        <ChevronDown size={14} className="text-white/60" />
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center ml-3 gap-0.5">
        {[
          { label: 'Data', icon: LayoutGrid, active: true },
          { label: 'Automations', icon: Zap, active: false },
          { label: 'Interfaces', icon: LayoutGrid, active: false },
        ].map(tab => (
          <button
            key={tab.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-medium transition-colors ${
              tab.active ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
        <button className="flex items-center gap-1 px-2 py-1.5 rounded text-white/60 hover:bg-white/10 hover:text-white/80 text-[13px]">
          <Sparkles size={14} />
          AI
        </button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side buttons */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded hover:bg-white/15 text-white/70">
          <Clock size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-white/15 text-white/70">
          <HelpCircle size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-white/15 text-white/70 relative">
          <Bell size={16} />
        </button>

        {/* Collaborators */}
        <div className="flex items-center -space-x-1 mx-2">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-semibold ring-2 ring-[#4338A0]">
            A
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[13px] font-medium">
          <Share2 size={14} />
          Share
        </button>

        <button className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-white/15 text-white/70 text-[13px]">
          <Users size={14} />
          Views
        </button>
      </div>
    </div>
  );
}
