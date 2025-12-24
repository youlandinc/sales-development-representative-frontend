import { useCallback, useMemo, useRef, useState } from 'react';

import { get } from '@/request/request';

export interface CascadeOption {
  value: string;
  label: string;
  key: string;
  id: number;
  parentId: number | null;
  sort: number;
}

export interface TreeOption extends CascadeOption {
  children: TreeOption[];
  level: number;
  pathLabels: string[];
}

interface ApiResponseItem {
  value: string;
  label: string;
  key: string;
  id: number;
  parentId?: number | null;
  sort: number;
}

interface UseCascadeOptionsParams {
  url: string | null;
  requestParams?: Record<string, string[]>;
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
    value: item.value || item.key || item.label || String(item),
    label: item.label || item.key || item.value || String(item),
    parentId: item.parentId || null,
    sort: item.sort,
    key: item.key,
    id: item.id,
  }));

const buildTree = (
  flatOptions: CascadeOption[],
  idMap: Map<number, CascadeOption>,
): TreeOption[] => {
  const treeMap = new Map<string, TreeOption>();
  const roots: TreeOption[] = [];

  flatOptions.forEach((opt) => {
    treeMap.set(opt.value, {
      ...opt,
      children: [],
      level: 0,
      pathLabels: [],
    });
  });

  const getPathLabels = (id: number): string[] => {
    const labels: string[] = [];
    let current = idMap.get(id);
    while (current) {
      labels.unshift(current.label);
      current = current.parentId ? idMap.get(current.parentId) : undefined;
    }
    return labels;
  };

  const getLevel = (id: number): number => {
    let level = 0;
    let current = idMap.get(id);
    while (current?.parentId) {
      level++;
      current = idMap.get(current.parentId);
    }
    return level;
  };

  flatOptions.forEach((opt) => {
    const node = treeMap.get(opt.value)!;
    node.level = getLevel(opt.id);
    node.pathLabels = getPathLabels(opt.id);

    if (opt.parentId) {
      const parent = idMap.get(opt.parentId);
      if (parent) {
        const parentNode = treeMap.get(parent.value);
        parentNode?.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const useCascadeOptions = ({
  url,
  requestParams,
}: UseCascadeOptionsParams) => {
  const [flatOptions, setFlatOptions] = useState<CascadeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const hasFetchedRef = useRef(false);

  const optionMap = useMemo(() => {
    const map = new Map<string, CascadeOption>();
    flatOptions.forEach((opt) => map.set(opt.value, opt));
    return map;
  }, [flatOptions]);

  const idMap = useMemo(() => {
    const map = new Map<number, CascadeOption>();
    flatOptions.forEach((opt) => map.set(opt.id, opt));
    return map;
  }, [flatOptions]);

  const childrenMap = useMemo(() => {
    const map = new Map<number | null, CascadeOption[]>();
    flatOptions.forEach((opt) => {
      const siblings = map.get(opt.parentId) || [];
      siblings.push(opt);
      map.set(opt.parentId, siblings);
    });
    map.forEach((children) => {
      children.sort((a, b) => a.sort - b.sort);
    });
    return map;
  }, [flatOptions]);

  const treeData = useMemo(
    () => buildTree(flatOptions, idMap),
    [flatOptions, idMap],
  );

  const fetchOptions = useCallback(() => {
    if (hasFetchedRef.current || !url) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    hasFetchedRef.current = true;

    const requestUrl = buildUrlWithParams(url, requestParams);

    get(requestUrl, { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) {
          return;
        }
        const items = extractItemsFromResponse(res.data);
        setFlatOptions(mapApiResponseToOptions(items));
      })
      .catch((error: unknown) => {
        if ((error as { code?: string })?.code !== 'ERR_CANCELED') {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch cascade options:', error);
          hasFetchedRef.current = false;
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
  }, [url, requestParams]);

  const getChildren = useCallback(
    (parentId: number | null): CascadeOption[] =>
      childrenMap.get(parentId) || [],
    [childrenMap],
  );

  const getOption = useCallback(
    (value: string): CascadeOption | undefined => optionMap.get(value),
    [optionMap],
  );

  const getPathLabels = useCallback(
    (value: string): string[] => {
      const labels: string[] = [];
      let current = optionMap.get(value);
      while (current) {
        labels.unshift(current.label);
        current = current.parentId ? idMap.get(current.parentId) : undefined;
      }
      return labels;
    },
    [optionMap, idMap],
  );

  return {
    flatOptions,
    treeData,
    optionMap,
    childrenMap,
    isLoading,
    fetchOptions,
    getChildren,
    getOption,
    getPathLabels,
  };
};
