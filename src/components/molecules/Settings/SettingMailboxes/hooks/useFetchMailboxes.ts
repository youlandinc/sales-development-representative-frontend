import { useCallback, useEffect, useRef, useState } from 'react';

import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const useFetchMailboxes = () => {
  const [loading, setLoading] = useState(false);
  const isFirstRefresh = useRef(true);
  const fetchMailboxes = useSettingsStore((state) => state.fetchMailboxes);

  const onRefresh = useCallback(async () => {
    if (isFirstRefresh.current) {
      setLoading(true);
    }
    try {
      await fetchMailboxes();
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      if (isFirstRefresh.current) {
        setLoading(false);
        isFirstRefresh.current = false;
      }
    }
  }, [fetchMailboxes]);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    onRefresh,
  };
};
