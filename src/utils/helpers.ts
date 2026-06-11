import { SELECT_COLORS } from '../types';
import type { CellValue, Field, Record, FilterConfig, SortConfig, GroupConfig } from '../types';

export function getSelectColor(colorValue: string) {
  return SELECT_COLORS.find(c => c.value === colorValue) ?? { bg: '#EEEEEE', text: '#424242', name: 'Default', value: 'default' };
}

export function formatCellValue(value: CellValue, field: Field): string {
  if (value === null || value === undefined || value === '') return '';
  switch (field.type) {
    case 'currency':
      return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'percent':
      return `${Math.round(Number(value) * 100)}%`;
    case 'number':
      return String(value);
    case 'rating':
      return String(value);
    case 'checkbox':
      return value ? 'true' : 'false';
    case 'date':
      if (!value) return '';
      try {
        return new Date(value as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch {
        return String(value);
      }
    default:
      if (Array.isArray(value)) return value.join(', ');
      return String(value);
  }
}

export function applySorts(records: Record[], sorts: SortConfig[], fields: Field[]): Record[] {
  if (sorts.length === 0) return records;
  return [...records].sort((a, b) => {
    for (const sort of sorts) {
      const field = fields.find(f => f.id === sort.fieldId);
      if (!field) continue;
      const valA = a.cells[sort.fieldId];
      const valB = b.cells[sort.fieldId];
      let cmp: number;
      if (valA == null && valB == null) cmp = 0;
      else if (valA == null) cmp = -1;
      else if (valB == null) cmp = 1;
      else if (field.type === 'number' || field.type === 'currency' || field.type === 'percent' || field.type === 'rating') {
        cmp = Number(valA) - Number(valB);
      } else if (field.type === 'checkbox') {
        cmp = (valA ? 1 : 0) - (valB ? 1 : 0);
      } else {
        cmp = String(valA).localeCompare(String(valB));
      }
      if (cmp !== 0) return sort.direction === 'desc' ? -cmp : cmp;
    }
    return 0;
  });
}

export function applyFilters(records: Record[], filters: FilterConfig[]): Record[] {
  if (filters.length === 0) return records;
  return records.filter(record => {
    return filters.every(filter => {
      const value = record.cells[filter.fieldId];
      const strVal = value == null ? '' : Array.isArray(value) ? value.join(', ') : String(value);
      switch (filter.operator) {
        case 'contains': return strVal.toLowerCase().includes(filter.value.toLowerCase());
        case 'doesNotContain': return !strVal.toLowerCase().includes(filter.value.toLowerCase());
        case 'is': return strVal.toLowerCase() === filter.value.toLowerCase();
        case 'isNot': return strVal.toLowerCase() !== filter.value.toLowerCase();
        case 'isEmpty': return !strVal;
        case 'isNotEmpty': return !!strVal;
        case 'greaterThan': return Number(value) > Number(filter.value);
        case 'lessThan': return Number(value) < Number(filter.value);
        default: return true;
      }
    });
  });
}

export function applyGroups(records: Record[], groups: GroupConfig[], fields: Field[]): { groupKey: string; records: Record[] }[] {
  if (groups.length === 0) return [{ groupKey: '', records }];
  const group = groups[0];
  const field = fields.find(f => f.id === group.fieldId);
  if (!field) return [{ groupKey: '', records }];

  const grouped = new Map<string, Record[]>();
  for (const record of records) {
    const val = record.cells[group.fieldId];
    const key = val == null || val === '' ? '(Empty)' : Array.isArray(val) ? val.join(', ') : String(val);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(record);
  }

  const entries = Array.from(grouped.entries())
    .sort((a, b) => group.order === 'desc' ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0]));

  return entries.map(([key, recs]) => ({ groupKey: key, records: recs }));
}

export function applySearch(records: Record[], query: string, fields: Field[]): Record[] {
  if (!query.trim()) return records;
  const q = query.toLowerCase();
  return records.filter(record => {
    return fields.some(field => {
      const val = record.cells[field.id];
      if (val == null) return false;
      const str = Array.isArray(val) ? val.join(' ') : String(val);
      return str.toLowerCase().includes(q);
    });
  });
}
