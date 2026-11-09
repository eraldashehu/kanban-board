import { memo } from 'react';
import type { DragEvent } from 'react';
import { Avatar, Badge, Card, Flex, Select, Tag, Tooltip, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { COLUMNS, PRIORITIES } from '../model/constants';
import { dueStatus } from '../model/selectors';
import type { ColumnId, Task } from '../model/types';

const COLUMN_OPTIONS = COLUMNS.map((c) => ({ value: c.id, label: c.title }));

interface TaskCardProps {
  task: Task;
  dragging: boolean;
  onOpen: (task: Task) => void;
  onMove: (id: string, column: ColumnId) => void;
  onDragStart: (id: string, e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}

/** Memoized: only re-renders when this task, or whether it is being dragged, changes. */
export const TaskCard = memo(function TaskCard({ task, dragging, onOpen, onMove, onDragStart, onDragEnd }: TaskCardProps) {
  const priority = PRIORITIES[task.priority];
  const isDone = task.column === 'done';
  const due = isDone ? null : dueStatus(task.due);

  return (
    <div
      data-task-id={task.id}
      draggable
      onDragStart={(e) => onDragStart(task.id, e)}
      onDragEnd={onDragEnd}
      className={`task ${dragging ? 'is-dragging' : ''}`}
    >
      <Card size="small" hoverable onClick={() => onOpen(task)} styles={{ body: { padding: 12 } }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
          <Tag color="blue" bordered={false}>
            {task.tag}
          </Tag>
          <Badge color={priority.color} text={<Typography.Text type="secondary" style={{ fontSize: 12 }}>{priority.label}</Typography.Text>} />
        </Flex>

        <Typography.Paragraph strong delete={isDone} type={isDone ? 'secondary' : undefined} style={{ marginBottom: 10 }} ellipsis={{ rows: 3 }}>
          {task.title}
        </Typography.Paragraph>

        <Flex justify="space-between" align="center" gap={8}>
          {isDone ? (
            <Typography.Text type="success" style={{ fontSize: 12 }}>
              <CheckCircleOutlined /> Completed
            </Typography.Text>
          ) : due ? (
            <Typography.Text type={due.tone === 'late' ? 'danger' : due.tone === 'soon' ? 'warning' : 'secondary'} style={{ fontSize: 12 }}>
              <ClockCircleOutlined />{' '}
              {due.tone === 'late' ? 'Overdue · ' : due.days === 0 ? 'Due today · ' : 'Due '}
              {dayjs(task.due).format('D MMM')}
            </Typography.Text>
          ) : (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              No due date
            </Typography.Text>
          )}

          {/* stopPropagation: using the menu must not open the edit dialog */}
          <Flex align="center" gap={6} onClick={(e) => e.stopPropagation()}>
            <Select
              size="small"
              variant="borderless"
              aria-label="Move to column"
              value={task.column}
              options={COLUMN_OPTIONS}
              onChange={(column: ColumnId) => onMove(task.id, column)}
              popupMatchSelectWidth={false}
              style={{ width: 106 }}
            />
            <Tooltip title={`Assigned to ${task.assignee}`}>
              <Avatar size="small" style={{ backgroundColor: '#1677ff', fontSize: 11 }}>
                {task.assignee}
              </Avatar>
            </Tooltip>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
});
