export type FieldType =
  | 'singleLineText'
  | 'multilineText'
  | 'number'
  | 'singleSelect'
  | 'multipleSelects'
  | 'checkbox'
  | 'date'
  | 'url'
  | 'email'
  | 'phone'
  | 'rating'
  | 'currency'
  | 'percent'
  | 'attachment'
  | 'autoNumber'
  | 'createdTime'
  | 'lastModifiedTime'
  | 'duration'
  | 'barcode'
  | 'button'
  | 'linkedRecord'
  | 'formula'
  | 'rollup'
  | 'count'
  | 'lookup'
  | 'user';

export interface SelectOption {
  id: string;
  name: string;
  color: string;
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  width: number;
  options?: SelectOption[];
  description?: string;
  isPrimary?: boolean;
}

export type CellValue = string | number | boolean | string[] | null | undefined;

export interface Record {
  id: string;
  cells: { [fieldId: string]: CellValue };
  createdTime: string;
}

export type ViewType = 'grid' | 'kanban' | 'calendar' | 'gallery' | 'form' | 'gantt';

export interface SortConfig {
  fieldId: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  fieldId: string;
  operator: 'contains' | 'doesNotContain' | 'is' | 'isNot' | 'isEmpty' | 'isNotEmpty' | 'greaterThan' | 'lessThan';
  value: string;
}

export interface GroupConfig {
  fieldId: string;
  order: 'asc' | 'desc';
}

export interface View {
  id: string;
  name: string;
  type: ViewType;
  filters: FilterConfig[];
  sorts: SortConfig[];
  groups: GroupConfig[];
  hiddenFieldIds: string[];
  fieldOrder?: string[];
  kanbanFieldId?: string;
  calendarFieldId?: string;
}

export interface Table {
  id: string;
  name: string;
  fields: Field[];
  records: Record[];
  views: View[];
  activeViewId: string;
}

export interface Base {
  id: string;
  name: string;
  color: string;
  icon: string;
  tables: Table[];
  activeTableId: string;
}

export const SELECT_COLORS = [
  { name: 'Blue light', bg: '#D3E5EF', text: '#183B56', value: 'blueLight' },
  { name: 'Cyan light', bg: '#C2F5E9', text: '#0B6E4F', value: 'cyanLight' },
  { name: 'Teal light', bg: '#C2F5E9', text: '#0B6E4F', value: 'tealLight' },
  { name: 'Green light', bg: '#D1F7C4', text: '#1B5E20', value: 'greenLight' },
  { name: 'Yellow light', bg: '#FFF3CD', text: '#7C5C00', value: 'yellowLight' },
  { name: 'Orange light', bg: '#FFEAB6', text: '#8B4513', value: 'orangeLight' },
  { name: 'Red light', bg: '#FFDBD0', text: '#BF360C', value: 'redLight' },
  { name: 'Pink light', bg: '#FFDCE5', text: '#880E4F', value: 'pinkLight' },
  { name: 'Purple light', bg: '#EDE2FE', text: '#4A148C', value: 'purpleLight' },
  { name: 'Gray light', bg: '#EEEEEE', text: '#424242', value: 'grayLight' },
  { name: 'Blue', bg: '#2D7FF9', text: '#FFFFFF', value: 'blue' },
  { name: 'Cyan', bg: '#18BFFF', text: '#FFFFFF', value: 'cyan' },
  { name: 'Teal', bg: '#20D9D2', text: '#FFFFFF', value: 'teal' },
  { name: 'Green', bg: '#20C933', text: '#FFFFFF', value: 'green' },
  { name: 'Yellow', bg: '#FCB400', text: '#FFFFFF', value: 'yellow' },
  { name: 'Orange', bg: '#FF6F2C', text: '#FFFFFF', value: 'orange' },
  { name: 'Red', bg: '#F82B60', text: '#FFFFFF', value: 'red' },
  { name: 'Pink', bg: '#FF08C2', text: '#FFFFFF', value: 'pink' },
  { name: 'Purple', bg: '#8B46FF', text: '#FFFFFF', value: 'purple' },
  { name: 'Gray', bg: '#666666', text: '#FFFFFF', value: 'gray' },
];

export const FIELD_TYPE_INFO: { type: FieldType; label: string; icon: string; description: string }[] = [
  { type: 'singleLineText', label: 'Single line text', icon: 'Type', description: 'A single line of text' },
  { type: 'multilineText', label: 'Long text', icon: 'AlignLeft', description: 'A long text field that can span multiple lines' },
  { type: 'attachment', label: 'Attachment', icon: 'Paperclip', description: 'Add images, documents, or other files' },
  { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare', description: 'A single checkbox' },
  { type: 'multipleSelects', label: 'Multiple select', icon: 'List', description: 'Multiple values from a predefined set' },
  { type: 'singleSelect', label: 'Single select', icon: 'ChevronDown', description: 'A single value from a predefined set' },
  { type: 'user', label: 'User', icon: 'User', description: 'Airtable collaborator' },
  { type: 'date', label: 'Date', icon: 'Calendar', description: 'A date (with optional time)' },
  { type: 'phone', label: 'Phone number', icon: 'Phone', description: 'A telephone number' },
  { type: 'email', label: 'Email', icon: 'Mail', description: 'A valid email address' },
  { type: 'url', label: 'URL', icon: 'Link', description: 'A URL (e.g. airtable.com)' },
  { type: 'number', label: 'Number', icon: 'Hash', description: 'A number (integer or decimal)' },
  { type: 'currency', label: 'Currency', icon: 'DollarSign', description: 'An amount of money' },
  { type: 'percent', label: 'Percent', icon: 'Percent', description: 'A percentage' },
  { type: 'duration', label: 'Duration', icon: 'Clock', description: 'A length of time in hours, minutes, or seconds' },
  { type: 'rating', label: 'Rating', icon: 'Star', description: 'A rating on a 1-5 star scale' },
  { type: 'formula', label: 'Formula', icon: 'FunctionSquare', description: 'Compute values based on other fields' },
  { type: 'rollup', label: 'Rollup', icon: 'GitBranch', description: 'Summarize data from linked records' },
  { type: 'count', label: 'Count', icon: 'Hash', description: 'Count the number of linked records' },
  { type: 'lookup', label: 'Lookup', icon: 'Search', description: 'Look up a field on linked records' },
  { type: 'createdTime', label: 'Created time', icon: 'Clock', description: 'The date and time this record was created' },
  { type: 'lastModifiedTime', label: 'Last modified time', icon: 'Clock', description: 'The date and time this record was last modified' },
  { type: 'autoNumber', label: 'Autonumber', icon: 'Hash', description: 'Automatically incremented unique counter' },
  { type: 'barcode', label: 'Barcode', icon: 'BarChart3', description: 'Scan a barcode with your device camera' },
  { type: 'button', label: 'Button', icon: 'Play', description: 'Trigger a customized action' },
];
