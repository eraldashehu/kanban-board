import type { ColumnDef, Priority, Task } from './types';

export const COLUMNS: ColumnDef[] = [
  { id: 'todo', title: 'To do', limit: null },
  { id: 'progress', title: 'In progress', limit: 3 },
  { id: 'review', title: 'In review', limit: 2 },
  { id: 'done', title: 'Done', limit: null },
];

/** Ant Design preset color names, used by Tag and Badge. */
export const PRIORITIES: Record<Priority, { label: string; color: 'red' | 'orange' | 'green' }> = {
  high: { label: 'High', color: 'red' },
  medium: { label: 'Medium', color: 'orange' },
  low: { label: 'Low', color: 'green' },
};

export const PRIORITY_KEYS = Object.keys(PRIORITIES) as Priority[];

let counter = 0;
export const newId = (): string => `t-${Date.now().toString(36)}-${(counter++).toString(36)}`;

/** Date `n` days from `from` as YYYY-MM-DD, so demo due dates stay realistic. */
export const inDays = (n: number, from = new Date()): string => {
  const d = new Date(from);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const sampleTasks: Task[] = [
  { id: 't1', column: 'todo', title: 'Design invoice list empty state', tag: 'Design', priority: 'medium', due: inDays(9), assignee: 'ES' },
  { id: 't2', column: 'todo', title: 'Add CSV export to reports', tag: 'Feature', priority: 'low', due: '', assignee: 'MK' },
  { id: 't3', column: 'todo', title: 'Write unit tests for VAT calculator', tag: 'Testing', priority: 'high', due: inDays(5), assignee: 'ES' },
  { id: 't4', column: 'progress', title: 'Refactor date picker into shared component', tag: 'Frontend', priority: 'high', due: inDays(2), assignee: 'ES' },
  { id: 't5', column: 'progress', title: 'Customer search: debounce API calls', tag: 'Performance', priority: 'medium', due: '', assignee: 'LB' },
  { id: 't6', column: 'review', title: 'Accessible keyboard navigation for tables', tag: 'Accessibility', priority: 'medium', due: inDays(-1), assignee: 'ES' },
  { id: 't7', column: 'done', title: 'Set up Storybook for UI library', tag: 'Frontend', priority: 'low', due: '', assignee: 'MK' },
  { id: 't8', column: 'done', title: 'Fix total rounding on multi-currency invoices', tag: 'Bug', priority: 'high', due: '', assignee: 'ES' },
];
