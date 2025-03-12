import { useEffect } from 'react';

export const useSSE = (
  url: string,
  token?: string,
  onMessage?: (event: MessageEvent) => void,
  options?: EventSourceInit,
) => {
  useEffect(() => {
    //console.log('register SSE');
    const eventSource = new EventSource(`${url}?token=${token}`, options);
    // recieve message
    eventSource.onmessage = function (event) {
      onMessage?.(event);
    };
    // 监听自定义事件（如果有的话）
    // eventSource.addEventListener('customEvent', function(event) {
    //   const customData = JSON.parse(event.data);
    //   // 处理customData
    // });
    // clear
    return () => {
      //console.log('destroy SSE');
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, url]);
};
