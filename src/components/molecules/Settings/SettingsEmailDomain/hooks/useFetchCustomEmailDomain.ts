import { useCallback, useEffect, useState } from 'react';

import { EmailDomainDetails, HttpError } from '@/types';
import { _fetchCustomEmailDomains } from '@/request';
import { useUserStore } from '@/providers';
import { SDRToast } from '@/components/atoms';

export const useFetchCustomEmailDomain = () => {
  const { userProfile } = useUserStore((state) => state);
  const { tenantId } = userProfile;

  const [loading, setLoading] = useState(false);
  const [emailDomainList, setEmailDomainList] = useState<EmailDomainDetails[]>(
    [],
  );

  const onRefresh = useCallback(async () => {
    if (loading || !tenantId) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await _fetchCustomEmailDomains(tenantId);
      setEmailDomainList(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  }, [loading, tenantId]);

  useEffect(() => {
    tenantId && onRefresh();
  }, [tenantId]);

  return {
    loading,
    emailDomainList,
    setEmailDomainList,
    onRefresh,
  };
};
