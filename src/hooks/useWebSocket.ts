import { useWSStore } from '@/stores/useWSStore';
import { WSClient } from '@/Service/WSClient';

/**
 * Hook to interact with WebSocket functionality
 * Provides access to connection status, messages, and send functionality
 */
export const useWebSocket = () => {
  const { connected, messages, clearMessages } = useWSStore();

  /**
   * Send a message through the WebSocket connection
   * @param data - The data to send
   */
  const sendMessage = (data: any) => {
    try {
      const client = WSClient.getInstance();
      if (client) {
        client.send(data);
      } else {
        console.warn('WebSocket client not initialized');
      }
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
    }
  };

  /**
   * Get the WebSocket client instance
   * @returns WSClient instance or null if not initialized
   */
  const getClient = () => {
    try {
      return WSClient.getInstance();
    } catch (error) {
      console.error('WebSocket client not initialized:', error);
      return null;
    }
  };

  /**
   * Check if WebSocket is ready to send messages
   */
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
