import { useCallback, useRef, useState } from 'react';

import { get } from '@/request/request';

export interface CascadeOption {
  key: string;
  label: string;
}

interface ApiResponseItem {
  key?: string;
  label?: string;
  name?: string;
  value?: string;
}

interface UseCascadeOptionsParams {
  requestParams?: Record<string, string[]>;
  mockParentOptions?: CascadeOption[];
  mockChildrenByParent?: Record<string, CascadeOption[]>;
}

const buildUrlWithParams = (
  baseUrl: string,
  requestParams?: Record<string, string[]>,
): string => {
  const params = new URLSearchParams();

  if (requestParams) {
    Object.entries(requestParams).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((val) => {
          if (val !== undefined && val !== null && val !== '') {
            params.append(key, String(val));
          }
        });
      }
    });
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

const extractItemsFromResponse = (responseData: unknown): ApiResponseItem[] => {
  if (Array.isArray(responseData)) {
    return responseData;
  }
  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    Array.isArray((responseData as { data?: unknown }).data)
  ) {
    return (responseData as { data: ApiResponseItem[] }).data;
  }
  return [];
};

const mapApiResponseToOptions = (items: ApiResponseItem[]): CascadeOption[] =>
  items.map((item) => ({
    key: item.key || item.value || item.label || String(item),
    label: item.label || item.name || item.value || String(item),
  }));

export const useCascadeOptions = ({
  requestParams,
  mockParentOptions,
  mockChildrenByParent,
}: UseCascadeOptionsParams) => {
  const [parentOptions, setParentOptions] = useState<CascadeOption[]>([]);
  const [childOptions, setChildOptions] = useState<CascadeOption[]>([]);
  const [isLoadingParent, setIsLoadingParent] = useState(false);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [childrenByParent, setChildrenByParent] = useState<Map<string, CascadeOption[]>>(new Map());

  const parentAbortRef = useRef<AbortController | null>(null);
  const childAbortRef = useRef<AbortController | null>(null);

  const fetchParentOptions = useCallback(
    (url?: string) => {
      if (mockParentOptions) {
        setIsLoadingParent(true);
        setTimeout(() => {
          setParentOptions(mockParentOptions);
          setIsLoadingParent(false);
        }, 500);
        return;
      }

      if (!url) {
        return;
      }

      parentAbortRef.current?.abort();
      const controller = new AbortController();
      parentAbortRef.current = controller;

      setIsLoadingParent(true);
      setParentOptions([]);

      const requestUrl = buildUrlWithParams(url, requestParams);

      get(requestUrl, { signal: controller.signal })
        .then((res) => {
          if (controller.signal.aborted) {
            return;
          }
          const items = extractItemsFromResponse(res.data);
          setParentOptions(mapApiResponseToOptions(items));
        })
        .catch((error: unknown) => {
          if ((error as { code?: string })?.code !== 'ERR_CANCELED') {
            // eslint-disable-next-line no-console
            console.error('Failed to fetch cascade parents:', error);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoadingParent(false);
          }
        });
    },
    [requestParams, mockParentOptions],
  );

  const fetchChildOptions = useCallback(
    (urlOrParentKey: string, parentKey?: string) => {
      const actualParentKey = parentKey || urlOrParentKey;

      if (mockChildrenByParent) {
        setIsLoadingChildren(true);
        setTimeout(() => {
          const mockChildren = mockChildrenByParent[actualParentKey] || [];
          setChildOptions(mockChildren);
          setChildrenByParent((prev) => {
            const next = new Map(prev);
            next.set(actualParentKey, mockChildren);
            return next;
          });
          setIsLoadingChildren(false);
        }, 300);
        return;
      }

      if (!parentKey) {
        return;
      }

      childAbortRef.current?.abort();
      const controller = new AbortController();
      childAbortRef.current = controller;

      setIsLoadingChildren(true);
      setChildOptions([]);

      const requestUrl = buildUrlWithParams(urlOrParentKey, requestParams);

      get(requestUrl, { signal: controller.signal })
        .then((res) => {
          if (controller.signal.aborted) {
            return;
          }
          const items = extractItemsFromResponse(res.data);
          const options = mapApiResponseToOptions(items);
          setChildOptions(options);
          setChildrenByParent((prev) => {
            const next = new Map(prev);
            next.set(parentKey, options);
            return next;
          });
        })
        .catch((error: unknown) => {
          if ((error as { code?: string })?.code !== 'ERR_CANCELED') {
            // eslint-disable-next-line no-console
            console.error('Failed to fetch cascade children:', error);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoadingChildren(false);
          }
        });
    },
    [requestParams, mockChildrenByParent],
  );

  return {
    parentOptions,
    childOptions,
    isLoadingParent,
    isLoadingChildren,
    childrenByParent,
    fetchParentOptions,
    fetchChildOptions,
  };
};
