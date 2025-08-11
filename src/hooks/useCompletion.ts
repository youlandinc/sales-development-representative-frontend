import { useCallback, useEffect, useId, useRef, useState } from 'react';
import useSWR from 'swr';
import { useThrottleFn } from '@/hooks';

// 有效的数据流类型代码数组，比如 ['text', 'reasoning', ...]
// const validCodes = dataStreamParts.map((part) => part.code);

/**
 * 解析一条数据流字符串，格式类似 "code:jsonString"
 * @param {string} partString
 * @returns 解析后的数据对象
 */
function parseDataStreamPart(partString) {
  // 找到第一个冒号的位置，分隔 code 和 json 部分
  const separatorIndex = partString.indexOf(':');

  if (separatorIndex === -1) {
    throw new Error('Failed to parse stream string. No separator found.');
  }

  // code 是冒号之前的部分
  const code = partString.slice(0, separatorIndex);

  // if (!validCodes.includes(code)) {
  //   throw new Error(`Failed to parse stream string. Invalid code ${code}.`);
  // }

  // json 字符串是冒号之后的部分
  const jsonString = partString.slice(separatorIndex + 1);

  // 解析 json
  const parsedData = JSON.parse(jsonString);

  // 调用对应 code 的解析函数，返回解析结果
  return /*dataStreamPartsByCode[code].parse(parsedData)*/ {
    type: 'text',
    value: parsedData,
  };
}

// 换行符的 ASCII 码（换行符为 LF，值是10）

/**
 * 把多个 Uint8Array 数据块拼接成一个 Uint8Array
 * @param {Uint8Array[]} chunks - 多个数据块
 * @param {number} totalLength - 所有数据块的总长度
 * @returns {Uint8Array} 拼接后的完整数据块
 */
function concatChunks(chunks, totalLength) {
  const combined = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  // 清空原来的 chunks 数组，方便复用
  chunks.length = 0;

  return combined;
}

async function processDataStream({
  stream,
  onTextPart,
  onReasoningPart,
  onReasoningSignaturePart,
  onRedactedReasoningPart,
  onSourcePart,
  onDataPart,
  onErrorPart,
  onToolCallStreamingStartPart,
  onToolCallDeltaPart,
  onToolCallPart,
  onToolResultPart,
  onMessageAnnotationsPart,
  onFinishMessagePart,
  onFinishStepPart,
  onStartStepPart,
}) {
  const reader = stream.getReader();
  const textDecoder = new TextDecoder();
  const chunks = [];
  let totalLength = 0;

  for (;;) {
    const { value } = await reader.read();

    if (value) {
      chunks.push(value);
      totalLength += value.length;
      // 如果最后一个字节不是换行符，继续读取
      if (value[value.length - 1] !== 10) {
        continue;
      }
    }

    // 读到流尾且没有数据则结束
    if (chunks.length === 0) {
      break;
    }

    // 拼接所有 Uint8Array 块成一个完整块
    const combinedChunk = concatChunks(chunks, totalLength);
    totalLength = 0;

    // 解码为字符串并按换行符拆分每一条数据
    const decodedString = textDecoder.decode(combinedChunk, { stream: true });
    const dataParts = decodedString
      .split('\n')
      .filter((line) => line !== '')
      .map(parseDataStreamPart);

    for (const { type, value } of dataParts) {
      switch (type) {
        case 'text':
          if (onTextPart) {
            await onTextPart(value);
          }
          break;
        case 'reasoning':
          if (onReasoningPart) {
            await onReasoningPart(value);
          }
          break;
        case 'reasoning_signature':
          if (onReasoningSignaturePart) {
            await onReasoningSignaturePart(value);
          }
          break;
        case 'redacted_reasoning':
          if (onRedactedReasoningPart) {
            await onRedactedReasoningPart(value);
          }
          break;
        case 'source':
          if (onSourcePart) {
            await onSourcePart(value);
          }
          break;
        case 'data':
          if (onDataPart) {
            await onDataPart(value);
          }
          break;
        case 'error':
          if (onErrorPart) {
            await onErrorPart(value);
          }
          break;
        case 'message_annotations':
          if (onMessageAnnotationsPart) {
            await onMessageAnnotationsPart(value);
          }
          break;
        case 'tool_call_streaming_start':
          if (onToolCallStreamingStartPart) {
            await onToolCallStreamingStartPart(value);
          }
          break;
        case 'tool_call_delta':
          if (onToolCallDeltaPart) {
            await onToolCallDeltaPart(value);
          }
          break;
        case 'tool_call':
          if (onToolCallPart) {
            await onToolCallPart(value);
          }
          break;
        case 'tool_result':
          if (onToolResultPart) {
            await onToolResultPart(value);
          }
          break;
        case 'finish_message':
          if (onFinishMessagePart) {
            await onFinishMessagePart(value);
          }
          break;
        case 'finish_step':
          if (onFinishStepPart) {
            await onFinishStepPart(value);
          }
          break;
        case 'start_step':
          if (onStartStepPart) {
            await onStartStepPart(value);
          }
          break;
        default:
          throw new Error(`Unknown stream part type: ${type}`);
      }
    }
  }
}

// 处理纯文本流，逐块读取并回调
async function processTextStream({ stream, onTextPart }) {
  // 通过 TextDecoderStream 把二进制流解码成字符串流
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    // 每读取一块文本就调用回调
    await onTextPart(value);
  }
}

