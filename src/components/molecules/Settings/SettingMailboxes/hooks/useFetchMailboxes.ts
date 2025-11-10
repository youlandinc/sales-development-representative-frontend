import { useCallback, useEffect, useState } from 'react';

import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';

import { _fetchMailboxes, Mailbox } from '../data';

export const useFetchMailboxes = () => {
  const [loading, setLoading] = useState(false);
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);

  const onRefresh = useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await _fetchMailboxes();
      setMailboxes(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    mailboxes,
    setMailboxes,
    onRefresh,
  };
};
