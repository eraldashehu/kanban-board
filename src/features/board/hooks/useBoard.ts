import { useContext, useMemo } from 'react';
import { BoardDispatchContext, BoardStateContext } from '../context/BoardContext';
import type { ColumnId, Task } from '../model/types';

export function useBoardTasks(): Task[] {
  const tasks = useContext(BoardStateContext);
  if (!tasks) throw new Error('useBoardTasks must be used inside <BoardProvider>');
  return tasks;
}

/** Stable, named board actions. */
export function useBoardActions() {
  const dispatch = useContext(BoardDispatchContext);
  if (!dispatch) throw new Error('useBoardActions must be used inside <BoardProvider>');
  return useMemo(
    () => ({
      addTask: (task: Task) => dispatch({ type: 'task/add', task }),
      updateTask: (task: Task) => dispatch({ type: 'task/update', task }),
      deleteTask: (id: string) => dispatch({ type: 'task/delete', id }),
      moveTask: (id: string, column: ColumnId, beforeId: string | null = null) => dispatch({ type: 'task/move', id, column, beforeId }),
      resetBoard: () => dispatch({ type: 'board/reset' }),
    }),
    [dispatch]
  );
}

export type BoardActions = ReturnType<typeof useBoardActions>;
