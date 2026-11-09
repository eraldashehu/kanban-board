import { useDeferredValue, useMemo, useState } from 'react';
import { filterTasks, groupByColumn } from '../model/selectors';
import type { PriorityFilter, Task } from '../model/types';

/**
 * Search and priority filter for the board.
 * The search text is deferred, so the input stays responsive while columns re-filter.
 */
export function useTaskFilters(tasks: Task[]) {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<PriorityFilter>('all');
  const deferredQuery = useDeferredValue(query);

  const byColumn = useMemo(() => groupByColumn(filterTasks(tasks, deferredQuery, priority)), [tasks, deferredQuery, priority]);

  return { query, setQuery, priority, setPriority, byColumn, isFiltering: query !== '' || priority !== 'all' };
}
