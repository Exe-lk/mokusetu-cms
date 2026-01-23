'use client';

import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { SidebarProvider } from './components/SidebarContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </Provider>
  );
}
