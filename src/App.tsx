import { useCallback, useMemo, useState } from 'react';
import { COLUMNS, PRIORITIES, PRIORITY_KEYS, newId } from './data/board';
import { useBoard } from './hooks/useBoard';
import { Column } from './components/Column';
import { TaskDialog } from './components/TaskDialog';
import type { ColumnId, Priority, Task } from './types';

type PriorityFilter = Priority | 'all';

interface DialogState {
  task: Task;
  isNew: boolean;
}

export default function App() {
  const [tasks, dispatch] = useBoard();
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<PriorityFilter>('all');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (priority === 'all' || t.priority === priority) &&
        (!q || t.title.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q))
    );
  }, [tasks, query, priority]);

  const done = tasks.filter((t) => t.column === 'done').length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const closeDialog = useCallback(() => setDialog(null), []);

  const openNew = (column: ColumnId) =>
    setDialog({
      isNew: true,
      task: { id: newId(), column, title: '', tag: '', priority: 'medium', due: '', assignee: 'ES' },
    });

  const filters: PriorityFilter[] = ['all', ...PRIORITY_KEYS];

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="logo" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong>FlowBoard</strong>
            <small>Sprint 24 · Billing team</small>
          </div>
        </div>
        <div className="progress" aria-label={`${progress}% of tasks done`}>
          <span>
            {done} of {tasks.length} done
          </span>
          <div className="track">
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <div className="toolbar">
        <input
          id="board-search"
          type="search"
          placeholder="Search tasks or tags"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tasks"
        />
        <div className="filters" role="group" aria-label="Filter by priority">
          {filters.map((p) => (
            <button key={p} type="button" aria-pressed={priority === p} onClick={() => setPriority(p)}>
              {p === 'all' ? 'All' : PRIORITIES[p].label}
            </button>
          ))}
        </div>
        <button type="button" className="primary" onClick={() => openNew('todo')}>
          + New task
        </button>
      </div>

      <main className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={filtered.filter((t) => t.column === col.id)}
            draggingId={draggingId}
            setDraggingId={setDraggingId}
            onDrop={(id, column, beforeId) => dispatch({ type: 'move', id, column, beforeId })}
            onMove={(id, column) => dispatch({ type: 'move', id, column })}
            onEdit={(task) => setDialog({ task, isNew: false })}
            onAdd={openNew}
          />
        ))}
      </main>

      <footer className="foot">
        Drag cards between columns, or use the menu on each card. Your board is saved in this browser.
        <button type="button" className="link" onClick={() => dispatch({ type: 'reset' })}>
          Reset demo board
        </button>
      </footer>

      {dialog && (
        <TaskDialog
          task={dialog.task}
          isNew={dialog.isNew}
          onClose={closeDialog}
          onSave={(task) => {
            dispatch({ type: dialog.isNew ? 'add' : 'update', task });
            setDialog(null);
          }}
          onDelete={(id) => {
            dispatch({ type: 'delete', id });
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}
