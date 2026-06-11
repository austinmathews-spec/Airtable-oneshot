import {
  EyeOff, Filter, ArrowUpDown, Layers, Palette, ArrowDownUp,
  Search, X, RowsIcon, ChevronDown,
} from 'lucide-react';
import useStore from '../store/useStore';

export default function Toolbar() {
  const view = useStore(s => s.getActiveView());
  const ui = useStore(s => s.ui);
  const setSearchOpen = useStore(s => s.setSearchOpen);
  const setSearchQuery = useStore(s => s.setSearchQuery);
  const setFilterPanelOpen = useStore(s => s.setFilterPanelOpen);
  const setSortPanelOpen = useStore(s => s.setSortPanelOpen);
  const setGroupPanelOpen = useStore(s => s.setGroupPanelOpen);
  const setHiddenFieldsPanelOpen = useStore(s => s.setHiddenFieldsPanelOpen);
  const setRowColorPanelOpen = useStore(s => s.setRowColorPanelOpen);

  const filterCount = view.filters.length;
  const sortCount = view.sorts.length;
  const groupCount = view.groups.length;
  const hiddenCount = view.hiddenFieldIds.length;

  return (
    <div className="h-[36px] bg-white border-b border-[#E2E2E2] flex items-center px-3 gap-0.5">
      {/* View type label */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#F3F3F3] cursor-pointer text-[13px] text-[#333] font-medium mr-1">
        <RowsIcon size={14} className="text-[#666]" />
        {view.name}
        <ChevronDown size={12} className="text-[#999]" />
      </div>

      <div className="w-px h-4 bg-[#E2E2E2] mx-1" />

      {/* Toolbar buttons */}
      <ToolbarButton
        icon={EyeOff}
        label="Hide fields"
        active={ui.hiddenFieldsPanelOpen}
        badge={hiddenCount > 0 ? hiddenCount : undefined}
        onClick={() => setHiddenFieldsPanelOpen(!ui.hiddenFieldsPanelOpen)}
      />
      <ToolbarButton
        icon={Filter}
        label="Filter"
        active={ui.filterPanelOpen}
        badge={filterCount > 0 ? filterCount : undefined}
        onClick={() => setFilterPanelOpen(!ui.filterPanelOpen)}
      />
      <ToolbarButton
        icon={Layers}
        label="Group"
        active={ui.groupPanelOpen}
        badge={groupCount > 0 ? groupCount : undefined}
        onClick={() => setGroupPanelOpen(!ui.groupPanelOpen)}
      />
      <ToolbarButton
        icon={ArrowUpDown}
        label="Sort"
        active={ui.sortPanelOpen}
        badge={sortCount > 0 ? sortCount : undefined}
        onClick={() => setSortPanelOpen(!ui.sortPanelOpen)}
      />
      <ToolbarButton
        icon={Palette}
        label="Color"
        active={ui.rowColorPanelOpen}
        onClick={() => setRowColorPanelOpen(!ui.rowColorPanelOpen)}
      />
      <ToolbarButton
        icon={ArrowDownUp}
        label="Row height"
        onClick={() => {}}
      />

      <div className="flex-1" />

      {/* Search */}
      {ui.searchOpen ? (
        <div className="flex items-center gap-1 bg-[#F5F5F5] border border-[#D5D5D5] rounded px-2 py-1 animate-fadeIn">
          <Search size={14} className="text-[#999]" />
          <input
            autoFocus
            className="bg-transparent outline-none text-[13px] text-[#333] w-[200px] placeholder-[#999]"
            placeholder="Find in view"
            value={ui.searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setSearchOpen(false);
                setSearchQuery('');
              }
            }}
          />
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
            className="p-0.5 rounded hover:bg-[#E5E5E5]"
          >
            <X size={14} className="text-[#999]" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setSearchOpen(true)}
          className="p-1.5 rounded hover:bg-[#F3F3F3] text-[#666]"
        >
          <Search size={16} />
        </button>
      )}
    </div>
  );
}

function ToolbarButton({ icon: Icon, label, active, badge, onClick }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2 py-1 rounded text-[13px] transition-colors ${
        active
          ? 'bg-[#EBF1FF] text-[#2D5CD0]'
          : badge
          ? 'text-[#2D5CD0] hover:bg-[#F3F3F3]'
          : 'text-[#666] hover:bg-[#F3F3F3]'
      }`}
    >
      <Icon size={14} />
      <span>{label}</span>
      {badge !== undefined && (
        <span className="bg-[#2D7FF9] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}
