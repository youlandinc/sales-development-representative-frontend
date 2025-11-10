import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { EmailDomainDetails, HttpError } from '@/types';
import { _fetchCustomEmailDomains } from '@/request';
import { useUserStore } from '@/providers';
import { SDRToast } from '@/components/atoms';

interface UseFetchCustomEmailDomainProps {
  setEmailDomainList: Dispatch<SetStateAction<EmailDomainDetails[]>>;
}

export const useFetchCustomEmailDomain = ({
  setEmailDomainList,
}: UseFetchCustomEmailDomainProps) => {
  const { userProfile } = useUserStore((state) => state);
  const { tenantId } = userProfile;

  const [loading, setLoading] = useState(false);

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
  }, [loading, tenantId, setEmailDomainList]);

  useEffect(() => {
    tenantId && onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  return {
    loading,
    onRefresh,
  };
};
