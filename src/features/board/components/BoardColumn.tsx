import { memo } from 'react';
import type { DragEvent } from 'react';
import { Alert, Badge, Button, Flex, Typography, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TaskCard } from './TaskCard';
import type { ColumnDef, ColumnId, Task } from '../model/types';

interface BoardColumnProps {
  column: ColumnDef;
  tasks: Task[];
  draggingId: string | null;
  /** undefined: not the drop target. null: drop at the end. string: drop before that task. */
  dropBeforeId: string | null | undefined;
  onOpenTask: (task: Task) => void;
  onAddTask: (column: ColumnId) => void;
  onMoveTask: (id: string, column: ColumnId) => void;
  onDragStart: (id: string, e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onDragOver: (column: ColumnId, e: DragEvent<HTMLElement>) => void;
  onDragLeave: (column: ColumnId, e: DragEvent<HTMLElement>) => void;
  onDrop: (column: ColumnId, e: DragEvent<HTMLElement>) => void;
}

/**
 * Memoized column. All handler props are stable, and only the column being
 * dragged over receives a changing `dropBeforeId`, so other columns skip re-rendering.
 */
export const BoardColumn = memo(function BoardColumn(props: BoardColumnProps) {
  const { column, tasks, draggingId, dropBeforeId, onOpenTask, onAddTask, onMoveTask, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop } = props;
  const { token } = theme.useToken();
  const isTarget = dropBeforeId !== undefined;
  const overLimit = column.limit !== null && tasks.length > column.limit;
  const line = <div className="drop-line" style={{ background: token.colorPrimary }} />;

  return (
    <section
      aria-label={column.title}
      className="column"
      style={{ background: token.colorFillQuaternary, borderColor: isTarget ? token.colorPrimary : 'transparent' }}
      onDragOver={(e) => onDragOver(column.id, e)}
      onDragLeave={(e) => onDragLeave(column.id, e)}
      onDrop={(e) => onDrop(column.id, e)}
    >
      <Flex justify="space-between" align="center" className="column-head">
        <Typography.Text strong style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 13 }}>
          {column.title}
        </Typography.Text>
        <Badge
          count={column.limit ? `${tasks.length} / ${column.limit}` : tasks.length}
          showZero
          color={overLimit ? token.colorError : token.colorTextQuaternary}
          title={column.limit ? `Work-in-progress limit: ${column.limit}` : undefined}
        />
      </Flex>

      {overLimit && <Alert type="error" showIcon message="Over the limit. Finish something first." style={{ padding: '4px 10px', fontSize: 12 }} />}

      <Flex vertical gap={10} className="column-body">
        {tasks.map((t) => (
          <div key={t.id}>
            {dropBeforeId === t.id && line}
            <TaskCard task={t} dragging={draggingId === t.id} onOpen={onOpenTask} onMove={onMoveTask} onDragStart={onDragStart} onDragEnd={onDragEnd} />
          </div>
        ))}
        {dropBeforeId === null && line}
        {tasks.length === 0 && !isTarget && <div className="column-empty">Drop tasks here</div>}
      </Flex>

      <Button type="text" icon={<PlusOutlined />} onClick={() => onAddTask(column.id)} style={{ justifyContent: 'flex-start' }}>
        Add task
      </Button>
    </section>
  );
});
