import { memo } from 'react';
import { Button, Flex, Input, Segmented } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PRIORITIES, PRIORITY_KEYS } from '../model/constants';
import type { PriorityFilter } from '../model/types';

const FILTER_OPTIONS: { label: string; value: PriorityFilter }[] = [
  { label: 'All', value: 'all' },
  ...PRIORITY_KEYS.map((k) => ({ label: PRIORITIES[k].label, value: k as PriorityFilter })),
];

interface BoardToolbarProps {
  query: string;
  onQueryChange: (q: string) => void;
  priority: PriorityFilter;
  onPriorityChange: (p: PriorityFilter) => void;
  onNewTask: () => void;
}

export const BoardToolbar = memo(function BoardToolbar({ query, onQueryChange, priority, onPriorityChange, onNewTask }: BoardToolbarProps) {
  return (
    <Flex wrap gap={12} align="center" className="toolbar">
      <Input.Search
        allowClear
        placeholder="Search tasks or tags"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search tasks"
        style={{ maxWidth: 320 }}
      />
      <Segmented<PriorityFilter> options={FILTER_OPTIONS} value={priority} onChange={onPriorityChange} />
      <Button type="primary" icon={<PlusOutlined />} onClick={onNewTask} style={{ marginLeft: 'auto' }}>
        New task
      </Button>
    </Flex>
  );
});
