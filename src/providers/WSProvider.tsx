'use client';

import { FC, ReactNode, useEffect, useRef } from 'react';
import { WSClient } from '@/services';
import { useUserStore } from './index';

interface WSProviderProps {
  children: ReactNode;
}

export const WSProvider: FC<WSProviderProps> = ({ children }) => {
  const { accessToken } = useUserStore((store) => store);
  const wsClientRef = useRef<WSClient | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_BASE_WS_URL}/sdr/ws`;
    const client = WSClient.getInstance(wsUrl, `Bearer ${accessToken}`);
    wsClientRef.current = client;

    client.connect();

    return () => {
      if (wsClientRef.current) {
        wsClientRef.current.disconnect();
      }
    };
  }, [accessToken]);

  useEffect(() => {
    return () => {
      WSClient.resetInstance();
    };
  }, []);

  return <>{children}</>;
};
