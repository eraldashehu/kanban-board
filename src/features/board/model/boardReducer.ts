import { sampleTasks } from './constants';
import type { BoardAction, Task } from './types';

/** Pure reducer for the board. Unchanged tasks keep their object reference. */
export function boardReducer(tasks: Task[], action: BoardAction): Task[] {
  switch (action.type) {
    case 'task/add':
      return [...tasks, action.task];

    case 'task/update':
      return tasks.map((t) => (t.id === action.task.id ? action.task : t));

    case 'task/delete':
      return tasks.filter((t) => t.id !== action.id);

    case 'task/move': {
      // Place the task in `column`, before `beforeId` or at the end.
      const task = tasks.find((t) => t.id === action.id);
      if (!task) return tasks;
      if (action.beforeId === action.id) return tasks;
      const rest = tasks.filter((t) => t.id !== action.id);
      const moved: Task = task.column === action.column ? task : { ...task, column: action.column };
      const index = action.beforeId ? rest.findIndex((t) => t.id === action.beforeId) : -1;
      const next = index === -1 ? [...rest, moved] : [...rest.slice(0, index), moved, ...rest.slice(index)];
      // Nothing changed: return the same array so nothing re-renders.
      return next.every((t, i) => t === tasks[i]) ? tasks : next;
    }

    case 'board/reset':
      return sampleTasks;
  }
}
