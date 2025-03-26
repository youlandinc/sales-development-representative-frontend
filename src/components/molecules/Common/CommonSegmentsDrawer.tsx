import { FC, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Drawer,
  DrawerProps,
  Fade,
  Icon,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import {
  SDRToast,
  StyledButton,
  StyledSelect,
  StyledTextField,
} from '@/components/atoms';

import {
  ToolBarTypeEnum,
  useContactsStore,
  useContactsToolbarStore,
  useGridStore,
} from '@/stores/ContactsStores';
import { FILTER_OPERATIONS } from '@/constant';
import {
  ContactsTableTypeEnum,
  FilterOperationEnum,
  FilterProps,
} from '@/types';
import { _updateExistSegment } from '@/request';

import ICON_CLOSE from './assets/icon_close.svg';
import ICON_ADD from './assets/icon_add.svg';
import { useSwitch } from '@/hooks';
import { SaveSegmentDialog } from '@/components/molecules';

type CommonSegmentsDrawerProps = DrawerProps & {
  type?: ContactsTableTypeEnum;
};

const defaultBtnStyle = {
  width: 'fit-content',
  flex: 1,
  height: '40px !important',
  fontSize: '14px !important',
};

const defaultSelectStyle = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent !important',
    bgcolor: 'background.active',
    borderRadius: '8px !important',
  },
  '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
    bgcolor: 'background.active',
    borderColor: '#6E4EFB !important',
  },
  '& .Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      bgcolor: 'background.active',
      borderColor: '#6E4EFB !important',
      borderWidth: '1px !important',
      borderRadius: '8px  !important',
    },
  },
  '& .MuiSelect-outlined': { zIndex: 1 },
};

