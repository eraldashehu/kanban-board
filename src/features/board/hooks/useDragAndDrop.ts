import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import type { ColumnId } from '../model/types';

export interface DropTarget {
  column: ColumnId;
  /** Drop before this task, or null for the end of the column */
  beforeId: string | null;
}

type OnDrop = (taskId: string, column: ColumnId, beforeId: string | null) => void;

/**
 * Native HTML5 drag and drop for the board.
 * - The dragged id and drop target are also kept in refs, for the event handlers.
 *   State copies exist only to draw the drop indicator.
 * - The latest `onDrop` is kept in a ref, so the returned handlers never change
 *   and memoized cards and columns are not re-rendered by them.
 */
export function useDragAndDrop(onDrop: OnDrop) {
  const draggedId = useRef<string | null>(null);
  const targetRef = useRef<DropTarget | null>(null);
  const onDropRef = useRef(onDrop);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [target, setTarget] = useState<DropTarget | null>(null);

  useEffect(() => {
    onDropRef.current = onDrop;
  }, [onDrop]);

  const startDrag = useCallback((taskId: string, e: DragEvent<HTMLElement>) => {
    draggedId.current = taskId;
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(taskId);
  }, []);

  const endDrag = useCallback(() => {
    draggedId.current = null;
    targetRef.current = null;
    setDraggingId(null);
    setTarget(null);
  }, []);

  const dragOverColumn = useCallback((column: ColumnId, e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // The first card whose middle is below the pointer is where the task will go.
    const cards = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[data-task-id]'));
    const next = cards.find((el) => el.dataset.taskId !== draggedId.current && e.clientY < el.getBoundingClientRect().top + el.offsetHeight / 2);
    const beforeId = next?.dataset.taskId ?? null;
    targetRef.current = { column, beforeId };
    setTarget((prev) => (prev?.column === column && prev.beforeId === beforeId ? prev : { column, beforeId }));
  }, []);

  const leaveColumn = useCallback((column: ColumnId, e: DragEvent<HTMLElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setTarget((prev) => (prev?.column === column ? null : prev));
  }, []);

  const dropOnColumn = useCallback(
    (column: ColumnId, e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      const id = draggedId.current ?? e.dataTransfer.getData('text/plain');
      const t = targetRef.current;
      if (id) onDropRef.current(id, column, t?.column === column ? t.beforeId : null);
      endDrag();
    },
    [endDrag]
  );

  return useMemo(
    () => ({ draggingId, target, startDrag, endDrag, dragOverColumn, leaveColumn, dropOnColumn }),
    [draggingId, target, startDrag, endDrag, dragOverColumn, leaveColumn, dropOnColumn]
  );
}

export type DragAndDrop = ReturnType<typeof useDragAndDrop>;
