import React, { useCallback } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { StyledButton } from '@/components/atoms';
import { useRouter } from 'nextjs-toploader/app';

import {
  ToolBarTypeEnum,
  useContactsStore,
  useContactsToolbarStore,
} from '@/stores/ContactsStores';

import ICON_CREATE_SEGMENT from './assets/icon_create_segment.svg';
import { CommonSegmentsDrawer } from '@/components/molecules';
import { useSwitch } from '@/hooks';

export const HeaderSegments = () => {
  const router = useRouter();
  const { updateSelectedSegment, clearSegmentSelectState } = useContactsStore(
    (state) => state,
  );
  const {
    createSegmentsFiltersGroup,
    clearSegmentsFiltersGroup,
    setFromOther,
    setToolBarType,
  } = useContactsToolbarStore((state) => state);

  const { visible, open, close } = useSwitch();
  const onClickToCreateSegment = useCallback(async () => {
    clearSegmentsFiltersGroup();
    await updateSelectedSegment(-1);
    clearSegmentSelectState();
    createSegmentsFiltersGroup();
    setFromOther(true);
    open();
    setToolBarType(ToolBarTypeEnum.new_segment);
    // router.push('/contacts');
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clearSegmentSelectState,
    clearSegmentsFiltersGroup,
    createSegmentsFiltersGroup,
    router,
    setFromOther,
    updateSelectedSegment,
  ]);
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
    >
      <Typography variant={'h5'}>Lists</Typography>
      <StyledButton
        color={'info'}
        onClick={onClickToCreateSegment}
        size={'small'}
        variant={'text'}
      >
        <Stack alignItems={'center'} flexDirection={'row'} gap={'6px'}>
          <Icon
            component={ICON_CREATE_SEGMENT}
            sx={{ width: 24, height: 24 }}
          />
          <Typography color={'text.primary'} variant={'body2'}>
            Create a lists
          </Typography>
        </Stack>
      </StyledButton>
      <CommonSegmentsDrawer onClose={close} open={visible} />
    </Stack>
  );
};
