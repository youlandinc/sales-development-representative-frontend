import { FC, useState } from 'react';
import {
  CircularProgress,
  Icon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { useAsync, useAsyncFn, useSwitch } from '@/hooks';

import {
  useContactsStore,
  useDirectoryToolbarStore,
} from '@/stores/ContactsStores';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';
import { CommonSegmentsDrawer } from '@/components/molecules';

import { ContactsTableTypeEnum, HttpError } from '@/types';
import { _createNewSegment } from '@/request';

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
  } = useDirectoryToolbarStore((state) => state);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectLoading, setSelectLoading] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const { visible, close, open } = useSwitch();
  const {
    visible: dialogShow,
    close: dialogClose,
    open: dialogOpen,
  } = useSwitch();

  useAsync(async () => {
    if (fromOther) {
      return setFromOther(false);
    }
    if (selectedSegmentId && selectedSegmentId == -1) {
      await onClickToSelect(selectedSegmentId);
      return;
    }
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

  const [state, createSegment] = useAsyncFn(async () => {
    const postData = {
      tableId: headerType,
      tableName: '',
      segmentName,
      segmentsFilters: segmentsFilters!,
    };
    try {
      const { data } = await _createNewSegment(postData);
      await fetchSegmentsOptions(headerType);
      setSelectedSegmentId(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      dialogClose();
      setSegmentName('');
    }
  }, [headerType, segmentsFilters, segmentName]);

  console.log(selectedSegmentId, selectedSegmentId !== '');

  return (
    <Stack gap={1.5} width={'100%'}>
      <Stack flexDirection={'row'} gap={3}>
        <StyledButton
          disabled={selectedSegmentId !== -1 && selectedSegmentId !== ''}
          onClick={() => {
            createSegmentsFiltersGroup();
            open();
          }}
          size={'medium'}
          sx={{ px: '12px !important', py: '8px !important' }}
          variant={'outlined'}
        >
          <Icon
            component={ICON_FILTER_ADD}
            sx={{ width: 20, height: 20, mr: 0.75, fill: 'currentColor' }}
          />
          <Typography variant={'body2'}>Add filter</Typography>
        </StyledButton>
        <StyledButton
          disabled={Object.keys(segmentsFilters).length > 0 || selectLoading}
          loading={selectLoading}
          onClick={(e) => {
            if (segmentOptions.length === 0) {
              return;
            }
            setAnchorEl(e.currentTarget);
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
      Object.keys(segmentsFilters).length ? (
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
              Preview of lists (12,332 contacts)
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
              disabled={state.loading || !segmentName}
              loading={state.loading}
              onClick={createSegment}
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
        onClose={dialogClose}
        open={dialogShow}
      />
    </Stack>
  );
};
