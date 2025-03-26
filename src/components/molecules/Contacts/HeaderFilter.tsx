import { FC, useEffect, useState } from 'react';
import {
  CircularProgress,
  Icon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { useAsync, useSwitch } from '@/hooks';

import {
  ToolBarTypeEnum,
  useContactsStore,
  useContactsToolbarStore,
  useGridStore,
} from '@/stores/ContactsStores';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  CommonSegmentsDrawer,
  SaveSegmentDialog,
} from '@/components/molecules';

import { ContactsTableTypeEnum, HttpError } from '@/types';

import ICON_FILTER_ADD from './assets/icon_filter_add.svg';
import ICON_LIST from './assets/icon_list.svg';

const defaultBtnStyle = {
  fontSize: '14px !important',
  p: '0 !important',
  height: 'auto !important',
  fontWeight: 400,
};

type HeaderFilterProps = {
  headerType: ContactsTableTypeEnum;
};

export const HeaderFilter: FC<HeaderFilterProps> = ({ headerType }) => {
  const {
    segmentOptions,
    fetchSegmentDetails,
    selectedSegmentId,
    fetchSegmentsOptions,
    updateSelectedSegment,
    clearSegmentSelectState,
    setSelectedSegmentId,
  } = useContactsStore((state) => state);
  const {
    createSegmentsFiltersGroup,
    clearSegmentsFiltersGroup,
    segmentsFilters,
    setOriginalSegmentsFilters,
    fromOther,
    setFromOther,
    computedCanSaved,
    setToolBarType,
  } = useContactsToolbarStore((state) => state);

  const { totalRecordsWithFilter } = useGridStore((state) => state);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectLoading, setSelectLoading] = useState(false);
  // const [segmentName, setSegmentName] = useState('');
  const { visible, close, open } = useSwitch();
  const {
    visible: dialogShow,
    close: dialogClose,
    open: dialogOpen,
  } = useSwitch();

  const showFilter = computedCanSaved();

  const { loading } = useAsync(async () => {
    if (fromOther) {
      return setFromOther(false);
    }
    // if (selectedSegmentId && selectedSegmentId == -1) {
    //   await onClickToSelect(selectedSegmentId);
    //   return;
    // }
    const options = await fetchSegmentsOptions(headerType);
    const target = options.filter((item) => item.isSelect);
    if (target.length > 0) {
      setOriginalSegmentsFilters(await fetchSegmentDetails(target[0].value));
    }
  }, []);

  const onClickToSelect = async (id: string | number) => {
    setSelectLoading(true);
    setSelectedSegmentId(id);
    try {
      // await updateSelectedSegment(id);
      // await fetchSegmentsOptions();
      setOriginalSegmentsFilters(await fetchSegmentDetails(id));
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setAnchorEl(null);
      setSelectLoading(false);
    }
  };

  const onClickToClearFilter = async () => {
    clearSegmentsFiltersGroup();
    await updateSelectedSegment(-1);
    clearSegmentSelectState();
  };

  useEffect(() => {
    return () => {
      onClickToClearFilter();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={1.5} width={'100%'}>
      <Stack flexDirection={'row'} gap={3}>
        <StyledButton
          disabled={selectedSegmentId !== -1 && selectedSegmentId !== ''}
          onClick={() => {
            createSegmentsFiltersGroup();
            open();
            setToolBarType(ToolBarTypeEnum.new_filter);
          }}
          size={'medium'}
          sx={{ px: '12px !important', py: '8px !important' }}
          variant={'outlined'}
        >
          <Icon
            component={ICON_FILTER_ADD}
            sx={{ width: 20, height: 20, mr: 0.75, fill: 'currentColor' }}
          />
          <Typography variant={'body2'}>Set filter</Typography>
        </StyledButton>
        <StyledButton
          disabled={loading}
          loading={loading}
          onClick={(e) => {
            if (segmentOptions.length === 0) {
              return;
            }
            setAnchorEl(e.currentTarget);
            setToolBarType(ToolBarTypeEnum.edit_segment);
          }}
          size={'medium'}
          sx={{ px: '12px !important', py: '8px !important', width: 106 }}
          variant={'outlined'}
        >
          <Icon
            component={ICON_LIST}
            sx={{ width: 20, height: 20, mr: 0.75, fill: 'currentColor' }}
          />
          <Typography variant={'body2'}>View list</Typography>
        </StyledButton>
        <Menu
          anchorEl={anchorEl}
          MenuListProps={{
            sx: {
              width: 280,
              borderRadius: 2,
              maxHeight: 500,
            },
          }}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
          slotProps={{
            paper: {
              sx: {
                boxShadow:
                  '0px 10px 10px 0px rgba(17, 52, 227, 0.10), 0px 0px 2px 0px rgba(17, 52, 227, 0.10)',
                borderRadius: 2,
                '& .MuiList-root': {
                  padding: 0,
                },
              },
            },
          }}
          sx={{
            '& .MuiMenu-list': {
              p: 0,
            },
          }}
          transitionDuration={0}
        >
          {segmentOptions.map((item, index) => (
            <MenuItem
              key={`segmentOption-${index}`}
              onClick={async () => {
                await onClickToSelect(item.value);
              }}
              selected={
                parseInt(selectedSegmentId + '') > -1
                  ? selectedSegmentId === item.value
                  : item.isSelect
              }
              sx={{ p: '14px 24px' }}
            >
              {selectedSegmentId === item.value && selectLoading ? (
                <CircularProgress size={20} />
              ) : (
                <Typography
                  component={'div'}
                  sx={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  variant={'body2'}
                >
                  {item.label}
                </Typography>
              )}
            </MenuItem>
          ))}
        </Menu>
        <CommonSegmentsDrawer
          onClose={close}
          open={visible}
          type={headerType}
        />
      </Stack>
      {(!!selectedSegmentId && selectedSegmentId != -1) ||
      (Object.keys(segmentsFilters).length && showFilter) ? (
        <Stack
          alignItems={'center'}
          bgcolor={'background.active'}
          borderRadius={2}
          flexDirection={'row'}
          justifyContent={'space-between'}
          p={2.5}
          width={'100%'}
        >
          {!!selectedSegmentId && selectedSegmentId != -1 ? (
            <Typography color={'text.primary'} variant={'subtitle2'}>
              Lists:{' '}
              {
                segmentOptions?.find((item) => item.value === selectedSegmentId)
                  ?.label
              }
            </Typography>
          ) : (
            <Typography color={'text.primary'} variant={'subtitle2'}>
              Preview of lists ({totalRecordsWithFilter} contacts)
            </Typography>
          )}
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={3}
            justifyContent={'space-between'}
          >
            {(selectedSegmentId === '' || selectedSegmentId === -1) && (
              <StyledButton
                onClick={dialogOpen}
                size={'small'}
                sx={{
                  ...defaultBtnStyle,
                  p: '8px 12px !important',
                }}
              >
                Save as lists
              </StyledButton>
            )}
            <StyledButton
              onClick={open}
              size={'small'}
              sx={defaultBtnStyle}
              variant={'text'}
            >
              Edit lists
            </StyledButton>
            <StyledButton
              onClick={onClickToClearFilter}
              size={'small'}
              sx={defaultBtnStyle}
              variant={'text'}
            >
              Clear
            </StyledButton>
          </Stack>
        </Stack>
      ) : null}
      <SaveSegmentDialog
        onClose={dialogClose}
        open={dialogShow}
        segmentType={headerType}
      />
    </Stack>
  );
};
