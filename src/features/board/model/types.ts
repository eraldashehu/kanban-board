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

/** Every change to the board is one of these actions. */
export type BoardAction =
  | { type: 'task/add'; task: Task }
  | { type: 'task/update'; task: Task }
  | { type: 'task/delete'; id: string }
  | { type: 'task/move'; id: string; column: ColumnId; beforeId?: string | null }
  | { type: 'board/reset' };

export type PriorityFilter = Priority | 'all';