export const CommonSegmentsDrawer: FC<CommonSegmentsDrawerProps> = ({
  type,
  ...rest
}) => {
  const router = useRouter();
  const { columnOptions, fetchAllColumns } = useGridStore((state) => state);
  const {
    segmentsFilters,
    addSegmentsFiltersGroup,
    addSegmentsFilters,
    deleteSegmentsFilters,
    onChangeSegmentsFilters,
    clearSegmentsFiltersGroup,
    setOriginalSegmentsFilters,
    computedCanSaved,
    toolBarType,
  } = useContactsToolbarStore((state) => state);
  const { updateSelectedSegment, selectedSegmentId } = useContactsStore(
    (state) => state,
  );

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

  // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tag, setTag] = useState<ContactsTableTypeEnum>(
    ContactsTableTypeEnum.people,
  );

  const [, setUpdateLoading] = useState(false);
  const {
    visible: dialogShow,
    close: dialogClose,
    open: dialogOpen,
  } = useSwitch();

  const showFooter = computedCanSaved();
  const handleReviewLists = () => {
    rest?.onClose?.({}, 'backdropClick');
    if (!type) {
      if (type === ContactsTableTypeEnum.companies) {
        router.push('/contacts/companies');
        return;
      }
      router.push('/contacts/people');
    } else {
      if (tag === ContactsTableTypeEnum.companies) {
        router.push('/contacts/companies');
        return;
      }
      router.push('/contacts/people');
    }
  };

  const handleClose = async () => {
    rest?.onClose?.({}, 'backdropClick');
    // clearSegmentsFiltersGroup();
    // await updateSelectedSegment(-1);
    // clearSegmentSelectState();
  };

  const onClickToSaveChanges = async () => {
    if (!selectedSegmentId && selectedSegmentId != -1) {
      return;
    }
    if (selectedSegmentId) {
      const postData = {
        segmentId: selectedSegmentId,
        segmentFilters: segmentsFilters,
      };
      setUpdateLoading(true);
      try {
        await _updateExistSegment(postData);
        setOriginalSegmentsFilters(segmentsFilters);
        rest?.onClose?.({}, 'backdropClick');
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  const computedFooter = (type: ToolBarTypeEnum) => {
    switch (type) {
      case ToolBarTypeEnum.new_segment:
        return (
          <>
            <StyledButton
              color={'info'}
              onClick={handleClose}
              sx={defaultBtnStyle}
              variant={'text'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={!showFooter}
              onClick={handleReviewLists}
              sx={defaultBtnStyle}
            >
              Review lists
            </StyledButton>
          </>
        );
      case ToolBarTypeEnum.edit_segment:
        return (
          <>
            <StyledButton
              color={'info'}
              onClick={handleClose}
              sx={defaultBtnStyle}
              variant={'text'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={!showFooter}
              onClick={onClickToSaveChanges}
              sx={defaultBtnStyle}
            >
              Save changes
            </StyledButton>
          </>
        );
      case ToolBarTypeEnum.new_filter:
        return (
          <>
            <StyledButton
              disabled={!showFooter}
              onClick={dialogOpen}
              sx={defaultBtnStyle}
              variant={'outlined'}
            >
              Save as list
            </StyledButton>
            <StyledButton
              disabled={!showFooter}
              onClick={() => rest?.onClose?.({}, 'backdropClick')}
              sx={defaultBtnStyle}
            >
              View filter results
            </StyledButton>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (rest?.open) {
      fetchAllColumns(type || ContactsTableTypeEnum.people);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, rest?.open]);

  return (
    <Drawer anchor={'right'} {...rest}>
      <Stack gap={3} height={'100%'} minWidth={'45vw'} px={3} py={6}>
        <Typography fontWeight={600}> Create a lists</Typography>
        {!type && (
          <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
            <Typography fontWeight={600} variant={'body2'}>
              Create a list of...
            </Typography>
            <StyledSelect
              onChange={(e) => {
                setTag(e.target.value as ContactsTableTypeEnum);
                fetchAllColumns(e.target.value as ContactsTableTypeEnum);
              }}
              options={[
                {
                  label: 'People',
                  value: ContactsTableTypeEnum.people,
                  key: ContactsTableTypeEnum.people + '',
                },
                {
                  label: 'Companies',
                  value: ContactsTableTypeEnum.companies,
                  key: ContactsTableTypeEnum.companies + '',
                },
              ]}
              size={'small'}
              sx={{ '& .MuiSelect-select': { fontSize: 14 }, width: 150 }}
              value={tag}
            />
          </Stack>
        )}
        <Stack flex={1} gap={3}>
          {filterGroup.map((group, index) => (
            <Stack gap={1.5} key={`group-${index}`}>
              {index !== 0 && (
                <Typography color={'#D2D6E1'} variant={'subtitle2'}>
                  OR
                </Typography>
              )}
              <Stack
                border={'1px solid #D2D6E1'}
                borderRadius={2}
                gap={1.5}
                p={1.5}
              >
                {group.map((filter, filterIndex) => (
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    gap={1.5}
                    key={`group-${index}-${filterIndex}`}
                  >
                    <Autocomplete
                      fullWidth
                      getOptionLabel={(option) => option.label}
                      onChange={(_, value) => {
                        onChangeSegmentsFilters(
                          index,
                          filterIndex,
                          'columnName',
                          (value?.value as unknown as string | number) || '',
                        );
                      }}
                      options={columnOptions}
                      renderInput={(params) => (
                        <StyledTextField
                          {...params}
                          placeholder={'Select or search a filter'}
                          slotProps={{
                            input: params.InputProps,
                            htmlInput: params.inputProps,
                          }}
                        />
                      )}
                      size={'small'}
                      sx={{
                        ...defaultSelectStyle,
                        '& .MuiAutocomplete-input': {
                          padding: '0 4px 0 8px !important',
                        },
                      }}
                      value={
                        columnOptions.find(
                          (option) => option.value === filter.columnName,
                        ) || { key: '', label: '', value: '' }
                      }
                    />
                    <StyledSelect
                      displayEmpty
                      onChange={(e) => {
                        onChangeSegmentsFilters(
                          index,
                          filterIndex,
                          'operation',
                          e.target.value as string as FilterOperationEnum,
                        );
                      }}
                      options={FILTER_OPERATIONS}
                      renderValue={(value) => {
                        return value
                          ? FILTER_OPERATIONS.find(
                              (item) => item.value === (value as string),
                            )?.label
                          : 'Condition';
                      }}
                      size={'small'}
                      sx={{
                        ...defaultSelectStyle,
                        '& .MuiSelect-select': {
                          color:
                            filter.operation !== ''
                              ? 'text.default'
                              : '#bdbdbd',
                        },
                      }}
                      value={filter.operation}
                    />
                    <TextField
                      // label={'Text'}
                      onChange={(e) =>
                        onChangeSegmentsFilters(
                          index,
                          filterIndex,
                          'operationText',
                          e.target.value,
                        )
                      }
                      placeholder={'Text'}
                      size={'small'}
                      sx={{
                        ...defaultSelectStyle,
                        '& .MuiInputBase-input': { zIndex: 1 },
                        width: '100%',
                      }}
                      value={filter.operationText}
                    />
                    <Icon
                      component={ICON_CLOSE}
                      onClick={async () => {
                        const result = deleteSegmentsFilters(
                          index,
                          filterIndex,
                        );
                        if (Object.keys(result).length === 0) {
                          clearSegmentsFiltersGroup();
                          await updateSelectedSegment(-1);
                        }
                      }}
                      sx={{
                        width: 16,
                        height: 16,
                        flexShrink: 0,
                        cursor: 'pointer',
                      }}
                    />
                  </Stack>
                ))}

                <StyledButton
                  color={'info'}
                  onClick={() => {
                    addSegmentsFilters(index, {
                      filterId: '',
                      columnName: '',
                      operation: '',
                      operationText: '',
                    });
                  }}
                  size={'small'}
                  sx={{
                    mr: 'auto',
                    borderWidth: '1px !important',
                    fontWeight: '400 !important',
                    color: '#6E4EFB !important',
                    alignItems: 'center',
                    gap: '4px',
                    py: '6px',
                    height: 'auto !important',
                  }}
                  variant={'outlined'}
                >
                  <Icon
                    component={ICON_ADD}
                    sx={{ width: 20, height: 20, color: 'currentColor' }}
                  />
                  And
                </StyledButton>
              </Stack>
            </Stack>
          ))}

          {filterGroup.length > 0 && (
            <StyledButton
              color={'info'}
              onClick={addSegmentsFiltersGroup}
              size={'small'}
              sx={{
                mr: 'auto',
                borderWidth: '1px !important',
                fontWeight: '400 !important',
                color: '#6E4EFB !important',
                alignItems: 'center',
                gap: '4px',
                py: '6px',
                height: 'auto !important',
              }}
              variant={'outlined'}
            >
              <Icon
                component={ICON_ADD}
                sx={{ width: 20, height: 20, color: 'currentColor' }}
              />{' '}
              Or
            </StyledButton>
          )}

          <Fade in={true}>
            <Stack flexDirection={'row'} gap={6} mt={'auto'}>
              {computedFooter(toolBarType)}
            </Stack>
          </Fade>
        </Stack>
      </Stack>
      <SaveSegmentDialog
        onClose={() => {
          dialogClose();
          rest?.onClose?.({}, 'backdropClick');
        }}
        open={dialogShow}
        segmentType={type || tag}
      />
    </Drawer>
  );
};
