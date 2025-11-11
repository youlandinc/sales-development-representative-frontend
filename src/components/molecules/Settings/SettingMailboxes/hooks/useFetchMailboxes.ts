import { useCallback, useEffect, useState } from 'react';

import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const useFetchMailboxes = () => {
  const [loading, setLoading] = useState(false);
  const { fetchMailboxes } = useSettingsStore((state) => state);

  const onRefresh = useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await fetchMailboxes();
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  }, [loading, fetchMailboxes]);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    onRefresh,
  };
};
