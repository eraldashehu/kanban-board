import { createContext } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { usePersistentReducer } from '../../../shared/hooks/usePersistentReducer';
import { boardReducer } from '../model/boardReducer';
import { sampleTasks } from '../model/constants';
import type { BoardAction, Task } from '../model/types';

export const BoardStateContext = createContext<Task[] | null>(null);
export const BoardDispatchContext = createContext<Dispatch<BoardAction> | null>(null);

const parseTasks = (raw: unknown): Task[] | null =>
  Array.isArray(raw) && raw.every((t) => typeof t === 'object' && t !== null && 'id' in t && 'column' in t) ? (raw as Task[]) : null;

/** Tasks in a persisted reducer; state and dispatch in separate contexts. */
export function BoardProvider({ children, initialTasks = sampleTasks }: { children: ReactNode; initialTasks?: Task[] }) {
  const [tasks, dispatch] = usePersistentReducer(boardReducer, initialTasks, { key: 'flowboard:v2', parse: parseTasks });
  return (
    <BoardDispatchContext.Provider value={dispatch}>
      <BoardStateContext.Provider value={tasks}>{children}</BoardStateContext.Provider>
    </BoardDispatchContext.Provider>
  );
}
