import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  ButtonGroup,
  Drawer,
  DrawerProps,
  Fade,
  Icon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import {
  StyledButton,
  StyledSelect,
  StyledTextField,
} from '@/components/atoms';
import {
  useContactsStore,
  useDirectoryToolbarStore,
  useGridStore,
} from '@/stores/ContactsStores';
import { FILTER_OPERATIONS } from '@/constant';
import {
  ContactsTableTypeEnum,
  FilterOperationEnum,
  FilterProps,
} from '@/types';
import ICON_CLOSE from './assets/icon_close.svg';

export enum SegmentsDrawerEnum {
  people = 'people',
  companies = 'companies',
}

type CommonSegmentsDrawerProps = DrawerProps & {
  type?: ContactsTableTypeEnum;
};

const TAG_LABEL = {
  [SegmentsDrawerEnum.people]: 'People',
  [SegmentsDrawerEnum.companies]: 'Companies',
};

const TAG_LABEL_BGCOLOR = {
  [SegmentsDrawerEnum.people]: '#5BCBA9',
  [SegmentsDrawerEnum.companies]: '#F8A84C',
};

const defaultBtnStyle = {
  width: 'fit-content',
  flex: 1,
  height: '40px !important',
  fontSize: '14px !important',
};

const SegmentsCondition = () => {
  const { columnOptions } = useGridStore((state) => state);
  const [condition, setCondition] = useState('');
  const [text, setText] = useState('');
  const [column, setColumn] = useState<TOption | null>(null);

  return (
    <Stack gap={1.5}>
      <Stack
        alignItems={'center'}
        bgcolor={'background.active'}
        flexDirection={'row'}
        gap={1.5}
        p={1.5}
      >
        <Autocomplete
          fullWidth
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            setColumn(value as TOption);
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
          value={column}
        />
        <StyledSelect
          label={'Condition'}
          onChange={(e) => setCondition(e.target.value as string)}
          options={FILTER_OPERATIONS}
          size={'small'}
          value={condition}
        />
        <StyledTextField
          label={'Text'}
          onChange={(e) => setText(e.target.value)}
          size={'small'}
          value={text}
        />
        <Icon
          component={ICON_CLOSE}
          // onClick={async () => {
          //   const result = deleteSegmentsFilters(index, filterIndex);
          //   if (Object.keys(result).length === 0) {
          //     clearSegmentsFiltersGroup();
          //     await updateSelectedSegment(-1);
          //   }
          // }}
          sx={{
            width: 24,
            height: 24,
            flexShrink: 0,
            cursor: 'pointer',
          }}
        />
      </Stack>
      <ButtonGroup>
        <StyledButton color={'info'} size={'small'} variant={'outlined'}>
          And
        </StyledButton>
        <StyledButton color={'info'} size={'small'} variant={'outlined'}>
          Or
        </StyledButton>
      </ButtonGroup>
    </Stack>
  );
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
  } = useDirectoryToolbarStore((state) => state);
  const { updateSelectedSegment, clearSegmentSelectState, selectedSegmentId } =
    useContactsStore((state) => state);
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
  const [showFooter, setShowFooter] = useState(false);

  const handleReviewLists = () => {
    rest?.onClose?.({}, 'backdropClick');
    if (type === ContactsTableTypeEnum.companies) {
      router.push('/contacts/companies');
      return;
    }
    router.push('/contacts/people');
  };

  const handleClose = async () => {
    rest?.onClose?.({}, 'backdropClick');
    clearSegmentsFiltersGroup();
    await updateSelectedSegment(-1);
    clearSegmentSelectState();
  };

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

  useEffect(() => {
    if (rest?.open) {
      fetchAllColumns(type || ContactsTableTypeEnum.people);
    }
  }, [type, rest?.open]);

  console.log(filterGroup);

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
                    <StyledSelect
                      label={'Column'}
                      onChange={(e) => {
                        onChangeSegmentsFilters(
                          index,
                          filterIndex,
                          'columnName',
                          e.target.value as unknown as string | number,
                        );
                      }}
                      options={columnOptions}
                      size={'small'}
                      value={filter.columnName}
                    />
                    <StyledSelect
                      label={'Condition'}
                      onChange={(e) => {
                        onChangeSegmentsFilters(
                          index,
                          filterIndex,
                          'operation',
                          e.target.value as string as FilterOperationEnum,
                        );
                      }}
                      options={FILTER_OPERATIONS}
                      size={'small'}
                      value={filter.operation}
                    />
                    <StyledTextField
                      label={'Text'}
                      onChange={(e) =>
                        onChangeSegmentsFilters(
                          index,
                          filterIndex,
                          'operationText',
                          e.target.value,
                        )
                      }
                      size={'small'}
                      value={filter.operationText}
                    />
                    {index !== 0 && (
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
                          width: 24,
                          height: 24,
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                      />
                    )}
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
                    width: 'fit-content',
                    borderWidth: '1px !important',
                    fontWeight: '400 !important',
                  }}
                  variant={'outlined'}
                >
                  + AND
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
                width: 'fit-content',
                borderWidth: '1px !important',
                fontWeight: '400 !important',
              }}
              variant={'outlined'}
            >
              + OR
            </StyledButton>
          )}

          <Fade in={true}>
            <Stack flexDirection={'row'} gap={6} mt={'auto'}>
              <StyledButton
                color={'info'}
                onClick={handleClose}
                sx={defaultBtnStyle}
                variant={'text'}
              >
                Cancel
              </StyledButton>
              {selectedSegmentId !== '' && selectedSegmentId !== '-1' ? (
                <StyledButton
                  disabled={!showFooter}
                  onClick={handleReviewLists}
                  sx={defaultBtnStyle}
                >
                  Save
                </StyledButton>
              ) : (
                <StyledButton
                  disabled={!showFooter}
                  onClick={handleReviewLists}
                  sx={defaultBtnStyle}
                >
                  Review lists
                </StyledButton>
              )}
            </Stack>
          </Fade>
        </Stack>
      </Stack>
    </Drawer>
  );
};
