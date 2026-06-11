import {
  Type, AlignLeft, Paperclip, CheckSquare, List, ChevronDown, User,
  Calendar, Phone, Mail, Link, Hash, DollarSign, Percent, Clock, Star,
  BarChart3, Play, Search, GitBranch,
} from 'lucide-react';
import type { FieldType } from '../types';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Type, AlignLeft, Paperclip, CheckSquare, List, ChevronDown, User,
  Calendar, Phone, Mail, Link, Hash, DollarSign, Percent, Clock, Star,
  BarChart3, Play, Search, GitBranch,
};

const fieldTypeIcons: Record<FieldType, string> = {
  singleLineText: 'Type',
  multilineText: 'AlignLeft',
  attachment: 'Paperclip',
  checkbox: 'CheckSquare',
  multipleSelects: 'List',
  singleSelect: 'ChevronDown',
  user: 'User',
  date: 'Calendar',
  phone: 'Phone',
  email: 'Mail',
  url: 'Link',
  number: 'Hash',
  currency: 'DollarSign',
  percent: 'Percent',
  duration: 'Clock',
  rating: 'Star',
  formula: 'Hash',
  rollup: 'GitBranch',
  count: 'Hash',
  lookup: 'Search',
  createdTime: 'Clock',
  lastModifiedTime: 'Clock',
  autoNumber: 'Hash',
  barcode: 'BarChart3',
  button: 'Play',
  linkedRecord: 'Link',
};

interface Props {
  type: FieldType;
  size?: number;
  className?: string;
}

export default function FieldTypeIcon({ type, size = 14, className = '' }: Props) {
  const iconName = fieldTypeIcons[type] ?? 'Type';
  const Icon = iconMap[iconName];
  if (!Icon) return null;
  return <Icon size={size} className={`text-[#909090] ${className}`} />;
}
