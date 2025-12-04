import { useCallback, useEffect, useRef, useState } from 'react';

import { useUserStore } from '@/providers';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const useFetchCustomEmailDomain = () => {
  const userProfile = useUserStore((state) => state.userProfile);
  const fetchEmailDomainList = useSettingsStore(
    (state) => state.fetchEmailDomainList,
  );
  const { tenantId } = userProfile;

  const [loading, setLoading] = useState(false);
  const isFirstRefresh = useRef(true);

  const onRefresh = useCallback(async () => {
    if (!tenantId) {
      return;
    }
    if (isFirstRefresh.current) {
      setLoading(true);
    }
    try {
      await fetchEmailDomainList(tenantId);
    } finally {
      if (isFirstRefresh.current) {
        setLoading(false);
        isFirstRefresh.current = false;
      }
    }
  }, [tenantId, fetchEmailDomainList]);

  useEffect(() => {
    tenantId && onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  return {
    loading,
    onRefresh,
  };
};
