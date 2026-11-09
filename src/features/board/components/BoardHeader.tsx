import { memo } from 'react';
import { Button, Flex, Popconfirm, Progress, Typography, theme } from 'antd';
import { ProjectOutlined, ReloadOutlined } from '@ant-design/icons';
import { useBoardActions } from '../hooks/useBoard';
import { progressOf } from '../model/selectors';
import type { Task } from '../model/types';

export const BoardHeader = memo(function BoardHeader({ tasks }: { tasks: Task[] }) {
  const { resetBoard } = useBoardActions();
  const { token } = theme.useToken();
  const { done, total, percent } = progressOf(tasks);

  return (
    <Flex align="center" justify="space-between" wrap gap={16}>
      <Flex align="center" gap={12}>
        <span className="logo" style={{ background: token.colorText, color: token.colorBgContainer }} aria-hidden="true">
          <ProjectOutlined />
        </span>
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            FlowBoard
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Sprint 24 · Billing team
          </Typography.Text>
        </div>
      </Flex>
      <Flex align="center" gap={16}>
        <div style={{ width: 200 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {done} of {total} done
          </Typography.Text>
          <Progress percent={percent} size="small" showInfo={false} />
        </div>
        <Popconfirm title="Reset the demo board?" description="Your changes will be replaced by the example tasks." okText="Reset" onConfirm={resetBoard}>
          <Button icon={<ReloadOutlined />}>Reset demo</Button>
        </Popconfirm>
      </Flex>
    </Flex>
  );
});
