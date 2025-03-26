import { FC, useState } from 'react';
import { Stack, Typography } from '@mui/material';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledDialogProps,
  StyledTextField,
} from '@/components/atoms';

import { useAsyncFn } from '@/hooks';
import { _createNewSegment } from '@/request';
import { ContactsTableTypeEnum, HttpError } from '@/types';
import {
  useContactsStore,
  useContactsToolbarStore,
  useGridStore,
} from '@/stores/ContactsStores';

type SaveSegmentDialogProps = {
  segmentType: ContactsTableTypeEnum;
} & StyledDialogProps;

export const SaveSegmentDialog: FC<SaveSegmentDialogProps> = ({
  open,
  onClose,
  segmentType,
  ...rest
}) => {
  const { fetchSegmentsOptions, setSelectedSegmentId } = useContactsStore(
    (state) => state,
  );
  const { segmentsFilters } = useContactsToolbarStore((state) => state);
  const { totalRecordsWithFilter } = useGridStore((state) => state);

  const [segmentName, setSegmentName] = useState('');

  const [state, createSegment] = useAsyncFn(async () => {
    const postData = {
      tableId: segmentType,
      tableName: '',
      segmentName,
      segmentsFilters: segmentsFilters!,
    };
    try {
      const { data } = await _createNewSegment(postData);
      await fetchSegmentsOptions(segmentType);
      setSelectedSegmentId(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      onClose?.({}, 'backdropClick');
      setSegmentName('');
    }
  }, [segmentType, segmentsFilters, segmentName]);

  return (
    <StyledDialog
      content={
        <Stack gap={1.5} py={3}>
          <StyledTextField
            label={'List name'}
            onChange={(e) => setSegmentName(e.target.value)}
            value={segmentName}
          />
          <Typography color={'text.secondary'} variant={'body2'}>
            This list has {totalRecordsWithFilter}{' '}
            {totalRecordsWithFilter === 1 ? 'contact' : 'contacts'}. That&#39;s
            100% of your total contacts.
          </Typography>
        </Stack>
      }
      footer={
        <Stack flexDirection={'row'} gap={1.5}>
          <StyledButton
            color={'info'}
            onClick={() => {
              onClose?.({}, 'backdropClick');
            }}
            size={'medium'}
            variant={'outlined'}
          >
            Back
          </StyledButton>
          <StyledButton
            disabled={state.loading || !segmentName}
            loading={state.loading}
            onClick={createSegment}
            size={'medium'}
            sx={{
              width: '155px',
            }}
          >
            Finish creating list
          </StyledButton>
        </Stack>
      }
      header={'What is your list’s name?'}
      onClose={onClose}
      open={open}
      {...rest}
    />
  );
};
