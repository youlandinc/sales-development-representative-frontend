import useSWR from 'swr';
import { useMemo, useState } from 'react';

import { SDRToast } from '@/components/atoms';

import {
  _createEmailProfile,
  _deleteEmailProfile,
  _fetchEmailProfiles,
  _updateEmailProfile,
} from '@/request';

import { EmailProfile, EmailProfileResponse } from '@/types';

import { useAsyncFn, useSwitch } from '@/hooks';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const useEmailProfilesRequest = () => {
  const mailboxes = useSettingsStore((state) => state.mailboxes);

  const { data, mutate, isLoading } = useSWR(
    'emailProfiles',
    _fetchEmailProfiles,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  );

  const { visible, open, close } = useSwitch();
  const {
    visible: deleteVisible,
    open: deleteOpen,
    close: deleteClose,
  } = useSwitch();
  const [editId, setEditId] = useState<number | null>(null);
  const [editInfo, setEditInfo] = useState<EmailProfileResponse | null>(null);
  const [name, setName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [connectedMailboxes, setConnectedMailboxes] = useState<TOption[]>([]);
  const [defaultMailbox, setDefaultMailbox] = useState<string>('');
  const [rotationEnabled, setRotationEnabled] = useState<boolean>(false);

  const onClickEdit = (profile: EmailProfile) => {
    open();
    setEditId(profile.id);
    setName(profile.senderName);
    setContent(profile.signatureContent);
    setConnectedMailboxes(
      profile.mailboxList.map((item) => ({
        label: item.mailboxName,
        value: item.id,
        key: item.id,
      })),
    );
    setDefaultMailbox(profile.defaultMailbox.id);
    setRotationEnabled(profile.rotationEnabled);
  };

  const onClickDelete = (id: number) => {
    setEditId(id);
    deleteOpen();
  };

  const onClickCancel = () => {
    close();
    deleteClose();
    setEditId(null);
    setName('');
    setContent('');
    setConnectedMailboxes([]);
    setDefaultMailbox('');
    setRotationEnabled(false);
  };

  const onClickCreateProfile = () => {
    if (typeof editId === 'number') {
      setEditId(null);
      setName('');
      setContent('');
      setConnectedMailboxes([]);
      setDefaultMailbox('');
      setRotationEnabled(false);
    }
    open();
  };

  const [createState, createEmailProfile] = useAsyncFn(async () => {
    try {
      await _createEmailProfile({
        senderName: name,
        signatureContent: content,
        mailboxIds: connectedMailboxes.map((item) => item.value),
        defaultMailboxId: defaultMailbox,
        rotationEnabled,
      });
      await mutate();
      close();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({
        message,
        header,
        variant,
      });
    }
  }, [name, content, connectedMailboxes, defaultMailbox, rotationEnabled]);

  const [updateState, updateEmailProfile] = useAsyncFn(async () => {
    if (!editId) {
      return;
    }
    try {
      await _updateEmailProfile({
        id: editId,
        senderName: name,
        signatureContent: content,
        mailboxIds: connectedMailboxes.map((item) => item.value),
        defaultMailboxId: defaultMailbox,
        rotationEnabled,
      });
      await mutate();
      close();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({
        message,
        header,
        variant,
      });
    }
  }, [name, content, connectedMailboxes, defaultMailbox, rotationEnabled]);

  //delete
  const [deleteState, deleteEmailProfile] = useAsyncFn(async () => {
    if (!editId) {
      return;
    }
    try {
      await _deleteEmailProfile(editId);
      await mutate();
      deleteClose();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({
        message,
        header,
        variant,
      });
    }
  }, [editId]);

  const submitMethod = useMemo(() => {
    if (editId) {
      return { request: updateEmailProfile, state: updateState };
    }
    return { request: createEmailProfile, state: createState };
  }, [
    createEmailProfile,
    createState,
    editId,
    updateEmailProfile,
    updateState,
  ]);

  return {
    visible,
    deleteVisible,
    open,
    onClickCancel,
    deleteOpen,
    deleteClose,
    onClickEdit,
    onClickDelete,
    onClickCreateProfile,
    editId,
    setEditId,
    editInfo,
    setEditInfo,
    name,
    setName,
    content,
    setContent,
    connectedMailboxes,
    setConnectedMailboxes,
    defaultMailbox,
    setDefaultMailbox,
    rotationEnabled,
    setRotationEnabled,
    mailboxes: mailboxes.map((item) => ({
      label: item.mailboxName,
      value: item.id,
      key: item.id,
    })),
    //requests
    data: (data?.data || []) as EmailProfileResponse,
    isLoading,
    submitMethod,
    deleteEmailProfile,
    deleteState,
  };
};
