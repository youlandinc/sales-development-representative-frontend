import { useWSStore } from '@/stores/useWSStore';

export class WSClient {
  private static instance?: WSClient;
  private ws?: WebSocket;
  private url: string;
  private token?: string;
  private reconnectTimer?: NodeJS.Timeout;
  private retry = 0;

  private constructor(url: string, token?: string) {
    this.url = url;
    this.token = token;
  }

  static getInstance(url?: string, token?: string): WSClient {
    if (!WSClient.instance) {
      if (!url) {
        throw new Error('URL is required for first initialization');
      }
      WSClient.instance = new WSClient(url, token);
    } else if (token && WSClient.instance.token !== token) {
      WSClient.instance.token = token;
    }
    return WSClient.instance;
  }

  static resetInstance(): void {
    if (WSClient.instance) {
      WSClient.instance.disconnect();
      WSClient.instance = undefined;
    }
  }

  connect() {
    if (typeof window === 'undefined') {
      return;
    }
    if (this.ws && this.ws.readyState < 2) {
      return;
    }

    let wsUrl = this.url;
    if (this.token) {
      const separator = wsUrl.includes('?') ? '&' : '?';
      wsUrl = `${wsUrl}${separator}token=${this.token}`;
    }

    try {
      this.ws = new WebSocket(wsUrl);
    } catch (error) {
      console.log(error);
      return;
    }

    this.ws.onopen = () => {
      this.retry = 0;
      useWSStore.getState().setConnected(true);
    };

    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);

        useWSStore.getState().pushMessage({
          type: data.type || 'message',
          data: data,
          timestamp: Date.now(),
        });
      } catch (e) {
        console.error('Invalid WS message format:', e, 'Raw message:', ev.data);
      }
    };

    this.ws.onclose = (event) => {
      useWSStore.getState().setConnected(false);

      if (event.code === 1008 || event.code === 4001) {
        return;
      }

      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      useWSStore.getState().setConnected(false);
    };
  }

  private scheduleReconnect() {
    if (this.retry >= 5) {
      return;
    }

    const delay = Math.min(1000 * 2 ** this.retry++, 20000);
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = undefined;
    useWSStore.getState().setConnected(false);
  }
}
