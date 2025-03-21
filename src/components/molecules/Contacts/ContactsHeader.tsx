import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Stack } from '@mui/material';

import { useSwitch } from '@/hooks';

import {
  useContactsStore,
  useDirectoryToolbarStore,
  useGridStore,
} from '@/stores/ContactsStores';
import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';
import { HeaderFilter } from './index';

import { _createNewSegment, _updateExistSegment } from '@/request';
import { ContactsTableTypeEnum, FilterProps, HttpError } from '@/types';

type ContactsHeaderProps = {
  headerType: ContactsTableTypeEnum;
};

export const ContactsHeader: FC<ContactsHeaderProps> = ({ headerType }) => {
  const { visible, open, close } = useSwitch(false);

  const {
    setPageMode,
    selectedSegmentId,
    fetchSegmentsOptions,
    setSelectedSegmentId,
    updateSelectedSegment,
  } = useContactsStore((state) => state);
  const { columnOptions, tableId, tableName } = useGridStore((state) => state);
  const {
    segmentsFilters,
    originalSegmentsFilters,
    addSegmentsFiltersGroup,
    addSegmentsFilters,
    deleteSegmentsFilters,
    onChangeSegmentsFilters,
    setSegmentsFilters,
    clearSegmentsFiltersGroup,
    setOriginalSegmentsFilters,
  } = useDirectoryToolbarStore((state) => state);

  const [showFooter, setShowFooter] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const filterGroup = useMemo(() => {
    const result: FilterProps[][] = [];
    if (segmentsFilters) {
      Object.entries(segmentsFilters).forEach(([, value]) => {
        if (value) {
          result.push(value);
        }
      });
    }
    return result;
  }, [segmentsFilters]);

  const onClickToCreateSegment = useCallback(async () => {
    const postData = {
      tableId,
      tableName,
      segmentName,
      segmentsFilters: segmentsFilters!,
    };
    setCreateLoading(true);
    try {
      const { data } = await _createNewSegment(postData);
      await fetchSegmentsOptions(headerType);
      setSelectedSegmentId(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setCreateLoading(false);
      close();
      setSegmentName('');
    }
  }, [
    tableId,
    tableName,
    segmentName,
    segmentsFilters,
    fetchSegmentsOptions,
    setSelectedSegmentId,

    close,
  ]);

  const onClickToSaveChanges = useCallback(async () => {
    if (!selectedSegmentId && selectedSegmentId != -1) {
      return;
    }
    if (selectedSegmentId) {
      const postData = {
        segmentsId: selectedSegmentId,
        segmentsFilters: segmentsFilters,
      };
      setUpdateLoading(true);
      try {
        await _updateExistSegment(postData);
        setOriginalSegmentsFilters(segmentsFilters);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setUpdateLoading(false);
      }
    }
  }, [segmentsFilters, selectedSegmentId, setOriginalSegmentsFilters]);

  const onClickToCancelChanges = useCallback(async () => {
    if (selectedSegmentId == -1) {
      clearSegmentsFiltersGroup();
      return;
    }
    if (!selectedSegmentId) {
      const postData = {
        segmentId: -1,
      };
      try {
        await _updateExistSegment(postData);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
      clearSegmentsFiltersGroup();
    } else {
      setSegmentsFilters(originalSegmentsFilters);
    }
  }, [
    clearSegmentsFiltersGroup,
    originalSegmentsFilters,
    selectedSegmentId,
    setSegmentsFilters,
  ]);

  useEffect(() => {
    return useDirectoryToolbarStore.subscribe((state, prevState) => {
      if (state.segmentsFilters === prevState.segmentsFilters) {
        return;
      }

      const shouldShowFooter = () => {
        if (Object.keys(state.segmentsFilters).length === 0) {
          return false;
        }

        const hasValidSegments = Object.values(state.segmentsFilters).every(
          (segment) =>
            segment.length > 0 &&
            segment.every(
              (item) => item.columnName && item.operation && item.operationText,
            ),
        );

        if (!hasValidSegments) {
          return false;
        }

        return state.originalSegmentsFilters !== state.segmentsFilters;
      };

      setShowFooter(shouldShowFooter());
    });
  }, []);

  return (
    <>
      <Stack flexDirection={'row'}>
        <HeaderFilter headerType={headerType} />
      </Stack>

      <StyledDialog
        content={
          <Stack py={3}>
            <StyledTextField
              label={'Segment name'}
              onChange={(e) => setSegmentName(e.target.value)}
              size={'small'}
              value={segmentName}
            />
          </Stack>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5}>
            <StyledButton
              color={'info'}
              onClick={close}
              size={'small'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={createLoading || !segmentName}
              loading={createLoading}
              onClick={onClickToCreateSegment}
              size={'small'}
              sx={{
                width: '60px',
              }}
            >
              Save
            </StyledButton>
          </Stack>
        }
        header={'Save as segment'}
        onClose={close}
        open={visible}
      />
    </>
  );
};
