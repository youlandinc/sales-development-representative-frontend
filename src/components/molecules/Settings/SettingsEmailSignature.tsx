import {
  CircularProgress,
  Icon,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import useSWR from 'swr';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';

import { useAsyncFn, useSwitch } from '@/hooks';
import {
  _createEmailSignature,
  _deleteEmailSignature,
  _fetchEmailSignatures,
} from '@/request';
import { HttpError } from '@/types';

import ICON_DELETE from './assets/icon_delete.svg';
import ICON_EDIT from './assets/icon_edit.svg';

const StyledTinyEditor = dynamic(
  () =>
    import('@/components/atoms/StyledTinyEditor').then(
      (mod) => mod.StyledTinyEditor,
    ),
  {
    ssr: false,
  },
);

export const SettingsEmailSignature = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');
  const [editId, setEditId] = useState<number | undefined>();

  const { visible, open, close } = useSwitch();

  const [name, setName] = useState<string>('');

  const handleClear = () => {
    setName('');
    setEditId(undefined);
    setContent('');
  };

  const handleClose = () => {
    close();
    handleClear();
  };

  const { isLoading, data, mutate } = useSWR(
    'email-signature',
    _fetchEmailSignatures,
    {
      revalidateOnFocus: false,
    },
  );

  const [createState, createEmailSignature] = useAsyncFn(
    async (id?: number) => {
      try {
        await _createEmailSignature({
          id,
          name,
          content: content,
        });
        await mutate();
        close();
        handleClear();
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({
          message,
          header,
          variant,
        });
      }
    },
    [name, content],
  );

  const [deleteState, deleteEmailSignature] = useAsyncFn(async (id: number) => {
    try {
      await _deleteEmailSignature(id);
      await mutate();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({
        message,
        header,
        variant,
      });
    }
  });

  return (
    <Stack gap={2} maxWidth={900}>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Typography>Signature</Typography>
        <StyledButton
          color={'info'}
          onClick={() => {
            open();
          }}
          size={'small'}
          sx={{ py: '6px !important' }}
          variant={'outlined'}
        >
          Create new
        </StyledButton>
      </Stack>
      <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3}>
        {isLoading && <Skeleton variant={'text'} width={'30vw'} />}
        {(data?.data || []).map((item, index) => (
          <Stack
            border={'1px solid'}
            borderColor={'border.default'}
            borderRadius={2}
            flexDirection={'row'}
            justifyContent={'space-between'}
            key={index}
            p={1.5}
            width={'calc(50% - 12px)'}
          >
            <Typography>{item.name}</Typography>
            <Stack flexDirection={'row'} gap={1.5}>
              <Icon
                component={ICON_EDIT}
                onClick={() => {
                  setEditId(item.id);
                  setContent(item.content);
                  setName(item.name);
                  open();
                }}
                sx={{ width: 20, height: 20, cursor: 'pointer' }}
              />
              {deleteState.loading && deleteId === item.id ? (
                <CircularProgress color={'info'} size={20} />
              ) : (
                <Icon
                  component={ICON_DELETE}
                  onClick={() => {
                    setDeleteId(item.id);
                    deleteEmailSignature(item.id);
                  }}
                  sx={{ width: 20, height: 20, cursor: 'pointer' }}
                />
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>
      <StyledDialog
        content={
          <Stack gap={1.5} pt={3}>
            <Typography fontSize={14} fontWeight={700}>
              Signature name
            </Typography>
            <StyledTextField
              onChange={(e) => setName(e.target.value)}
              placeholder={'Name'}
              value={name}
            />
            <StyledTinyEditor
              onChange={(content) => {
                setContent(content);
              }}
              value={content}
            />
          </Stack>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5} pt={3}>
            <StyledButton
              color={'info'}
              onClick={() => {
                close();
              }}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={name.trim() === '' || content?.trim() === ''}
              loading={createState.loading}
              onClick={() => createEmailSignature(editId)}
              size={'medium'}
              sx={{ width: 63 }}
            >
              Save
            </StyledButton>
          </Stack>
        }
        header={'Email signature'}
        onClose={handleClose}
        open={visible}
      />
    </Stack>
  );
};
