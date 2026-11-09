import { App as AntApp, ConfigProvider } from 'antd';
import enGB from 'antd/locale/en_GB';
import type { ReactNode } from 'react';
import { BoardProvider } from '../features/board';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={enGB}>
      <AntApp>
        <BoardProvider>{children}</BoardProvider>
      </AntApp>
    </ConfigProvider>
  );
}
