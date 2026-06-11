import { useState } from 'react';
import {
  PanelLeft, Search, Plus, LayoutGrid, Kanban, Calendar, GalleryHorizontal,
  FileText, ChevronRight, ChevronDown, MoreHorizontal, Grid3x3, Trash2, Edit3,
} from 'lucide-react';
import useStore from '../store/useStore';
import type { ViewType } from '../types';

const viewIcons: Record<ViewType, React.ComponentType<{ size?: number; className?: string }>> = {
  grid: Grid3x3,
  kanban: Kanban,
  calendar: Calendar,
  gallery: GalleryHorizontal,
  form: FileText,
  gantt: LayoutGrid,
};

const viewLabels: Record<ViewType, string> = {
  grid: 'Grid view',
  kanban: 'Kanban view',
  calendar: 'Calendar view',
  gallery: 'Gallery view',
  form: 'Form view',
  gantt: 'Gantt view',
};

export default function Sidebar() {
  const sidebarOpen = useStore(s => s.ui.sidebarOpen);
  const setSidebarOpen = useStore(s => s.setSidebarOpen);
  const table = useStore(s => s.getActiveTable());
  const activeView = useStore(s => s.getActiveView());
  const setActiveView = useStore(s => s.setActiveView);
  const addView = useStore(s => s.addView);
  const deleteView = useStore(s => s.deleteView);
  const renameView = useStore(s => s.renameView);
  const [viewsExpanded, setViewsExpanded] = useState(true);
  const [addingView, setAddingView] = useState(false);
  const [editingViewId, setEditingViewId] = useState<string | null>(null);
  const [editingViewName, setEditingViewName] = useState('');
  const [contextMenuViewId, setContextMenuViewId] = useState<string | null>(null);

  if (!sidebarOpen) return null;

  return (
    <div className="w-[260px] min-w-[260px] h-full bg-[#F8F8F8] border-r border-[#E5E5E5] flex flex-col">
      {/* Top section */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E5E5]">
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 rounded hover:bg-[#E5E5E5] text-[#666]"
        >
          <PanelLeft size={16} />
        </button>
        <button className="p-1 rounded hover:bg-[#E5E5E5] text-[#666]">
          <Search size={16} />
        </button>
      </div>

      {/* Views section */}
      <div className="flex-1 overflow-y-auto px-1 py-2">
        <button
          onClick={() => setViewsExpanded(!viewsExpanded)}
          className="flex items-center gap-1 px-2 py-1 w-full text-[11px] font-semibold text-[#666] uppercase tracking-wide hover:bg-[#EBEBEB] rounded"
        >
          {viewsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Views
        </button>

        {viewsExpanded && (
          <div className="mt-0.5">
            {table.views.map(view => {
              const Icon = viewIcons[view.type] ?? Grid3x3;
              const isActive = view.id === activeView.id;

              if (editingViewId === view.id) {
                return (
                  <div key={view.id} className="px-2 py-0.5">
                    <input
                      autoFocus
                      className="w-full px-2 py-1 text-[13px] border border-blue-400 rounded bg-white outline-none"
                      value={editingViewName}
                      onChange={e => setEditingViewName(e.target.value)}
                      onBlur={() => {
                        if (editingViewName.trim()) renameView(view.id, editingViewName.trim());
                        setEditingViewId(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (editingViewName.trim()) renameView(view.id, editingViewName.trim());
                          setEditingViewId(null);
                        } else if (e.key === 'Escape') {
                          setEditingViewId(null);
                        }
                      }}
                    />
                  </div>
                );
              }

              return (
                <div key={view.id} className="relative group">
                  <button
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center gap-2 w-full px-3 py-1.5 text-[13px] rounded-sm transition-colors ${
                      isActive
                        ? 'bg-[#DDE8FD] text-[#2D5CD0] font-medium'
                        : 'text-[#333] hover:bg-[#EBEBEB]'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-[#2D5CD0]' : 'text-[#909090]'} />
                    <span className="truncate">{view.name}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextMenuViewId(contextMenuViewId === view.id ? null : view.id);
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[#D5D5D5] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal size={14} className="text-[#666]" />
                  </button>

                  {contextMenuViewId === view.id && (
                    <div className="absolute right-0 top-full z-50 bg-white border border-[#E5E5E5] rounded-lg shadow-lg py-1 min-w-[160px] animate-fadeIn">
                      <button
                        onClick={() => {
                          setEditingViewId(view.id);
                          setEditingViewName(view.name);
                          setContextMenuViewId(null);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-[#333] hover:bg-[#F5F5F5]"
                      >
                        <Edit3 size={14} /> Rename view
                      </button>
                      {table.views.length > 1 && (
                        <button
                          onClick={() => {
                            deleteView(view.id);
                            setContextMenuViewId(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-red-600 hover:bg-[#F5F5F5]"
                        >
                          <Trash2 size={14} /> Delete view
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add view */}
            {addingView ? (
              <div className="px-2 py-1">
                <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-3 animate-fadeIn">
                  <p className="text-[12px] font-semibold text-[#333] mb-2">Create a view</p>
                  <div className="space-y-1">
                    {(['grid', 'kanban', 'calendar', 'gallery', 'form'] as ViewType[]).map(type => {
                      const Icon = viewIcons[type];
                      return (
                        <button
                          key={type}
                          onClick={() => {
                            addView(viewLabels[type], type);
                            setAddingView(false);
                          }}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-[13px] text-[#333] hover:bg-[#F5F5F5] rounded"
                        >
                          <Icon size={15} className="text-[#909090]" />
                          {viewLabels[type]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingView(true)}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-[#666] hover:bg-[#EBEBEB] rounded-sm mt-0.5"
              >
                <Plus size={15} className="text-[#909090]" />
                Create a view
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
