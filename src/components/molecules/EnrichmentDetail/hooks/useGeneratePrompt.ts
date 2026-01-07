import { useCallback, useState } from 'react';

import { SDRToast } from '@/components/atoms';
import { useSwitch } from '@/hooks';
import { generatePrompt } from '@/request';
import { HttpError } from '@/types';

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

              // Split by SSE events
              const events = (buffer.split('\n\n') || ['']) as string[];
              buffer = events.pop() || ''; // Last one might be incomplete

              for (const e of events) {
                const chunk = e.replace(/data:/g, ''); // Remove `data: `

                // Could be JSON or plain text
                // try {
                //   const json = JSON.parse(chunk);
                //   const delta = json.choices?.[0]?.delta?.content ?? '';
                //   console.log(delta);
                //   fullText += delta;
                // } catch {
                // Plain text (SSE might push Markdown directly)
                fullText += chunk;
                // }
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
