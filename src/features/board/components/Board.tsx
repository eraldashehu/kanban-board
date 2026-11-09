import { useCallback } from 'react';
import { App } from 'antd';
import { BoardColumn } from './BoardColumn';
import { BoardToolbar } from './BoardToolbar';
import { TaskModal } from './TaskModal';
import { useBoardActions, useBoardTasks } from '../hooks/useBoard';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useTaskEditor } from '../hooks/useTaskEditor';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { COLUMNS } from '../model/constants';
import type { Task } from '../model/types';

/** Puts the board together: filters, columns, drag and drop, and the edit dialog. */
export function Board() {
  const tasks = useBoardTasks();
  const { addTask, updateTask, deleteTask, moveTask } = useBoardActions();
  const { query, setQuery, priority, setPriority, byColumn } = useTaskFilters(tasks);
  const { editing, openNew, openEdit, close } = useTaskEditor();
  const dnd = useDragAndDrop(moveTask);
  const { message } = App.useApp();

  const handleSave = useCallback(
    (task: Task, isNew: boolean) => {
      if (isNew) addTask(task);
      else updateTask(task);
      message.success(isNew ? 'Task added' : 'Task saved');
      close();
    },
    [addTask, updateTask, message, close]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteTask(id);
      message.info('Task deleted');
      close();
    },
    [deleteTask, message, close]
  );

  const handleNew = useCallback(() => openNew('todo'), [openNew]);

  return (
    <>
      <BoardToolbar query={query} onQueryChange={setQuery} priority={priority} onPriorityChange={setPriority} onNewTask={handleNew} />

      <div className="board">
        {COLUMNS.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            tasks={byColumn[col.id]}
            draggingId={dnd.draggingId}
            dropBeforeId={dnd.target?.column === col.id ? dnd.target.beforeId : undefined}
            onOpenTask={openEdit}
            onAddTask={openNew}
            onMoveTask={moveTask}
            onDragStart={dnd.startDrag}
            onDragEnd={dnd.endDrag}
            onDragOver={dnd.dragOverColumn}
            onDragLeave={dnd.leaveColumn}
            onDrop={dnd.dropOnColumn}
          />
        ))}
      </div>

      {editing && (
        <TaskModal
          key={editing.task.id}
          task={editing.task}
          isNew={editing.isNew}
          onSave={(task) => handleSave(task, editing.isNew)}
          onDelete={handleDelete}
          onClose={close}
        />
      )}
    </>
  );
}
