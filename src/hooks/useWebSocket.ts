import { useWSStore } from '@/stores/useWSStore';
import { WSClient } from '@/Service/WSClient';

export const useWebSocket = () => {
  const { connected, messages, clearMessages } = useWSStore();

  const sendMessage = (data: any) => {
    try {
      const client = WSClient.getInstance();
      if (client) {
        client.send(data);
      } else {
        // eslint-disable-next-line no-console
        console.warn('WebSocket client not initialized');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to send WebSocket message:', error);
    }
  };

  const getClient = () => {
    try {
      return WSClient.getInstance();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('WebSocket client not initialized:', error);
      return null;
    }
  };

  const isReady = connected;

  return {
    connected,
    messages,
    sendMessage,
    clearMessages,
    getClient,
    isReady,
  };
};
