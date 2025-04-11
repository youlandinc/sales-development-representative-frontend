import { FC, useEffect, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  Icon,
  MenuItem,
  Popover,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { useAsyncFn, useDebounceFn, useSwitch } from '@/hooks';

import {
  ToolBarTypeEnum,
  useContactsStore,
  useContactsToolbarStore,
  useGridStore,
} from '@/stores/ContactsStores';

import {
  SDRToast,
  StyledButton,
  StyledTextFieldSearch,
} from '@/components/atoms';
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
  const router = useRouter();
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
  const [keyword, setKeyword] = useState<string>('');

  const ref = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn((value: string) => {
    setKeyword(value);
  }, 500);

  const showFilter = computedCanSaved();

  const [state, fetchOptions] = useAsyncFn(async () => {
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

  const segmentOptionsByFilter = segmentOptions.filter(
    (item) =>
      keyword === '' ||
      (item.label as string)?.toLowerCase()?.includes(keyword.toLowerCase()),
  );

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
          // disabled={loading}
          // loading={loading}
          onClick={(e) => {
            // if (segmentOptions.length === 0) {
            //   return;
            // }
            setAnchorEl(e.currentTarget);
            setToolBarType(ToolBarTypeEnum.edit_segment);
            fetchOptions();
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
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={() => {
            setAnchorEl(null);
            updateQueryDebounce('');
          }}
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
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transitionDuration={0}
        >
          <Box p={1.5} px={3}>
            <Stack flexDirection={'row'} py={1.5}>
              <StyledTextFieldSearch
                handleClear={() => {
                  ref.current!.value = '';
                  updateQueryDebounce('');
                }}
                inputRef={ref}
                onChange={(e) => {
                  e.stopPropagation();
                  e.stopPropagation();
                  updateQueryDebounce(e.target.value);
                }}
                sx={{ width: 287 }}
                variant={'outlined'}
              />
            </Stack>
            {segmentOptionsByFilter.length ? (
              <Typography color={'text.secondary'} py={1.5} variant={'body2'}>
                Lists saved by you
              </Typography>
            ) : null}
            {state.loading ? (
              <Skeleton animation={'wave'} />
            ) : segmentOptions.length ? (
              segmentOptionsByFilter.length ? (
                segmentOptionsByFilter.map((item, index) => (
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
                    sx={{
                      p: '10px 12px',
                      borderRadius: 2,
                      '&:hover': { bgcolor: 'background.active' },
                    }}
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
                ))
              ) : (
                <Typography color={'text.secondary'} variant={'body3'}>
                  We didn’t find any lists that match your search.
                </Typography>
              )
            ) : (
              <Typography color={'text.secondary'} variant={'body3'}>
                You have not created any lists yet.
              </Typography>
            )}
            <Box
              bgcolor={'#EAE9EF'}
              height={'1px'}
              my={1.5}
              width={'100%'}
            ></Box>
            <Stack flexDirection={'row'} justifyContent={'flex-end'}>
              <StyledButton
                onClick={() => {
                  router.push('/contacts/lists');
                }}
                size={'small'}
                sx={{ fontWeight: 400 }}
                variant={'text'}
              >
                Manage lists
              </StyledButton>
            </Stack>
          </Box>
        </Popover>
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
