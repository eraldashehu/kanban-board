import { useCallback, useState } from 'react';
import { newId } from '../model/constants';
import type { ColumnId, Task } from '../model/types';

export interface EditorState {
  task: Task;
  isNew: boolean;
}

/** Which task (if any) is open in the edit dialog. */
export function useTaskEditor() {
  const [editing, setEditing] = useState<EditorState | null>(null);

  const openNew = useCallback(
    (column: ColumnId = 'todo') =>
      setEditing({ isNew: true, task: { id: newId(), column, title: '', tag: '', priority: 'medium', due: '', assignee: 'ES' } }),
    []
  );
  const openEdit = useCallback((task: Task) => setEditing({ task, isNew: false }), []);
  const close = useCallback(() => setEditing(null), []);

  return { editing, openNew, openEdit, close };
}
