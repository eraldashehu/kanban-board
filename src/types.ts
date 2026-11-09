export type ColumnId = 'todo' | 'progress' | 'review' | 'done';
export type Priority = 'high' | 'medium' | 'low';

export interface ColumnDef {
  id: ColumnId;
  title: string;
  /** Work-in-progress limit, or null for no limit */
  limit: number | null;
}

export interface Task {
  id: string;
  column: ColumnId;
  title: string;
  tag: string;
  priority: Priority;
  /** "YYYY-MM-DD" or empty */
  due: string;
  /** Initials, e.g. "ES" */
  assignee: string;
}

export type BoardAction =
  | { type: 'add'; task: Task }
  | { type: 'update'; task: Task }
  | { type: 'delete'; id: string }
  | { type: 'move'; id: string; column: ColumnId; beforeId?: string | null }
  | { type: 'reset' };
