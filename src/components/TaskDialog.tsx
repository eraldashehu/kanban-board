import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { COLUMNS, PRIORITIES, PRIORITY_KEYS } from '../data/board';
import type { ColumnId, Priority, Task } from '../types';

interface TaskDialogProps {
  task: Task;
  isNew: boolean;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TaskDialog({ task, isNew, onSave, onDelete, onClose }: TaskDialogProps) {
  const [draft, setDraft] = useState<Task>(task);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = <K extends keyof Task>(key: K, value: Task[K]) => setDraft((d) => ({ ...d, [key]: value }));

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    onSave({ ...draft, title: draft.title.trim(), tag: draft.tag.trim() || 'General' });
  }

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="dialog" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="dlg-title">
        <h2 id="dlg-title">{isNew ? 'New task' : 'Edit task'}</h2>
        <label>
          Title
          <input ref={titleRef} id="task-title" value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="What needs to be done?" required />
        </label>
        <div className="row">
          <label>
            Tag
            <input id="task-tag" value={draft.tag} onChange={(e) => set('tag', e.target.value)} placeholder="Frontend" />
          </label>
          <label>
            Assignee initials
            <input id="task-assignee" value={draft.assignee} maxLength={3} onChange={(e) => set('assignee', e.target.value.toUpperCase())} />
          </label>
        </div>
        <div className="row">
          <label>
            Priority
            <select id="task-priority" value={draft.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
              {PRIORITY_KEYS.map((k) => (
                <option key={k} value={k}>
                  {PRIORITIES[k].label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select id="task-column" value={draft.column} onChange={(e) => set('column', e.target.value as ColumnId)}>
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Due date
            <input id="task-due" type="date" value={draft.due} onChange={(e) => set('due', e.target.value)} />
          </label>
        </div>
        <div className="dialog-actions">
          {!isNew &&
            (confirmDelete ? (
              <span className="confirm">
                Delete this task?
                <button type="button" className="danger-solid" onClick={() => onDelete(task.id)}>Delete</button>
                <button type="button" className="ghost" onClick={() => setConfirmDelete(false)}>Keep</button>
              </span>
            ) : (
              <button type="button" className="danger" onClick={() => setConfirmDelete(true)}>Delete</button>
            ))}
          <span className="spacer" />
          <button type="button" className="ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">{isNew ? 'Add task' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
