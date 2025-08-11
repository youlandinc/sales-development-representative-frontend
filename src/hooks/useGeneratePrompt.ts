import { generatePrompt } from '@/request';
import { useCallback, useState } from 'react';
import { useSwitch } from '@/hooks/useSwitch';

export const useGeneratePrompt = (
  api: string,
  param: Record<string, any>,
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

  const fn = useCallback(async () => {
    open();
    thinking();
    generatePrompt(api, param)
      .then((response) => {
        if (response.body) {
          const reader = response.body.getReader();
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
              const data = decoder
                .decode(value)
                .replace(/data:/g, '')
                .replace(/\n/g, '');
              str = str + data;
              streamCb?.(str);
              // continue read stream
              readStream();
            });
          };
          readStream();
        }
      })
      .catch(() => {
        close();
        closeThinking();
      });
  }, [streamCb, setDone]);
  return {
    generatePrompt: fn,
    done,
    isLoading: visible,
    isThinking,
  };
};
