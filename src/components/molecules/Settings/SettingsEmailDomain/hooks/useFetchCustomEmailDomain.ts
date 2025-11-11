import { useCallback, useEffect, useState } from 'react';

import { useUserStore } from '@/providers';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const useFetchCustomEmailDomain = () => {
  const { userProfile } = useUserStore((state) => state);
  const { fetchEmailDomainList } = useSettingsStore((state) => state);
  const { tenantId } = userProfile;

  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(async () => {
    if (loading || !tenantId) {
      return;
    }
    setLoading(true);
    try {
      await fetchEmailDomainList(tenantId);
    } finally {
      setLoading(false);
    }
  }, [loading, tenantId, fetchEmailDomainList]);

  useEffect(() => {
    tenantId && onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  return {
    loading,
    onRefresh,
  };
};
