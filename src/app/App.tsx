import { Layout, Typography, theme } from 'antd';
import { Board, BoardHeader, useBoardTasks } from '../features/board';

export default function App() {
  const tasks = useBoardTasks();
  const { token } = theme.useToken();

  return (
    <Layout className="app-layout">
      <Layout.Header className="app-header" style={{ background: token.colorBgContainer, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <BoardHeader tasks={tasks} />
      </Layout.Header>
      <Layout.Content className="app-content">
        <Board />
        <Typography.Paragraph type="secondary" className="foot">
          Drag cards between columns, or use the menu on each card. Your board is saved in this browser.
        </Typography.Paragraph>
      </Layout.Content>
    </Layout>
  );
}
