import { useState } from 'react';
import type { DragEvent } from 'react';
import { TaskCard } from './TaskCard';
import type { ColumnDef, ColumnId, Task } from '../types';

interface ColumnProps {
  column: ColumnDef;
  tasks: Task[];
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
  onDrop: (id: string, column: ColumnId, beforeId: string | null) => void;
  onEdit: (task: Task) => void;
  onMove: (id: string, column: ColumnId) => void;
  onAdd: (column: ColumnId) => void;
}

export function Column({ column, tasks, draggingId, setDraggingId, onDrop, onEdit, onMove, onAdd }: ColumnProps) {
  const [over, setOver] = useState(false);
  const [beforeId, setBeforeId] = useState<string | null>(null);
  const overLimit = column.limit !== null && tasks.length > column.limit;

  function handleDragOver(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    setOver(true);
    // Find the card the pointer is above, to drop before it.
    const cards = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('.task:not(.dragging)'));
    const next = cards.find((el) => {
      const box = el.getBoundingClientRect();
      return e.clientY < box.top + box.height / 2;
    });
    setBeforeId(next?.dataset.id ?? null);
  }

  function handleDrop(e: DragEvent<HTMLElement>) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggingId;
    if (id) onDrop(id, column.id, beforeId === id ? null : beforeId);
    setOver(false);
    setBeforeId(null);
  }

  function handleDragLeave(e: DragEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
  }

  return (
    <section
      className={`column ${over ? 'over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={column.title}
    >
      <header className="col-head">
        <h2>{column.title}</h2>
        <span className={`count ${overLimit ? 'warn' : ''}`} title={column.limit ? `Work-in-progress limit: ${column.limit}` : undefined}>
          {tasks.length}
          {column.limit ? ` / ${column.limit}` : ''}
        </span>
      </header>
      {overLimit && <p className="limit-note">Over the limit. Finish something before starting more.</p>}
      <div className="col-body">
        {tasks.map((t) => (
          <div key={t.id} className="slot">
            {over && beforeId === t.id && <div className="drop-line" />}
            <TaskCard
              task={t}
              dragging={draggingId === t.id}
              onDragStart={setDraggingId}
              onDragEnd={() => setDraggingId(null)}
              onEdit={onEdit}
              onMove={onMove}
            />
          </div>
        ))}
        {over && !beforeId && <div className="drop-line" />}
        {tasks.length === 0 && !over && <p className="col-empty">Drop tasks here</p>}
      </div>
      <button type="button" className="add-btn" onClick={() => onAdd(column.id)}>
        + Add task
      </button>
    </section>
  );
}
