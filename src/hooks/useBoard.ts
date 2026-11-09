import { useEffect, useReducer } from 'react';
import type { Dispatch } from 'react';
import { sampleTasks } from '../data/board';
import type { BoardAction, Task } from '../types';

const KEY = 'flowboard:v1';

function load(): Task[] {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? (JSON.parse(saved) as Task[]) : sampleTasks;
  } catch {
    return sampleTasks;
  }
}

export function boardReducer(tasks: Task[], action: BoardAction): Task[] {
  switch (action.type) {
    case 'add':
      return [...tasks, action.task];
    case 'update':
      return tasks.map((t) => (t.id === action.task.id ? { ...t, ...action.task } : t));
    case 'delete':
      return tasks.filter((t) => t.id !== action.id);
    case 'move': {
      // Move a task to a column, placed before `beforeId` (or at the end).
      const task = tasks.find((t) => t.id === action.id);
      if (!task) return tasks;
      const rest = tasks.filter((t) => t.id !== action.id);
      const moved: Task = { ...task, column: action.column };
      const index = action.beforeId ? rest.findIndex((t) => t.id === action.beforeId) : -1;
      if (index === -1) return [...rest, moved];
      return [...rest.slice(0, index), moved, ...rest.slice(index)];
    }
    case 'reset':
      return sampleTasks;
  }
}

export function useBoard(): [Task[], Dispatch<BoardAction>] {
  const [tasks, dispatch] = useReducer(boardReducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(tasks));
    } catch {
      /* storage unavailable: board still works for this visit */
    }
  }, [tasks]);
  return [tasks, dispatch];
}
