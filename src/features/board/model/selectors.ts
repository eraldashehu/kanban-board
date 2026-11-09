import { COLUMNS } from './constants';
import type { ColumnId, PriorityFilter, Task } from './types';

export function filterTasks(tasks: Task[], query: string, priority: PriorityFilter): Task[] {
  const q = query.trim().toLowerCase();
  if (!q && priority === 'all') return tasks;
  return tasks.filter(
    (t) => (priority === 'all' || t.priority === priority) && (!q || t.title.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q))
  );
}

/** Groups tasks by column in one pass, keeping their order. */
export function groupByColumn(tasks: Task[]): Record<ColumnId, Task[]> {
  const groups = Object.fromEntries(COLUMNS.map((c) => [c.id, [] as Task[]])) as Record<ColumnId, Task[]>;
  for (const t of tasks) groups[t.column].push(t);
  return groups;
}

export function progressOf(tasks: Task[]): { done: number; total: number; percent: number } {
  const done = tasks.filter((t) => t.column === 'done').length;
  return { done, total: tasks.length, percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
}

export type DueTone = 'late' | 'soon' | 'normal';

/** Days until due, compared at midnight, and how urgent that is. */
export function dueStatus(due: string, today = new Date()): { days: number; tone: DueTone } | null {
  if (!due) return null;
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const d = new Date(`${due}T00:00:00`);
  const days = Math.round((d.getTime() - start.getTime()) / 86_400_000);
  return { days, tone: days < 0 ? 'late' : days <= 2 ? 'soon' : 'normal' };
}
