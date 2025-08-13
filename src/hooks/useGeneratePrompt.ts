import { generatePrompt } from '@/request';
import { useCallback, useState } from 'react';
import { useSwitch } from '@/hooks/useSwitch';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';

export const useGeneratePrompt = (
  streamCb?: (text: string) => unknown,
  onFinish?: (text: string) => void,
) => {
  const [done, setDone] = useState(false);
  const { visible, open, close } = useSwitch();
  const {
    visible: isThinking,
    open: thinking,
    close: closeThinking,
  } = useSwitch();

  const fn = useCallback(
    async (api: string, param: Record<string, any>) => {
      setDone(false);
      open();
      thinking();
      generatePrompt(api, param)
        .then(async (response) => {
          if (response.body) {
            closeThinking();
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let buffer = '';
            let fullText = '';

            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                setDone(true);
                onFinish?.(fullText);
                close();
                break;
              }

              buffer += decoder.decode(value, { stream: true });

              // 按 SSE 事件分割
              const events = (buffer.split('\n\n') || ['']) as string[];
              buffer = events.pop() || ''; // 最后可能是半截，留到下一轮解析

              for (const e of events) {
                const chunk = e.replace(/data:/g, ''); // 去掉 `data: `

                // 这里有可能是 JSON，也可能是纯文本
                try {
                  const json = JSON.parse(chunk);
                  const delta = json.choices?.[0]?.delta?.content ?? '';
                  fullText += delta;
                } catch {
                  // 纯文本（SSE可能直接推Markdown）
                  fullText += chunk;
                }
                streamCb?.(fullText);
              }
            }

            /*const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let str = '';
            closeThinking();
            const readStream = () => {
              reader.read().then(({ done, value }) => {
                if (done) {
                  setDone(true);
                  onFinish?.(str);
                  close();
                  return;
                }
                // decode
                console.log(JSON.stringify(decoder.decode(value)));
                const data = decoder
                  .decode(value, { stream: true })
                  .replace(/data:/g, '')
                  .replace(/\n/g, '')
                  .replace(/^$/, '\n');
                console.log('string', JSON.stringify(data));
                str = str + data;
                streamCb?.(str);
                // continue read stream
                readStream();
              });
            };
            readStream();*/
          }
        })
        .catch((err) => {
          const { header, message, variant } = err as HttpError;
          SDRToast({ message, header, variant });
          close();
          closeThinking();
        });
    },
    [streamCb, setDone],
  );
  return {
    generatePrompt: fn,
    done,
    isLoading: visible,
    isThinking,
  };
};
