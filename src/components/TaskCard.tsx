import type { CSSProperties } from 'react';
import { COLUMNS, PRIORITIES } from '../data/board';
import type { ColumnId, Task } from '../types';

interface DueInfo {
  label: string;
  tone: '' | 'soon' | 'late';
}

function dueInfo(due: string): DueInfo | null {
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${due}T00:00:00`);
  const days = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (days < 0) return { label: `Overdue · ${label}`, tone: 'late' };
  if (days <= 2) return { label: days === 0 ? 'Due today' : `Due ${label}`, tone: 'soon' };
  return { label: `Due ${label}`, tone: '' };
}

interface TaskCardProps {
  task: Task;
  dragging: boolean;
  onEdit: (task: Task) => void;
  onMove: (id: string, column: ColumnId) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export function TaskCard({ task, onEdit, onMove, dragging, onDragStart, onDragEnd }: TaskCardProps) {
  const p = PRIORITIES[task.priority];
  const isDone = task.column === 'done';
  const due = isDone ? null : dueInfo(task.due);

  return (
    <article
      className={`task ${dragging ? 'dragging' : ''} ${isDone ? 'is-done' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(task.id);
      }}
      onDragEnd={onDragEnd}
      data-id={task.id}
    >
      <div className="task-top">
        <span className="tag">{task.tag}</span>
        <span className="prio" style={{ '--p': p.color } as CSSProperties} title={`${p.label} priority`}>
          <i /> {p.label}
        </span>
      </div>
      <button type="button" className="task-title" onClick={() => onEdit(task)}>
        {task.title}
      </button>
      <div className="task-foot">
        {due ? (
          <span className={`due ${due.tone}`}>{due.label}</span>
        ) : (
          <span className="due muted">{isDone ? '✓ Completed' : 'No due date'}</span>
        )}
        <div className="task-actions">
          <select aria-label="Move to column" value={task.column} onChange={(e) => onMove(task.id, e.target.value as ColumnId)}>
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <span className="avatar" title={`Assigned to ${task.assignee}`}>
            {task.assignee}
          </span>
        </div>
      </div>
    </article>
  );
}
