import { useState } from 'react';
import { Plus, ChevronDown, X, MoreHorizontal, Trash2, Edit3, Copy } from 'lucide-react';
import useStore from '../store/useStore';

export default function TableTabs() {
  const base = useStore(s => s.getActiveBase());
  const setActiveTable = useStore(s => s.setActiveTable);
  const addTable = useStore(s => s.addTable);
  const deleteTable = useStore(s => s.deleteTable);
  const renameTable = useStore(s => s.renameTable);
  const [addingTable, setAddingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenuTableId, setContextMenuTableId] = useState<string | null>(null);

  return (
    <div className="h-[32px] bg-[#F0EDF6] flex items-end px-2 gap-0" style={{ background: 'linear-gradient(180deg, #5B4CBF 0%, #4A3DAD 100%)' }}>
      {base.tables.map(table => {
        const isActive = table.id === base.activeTableId;

        if (editingTableId === table.id) {
          return (
            <div key={table.id} className="h-[28px] px-1 flex items-center bg-white rounded-t">
              <input
                autoFocus
                className="px-2 py-0.5 text-[12px] border border-blue-400 rounded bg-white outline-none min-w-[60px]"
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                onBlur={() => {
                  if (editingName.trim()) renameTable(table.id, editingName.trim());
                  setEditingTableId(null);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (editingName.trim()) renameTable(table.id, editingName.trim());
                    setEditingTableId(null);
                  } else if (e.key === 'Escape') setEditingTableId(null);
                }}
              />
            </div>
          );
        }

        return (
          <div
            key={table.id}
            className="relative group"
          >
            <button
              onClick={() => setActiveTable(table.id)}
              onDoubleClick={() => {
                setEditingTableId(table.id);
                setEditingName(table.name);
              }}
              className={`h-[28px] px-3 flex items-center gap-1.5 text-[12px] font-medium rounded-t transition-colors ${
                isActive
                  ? 'bg-white text-[#333]'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              <span className="truncate max-w-[120px]">{table.name}</span>
              <ChevronDown size={11} className={isActive ? 'text-[#999]' : 'text-white/50'} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setContextMenuTableId(contextMenuTableId === table.id ? null : table.id);
              }}
              className="absolute -right-0.5 top-[3px] p-0.5 rounded hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal size={12} className={isActive ? 'text-[#666]' : 'text-white/70'} />
            </button>

            {contextMenuTableId === table.id && (
              <div className="absolute left-0 top-full z-50 bg-white border border-[#E5E5E5] rounded-lg shadow-lg py-1 min-w-[160px] animate-fadeIn">
                <button
                  onClick={() => {
                    setEditingTableId(table.id);
                    setEditingName(table.name);
                    setContextMenuTableId(null);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-[#333] hover:bg-[#F5F5F5]"
                >
                  <Edit3 size={14} /> Rename table
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-[#333] hover:bg-[#F5F5F5]"
                  onClick={() => setContextMenuTableId(null)}
                >
                  <Copy size={14} /> Duplicate table
                </button>
                {base.tables.length > 1 && (
                  <button
                    onClick={() => {
                      deleteTable(table.id);
                      setContextMenuTableId(null);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-[13px] text-red-600 hover:bg-[#F5F5F5]"
                  >
                    <Trash2 size={14} /> Delete table
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add table button */}
      {addingTable ? (
        <div className="h-[28px] px-1 flex items-center bg-white/90 rounded-t">
          <input
            autoFocus
            className="px-2 py-0.5 text-[12px] border border-blue-400 rounded bg-white outline-none w-[120px]"
            placeholder="Table name"
            value={newTableName}
            onChange={e => setNewTableName(e.target.value)}
            onBlur={() => {
              if (newTableName.trim()) addTable(newTableName.trim());
              setNewTableName('');
              setAddingTable(false);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (newTableName.trim()) addTable(newTableName.trim());
                setNewTableName('');
                setAddingTable(false);
              } else if (e.key === 'Escape') {
                setNewTableName('');
                setAddingTable(false);
              }
            }}
          />
          <button onClick={() => { setNewTableName(''); setAddingTable(false); }} className="p-0.5 ml-0.5 text-[#999]">
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAddingTable(true)}
          className="h-[28px] px-2.5 flex items-center text-white/70 hover:bg-white/15 hover:text-white rounded-t transition-colors"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
