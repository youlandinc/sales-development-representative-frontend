import { useCallback, useMemo, useState } from 'react';

import { useSettingsStore } from '@/stores/useSettingsStore';

import { useSwitch } from '@/hooks';
import { SDRToast } from '@/components/atoms';
import { Mailbox } from '@/types';

import { _saveMailbox, _updateMailbox } from '../data';

enum ActiveTypeEnum {
  add = 'add',
  edit = 'edit',
}

interface UseDialogProps {
  onRefresh: () => void;
}

export const useDialog = ({ onRefresh }: UseDialogProps) => {
  const { emailDomainList } = useSettingsStore((state) => state);
  const { open, close, visible } = useSwitch(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [mailboxPrefix, setMailboxPrefix] = useState('');
  const [domain, setDomain] = useState('');

  const [type, setType] = useState(ActiveTypeEnum.add);
  const [curretnId, setCurretnId] = useState('');

  const saveDisabled = useMemo(() => {
    return !mailboxPrefix || !domain;
  }, [mailboxPrefix, domain]);

  const onAddMailbox = () => {
    open();
  };
  const onCancelDialog = useCallback(() => {
    close();
    setMailboxPrefix('');
    setDomain('');
    setType(ActiveTypeEnum.add);
    setCurretnId('');
  }, [close]);

  const onClickEdit = async (item: Mailbox) => {
    setMailboxPrefix(item.prefixName);
    const domain =
      emailDomainList.find((list) => list.emailDomain === item.domain)
        ?.emailDomain || '';
    setDomain(domain);
    setType(ActiveTypeEnum.edit);
    setCurretnId(item.id);
    open();
  };

  const onClickSave = useCallback(async () => {
    if (saveDisabled) {
      return;
    }
    setSaveLoading(true);
    try {
      if (type === ActiveTypeEnum.add) {
        await _saveMailbox({
          prefixName: mailboxPrefix,
          domain,
        });
      } else if (type === ActiveTypeEnum.edit) {
        await _updateMailbox({
          id: curretnId,
          prefixName: mailboxPrefix,
          domain,
        });
      }
      onRefresh();
      onCancelDialog();
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setSaveLoading(false);
    }
  }, [
    mailboxPrefix,
    domain,
    saveDisabled,
    onRefresh,
    onCancelDialog,
    type,
    curretnId,
  ]);

  return {
    onAddMailbox,
    onClickEdit,
    visible,
    onCancelDialog,
    saveDisabled,
    saveLoading,
    onClickSave,
    mailboxPrefix,
    setMailboxPrefix,
    domain,
    setDomain,
  };
};
