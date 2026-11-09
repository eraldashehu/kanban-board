import { useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Modal, Popconfirm, Row, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { COLUMNS, PRIORITIES, PRIORITY_KEYS } from '../model/constants';
import type { ColumnId, Priority, Task } from '../model/types';

/** Shape of the form. Dates are Dayjs objects inside the form, strings in the store. */
interface TaskFormValues {
  title: string;
  tag: string;
  assignee: string;
  priority: Priority;
  column: ColumnId;
  due: Dayjs | null;
}

const toFormValues = (t: Task): TaskFormValues => ({
  title: t.title,
  tag: t.tag,
  assignee: t.assignee,
  priority: t.priority,
  column: t.column,
  due: t.due ? dayjs(t.due) : null,
});

const fromFormValues = (id: string, v: TaskFormValues): Task => ({
  id,
  title: v.title.trim(),
  tag: v.tag?.trim() || 'General',
  assignee: (v.assignee || '').trim().toUpperCase(),
  priority: v.priority,
  column: v.column,
  due: v.due ? v.due.format('YYYY-MM-DD') : '',
});

interface TaskModalProps {
  task: Task;
  isNew: boolean;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

/**
 * Add / edit dialog using Ant Design Form for layout and validation.
 * It is mounted only while open, so the form always starts from the selected task.
 */
export function TaskModal({ task, isNew, onSave, onDelete, onClose }: TaskModalProps) {
  const [form] = Form.useForm<TaskFormValues>();
  const [saving, setSaving] = useState(false);

  const handleFinish = (values: TaskFormValues) => {
    setSaving(true);
    onSave(fromFormValues(task.id, values));
  };

  return (
    <Modal
      open
      title={isNew ? 'New task' : 'Edit task'}
      onCancel={onClose}
      width={560}
      footer={[
        !isNew && (
          <Popconfirm key="delete" title="Delete this task?" okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => onDelete(task.id)}>
            <Button danger icon={<DeleteOutlined />} style={{ float: 'left' }}>
              Delete
            </Button>
          </Popconfirm>
        ),
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={saving} onClick={() => form.submit()}>
          {isNew ? 'Add task' : 'Save'}
        </Button>,
      ]}
    >
      <Form<TaskFormValues> form={form} layout="vertical" initialValues={toFormValues(task)} onFinish={handleFinish} requiredMark="optional">
        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, whitespace: true, message: 'Please describe the task' },
            { max: 120, message: 'Keep it under 120 characters' },
          ]}
        >
          <Input autoFocus placeholder="What needs to be done?" />
        </Form.Item>
        <Row gutter={12}>
          <Col xs={24} sm={14}>
            <Form.Item name="tag" label="Tag">
              <Input placeholder="Frontend" maxLength={24} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={10}>
            <Form.Item name="assignee" label="Assignee initials" rules={[{ pattern: /^[A-Za-z]{1,3}$/, message: '1–3 letters' }]}>
              <Input placeholder="ES" maxLength={3} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="priority" label="Priority">
              <Select options={PRIORITY_KEYS.map((k) => ({ value: k, label: PRIORITIES[k].label }))} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="column" label="Status">
              <Select options={COLUMNS.map((c) => ({ value: c.id, label: c.title }))} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="due" label="Due date">
              <DatePicker format="D MMM YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