async function callCompletionApi({
  api: apiUrl,
  prompt: promptText,
  credentials,
  headers,
  body,
  streamProtocol = 'data',
  setCompletion,
  setLoading,
  setError,
  setAbortController,
  onResponse,
  onFinish,
  onError,
  onData,
  // fetch = fetch,
}) {
  let responseText;
  try {
    setLoading(true);
    setError(undefined);

    const abortController = new AbortController();
    setAbortController(abortController);

    setCompletion('');

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ prompt: promptText, ...body }),
      credentials,
      headers: { 'Content-Type': 'application/json', ...headers },
      signal: abortController.signal,
    }).catch((fetchError) => {
      throw fetchError;
    });

    if (onResponse) {
      try {
        await onResponse(response);
      } catch (callbackError) {
        throw callbackError;
      }
    }

    if (!response.ok) {
      throw new Error(
        (await response.text()) ?? 'Failed to fetch the chat response.',
      );
    }

    if (!response.body) {
      throw new Error('The response body is empty.');
    }

    let accumulatedText = '';

    switch (streamProtocol) {
      case 'text': {
        await processTextStream({
          stream: response.body,
          onTextPart: (textChunk) => {
            accumulatedText += textChunk;
            setCompletion(accumulatedText);
          },
        });
        break;
      }
      case 'data': {
        await processDataStream({
          stream: response.body,
          onTextPart(textChunk) {
            accumulatedText += textChunk;
            setCompletion(accumulatedText);
          },
          onDataPart(dataChunk) {
            if (onData) {
              onData(dataChunk);
            }
          },
          onErrorPart(errorMessage) {
            throw new Error(errorMessage);
          },
        });
        break;
      }
      default: {
        throw new Error(`Unknown stream protocol: ${streamProtocol}`);
      }
    }

    if (onFinish) {
      onFinish(promptText, accumulatedText);
    }

    setAbortController(null);
    return accumulatedText;
  } catch (error) {
    if (error.name === 'AbortError') {
      setAbortController(null);
      return null;
    }
    if (error instanceof Error && onError) {
      onError(error);
    }
    setError(error);
  } finally {
    setLoading(false);
  }
}

export const useCompletion = ({
  api = '/api/completion',
  id,
  initialCompletion = '',
  initialInput = '',
  credentials,
  headers,
  body,
  streamProtocol = 'data',
  fetch: customFetch,
  onResponse,
  onFinish,
  onError,
  experimental_throttle = 500,
} = {}) => {
  const autoId = useId();
  const completionId = id || autoId;

  // SWR 缓存当前 completion 内容
  const { data: completion, mutate: setCompletionData } = useSWR(
    [api, completionId],
    null,
    { fallbackData: initialCompletion },
  );
  // SWR 缓存 loading 状态
  const { data: isLoading = false, mutate: setLoading } = useSWR(
    [completionId, 'loading'],
    null,
  );

  // SWR 缓存流式数据（分段接收的结果）
  const { data: streamData, mutate: setStreamData } = useSWR(
    [completionId, 'streamData'],
    null,
  );

  const throttle = useThrottleFn((newText: string) => {
    setCompletionData(newText, false);
  }, experimental_throttle);

  const throttleStream = useThrottleFn((newData: any[]) => {
    setStreamData([...(streamData ?? []), ...(newData ?? [])], false);
  }, experimental_throttle);

  // React state 保存错误和 AbortController
  const [error, setError] = useState(undefined);
  const currentCompletion = completion;
  const [abortController, setAbortController] = useState(null);

  // ref 保存请求时的一些参数，保证最新
  const requestOptionsRef = useRef({ credentials, headers, body });
  useEffect(() => {
    requestOptionsRef.current = { credentials, headers, body };
  }, [credentials, headers, body]);

  // 发送请求
  const complete = useCallback(
    async (prompt, extraOptions) =>
      callCompletionApi({
        api,
        prompt,
        credentials: requestOptionsRef.current.credentials,
        headers: {
          ...requestOptionsRef.current.headers,
          ...(extraOptions?.headers ?? {}),
        },
        body: {
          ...requestOptionsRef.current.body,
          ...(extraOptions?.body ?? {}),
        },
        streamProtocol,
        fetch: customFetch,
        setCompletion: (newText: string) => {
          throttle(newText);
        },
        onData: (newData: any) => {
          throttleStream(newData);
        },
        setLoading,
        setError,
        setAbortController,
        onResponse,
        onFinish,
        onError,
      }),
    [
      api,
      requestOptionsRef,
      streamData,
      streamProtocol,
      customFetch,
      setCompletionData,
      setStreamData,
      setLoading,
      setError,
      setAbortController,
      onResponse,
      onFinish,
      onError,
      experimental_throttle,
    ],
  );

  // 停止（abort）请求
  const stop = useCallback(() => {
    if (abortController) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      abortController?.abort();
      setAbortController(null);
    }
  }, [abortController]);

  // 手动设置 completion 文本
  const setCompletionText = useCallback(
    (text) => {
      setCompletionData(text, false);
    },
    [setCompletionData],
  );

  // 表单输入
  const [input, setInput] = useState(initialInput);

  // 提交处理
  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (input) {
        complete(input);
      }
    },
    [input, complete],
  );

  // 输入框 onChange
  const handleInputChange = useCallback(
    (e) => {
      setInput(e.target.value);
    },
    [setInput],
  );

  return {
    completion: currentCompletion,
    complete,
    error,
    setCompletion: setCompletionText,
    stop,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    data: streamData,
  };
};
