import { ChangeEvent, FC, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Collapse,
  debounce,
  Drawer,
  Icon,
  InputAdornment,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';

import { useSwitch } from '@/hooks';
import { UFormatDate } from '@/utils';

import {
  SDRToast,
  StyledButton,
  StyledShadowContent,
  StyledTextField,
} from '@/components/atoms';
import { CommonPagination } from '@/components/molecules';

import { _fetchLeadsInfoByLeadId, _fetchLeadsTableData } from '@/request';
import { HttpError, LeadsInfoCampaignsData, LeadsTableItemData } from '@/types';

import ICON_SEARCH from './assets/icon_search.svg';

import ICON_NO_RESULT from './assets/icon_no_result.svg';

import ICON_AIRPLANE from './assets/icon_airplane.svg';
import ICON_MOUSE from './assets/icon_airplane.svg';
import ICON_DIALOG from './assets/icon_dialog.svg';

import ICON_CLOSE from './assets/icon_close.svg';
import ICON_LINKEDIN from './assets/icon_linkedin.svg';
import ICON_NEXT from './assets/icon_next.svg';
import ICON_COMPANY from './assets/icon_company.svg';
import ICON_PERSON from './assets/icon_person.svg';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export const LeadsTable: FC = () => {
  const [value, setValue] = useState('');
  const [searchWord, setSearchWord] = useState('');

  const debounceSearchWord = useMemo(
    () =>
      debounce((value) => {
        setSearchWord(value);
      }, 500),
    [],
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debounceSearchWord(e.target.value);
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [totalElements, setTotalElements] = useState(0);

  const { data, isLoading } = useSWR(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      searchWord,
    },
    async ({ page, size, searchWord }) => {
      try {
        const { data } = await _fetchLeadsTableData({
          size,
          page,
          searchWord,
        });
        const { page: resPage } = data;
        setTotalElements(resPage.totalElements);
        return data;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
        return 'error';
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  const columns: GridColDef<LeadsTableItemData>[] = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 540,
      renderCell: ({ row }) => {
        const { name, avatar } = row;
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            height={'100%'}
          >
            <Avatar src={avatar} />
            <Typography component={'span'} variant={'body2'}>
              {name}
            </Typography>
          </Stack>
        );
      },
    },
    {
      headerName: 'Job Title',
      field: 'jobTitle',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 240,
      renderCell: ({ value }) => (
        <Tooltip title={value}>
          <Typography component={'span'} variant={'body2'}>
            {value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      headerName: 'Company',
      field: 'company',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 240,
      renderCell: ({ value }) => (
        <Typography component={'span'} variant={'body2'}>
          {value}
        </Typography>
      ),
    },
    {
      headerName: 'Email address',
      field: 'email',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 240,
      renderCell: ({ value }) => (
        <Typography component={'span'} variant={'body2'}>
          {value}
        </Typography>
      ),
    },
    {
      headerName: 'Activities',
      field: 'activities',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 240,
      renderCell: ({ value }) => {
        const { sendEmails, clickEmails, replyEmails } = value;
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1.5}
            height={'100%'}
            justifyContent={'fles-start'}
          >
            <Stack flexDirection={'row'}>
              <Icon component={ICON_AIRPLANE} />
              <Typography component={'span'} variant={'body2'}>
                {sendEmails}
              </Typography>
            </Stack>
            <Stack flexDirection={'row'}>
              <Icon component={ICON_MOUSE} />
              <Typography component={'span'} variant={'body2'}>
                {clickEmails}
              </Typography>
            </Stack>
            <Stack flexDirection={'row'}>
              <Icon component={ICON_DIALOG} />
              <Typography component={'span'} variant={'body2'}>
                {replyEmails}
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    //{
    //  headerName: 'Status',
    //  field: 'status',
    //  sortable: false,
    //  align: 'left',
    //  headerAlign: 'left',
    //  minWidth: 160,
    //  renderCell: ({ row }) => {
    //    return (
    //      <Stack
    //        alignItems={'center'}
    //        flexDirection={'row'}
    //        gap={1}
    //        height={'100%'}
    //      >
    //        <Typography component={'span'} variant={'body2'}></Typography>
    //        <Typography
    //          color={'text.secondary'}
    //          component={'span'}
    //          variant={'body3'}
    //        ></Typography>
    //      </Stack>
    //    );
    //  },
    //},
  ];
  const onRawClick = async (row: LeadsTableItemData) => {
    if (!row.id) {
      return;
    }
    setItemDetails(row);
    setFetchLoading(true);
    openDetails();
    try {
      const {
        data: { campaigns },
      } = await _fetchLeadsInfoByLeadId(row.id);
      setCampaignsData(campaigns);
      setExpendCampaigns(true);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      onClickToClose();
    } finally {
      setFetchLoading(false);
    }
  };

  const {
    open: openDetails,
    close: closeDetails,
    visible: visibleDetails,
  } = useSwitch(false);

  const onClickToClose = () => {
    setItemDetails(undefined);
    setFetchLoading(false);
    setExpendInfo(true);
    setExpendCampaigns(false);
    setActiveInfo('company');
    setCampaignsData([]);
    closeDetails();
  };

  const [itemDetails, setItemDetails] = useState<
    LeadsTableItemData | undefined
  >();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [expendInfo, setExpendInfo] = useState<boolean>(true);
  const [activeInfo, setActiveInfo] = useState<'company' | 'person'>('company');
  const [expendCampaigns, setExpendCampaigns] = useState<boolean>(false);
  const [campaignsData, setCampaignsData] = useState<LeadsInfoCampaignsData[]>(
    [],
  );

  const avatarName = (firstName: string, lastName: string) => {
    const target = (firstName?.[0] ?? '') + (lastName?.[0] ?? '') || '';
    const result = target.match(/[a-zA-Z]+/g);
    return result ? result[0] : '';
  };

  return (
    <Stack gap={1.5} height={'100%'} width={'100%'}>
      <Stack flexDirection={'row'}>
        <Typography fontSize={18} fontWeight={600}>
          Leads
        </Typography>

        <StyledTextField
          onChange={onChange}
          size={'small'}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment
                  position={'start'}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon
                    component={ICON_SEARCH}
                    sx={{ width: 16, height: 16 }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{ ml: 'auto', width: 200 }}
          value={value}
        />
      </Stack>
      <Stack flex={1} overflow={'auto'}>
        <DataGrid
          //checkboxSelection
          //disableMultipleRowSelection
          columnHeaderHeight={60}
          columns={columns}
          disableColumnFilter
          disableColumnMenu
          disableColumnResize
          disableColumnSelector
          disableColumnSorting
          disableDensitySelector
          disableEval
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          loading={isLoading}
          onPaginationModelChange={setPaginationModel}
          onRowClick={async ({ row }) => {
            await onRawClick(row);
          }}
          paginationMode={'server'}
          paginationModel={paginationModel}
          rowCount={totalElements}
          rowHeight={60}
          rows={data?.content || []}
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
          }}
          slots={{
            pagination: CommonPagination,
            noRowsOverlay: () => (
              <Stack
                alignItems={'center'}
                height={'100%'}
                justifyContent={'center'}
                minHeight={480}
                width={'100%'}
              >
                <Icon
                  component={ICON_NO_RESULT}
                  sx={{
                    width: 256,
                    height: 238,
                  }}
                />
              </Stack>
            ),
          }}
          sx={{
            m: '0 auto',
            height: 'auto',
            width: '100%',
            border: 'none !important',
            outline: 'none !important',
            '.MuiDataGrid-main': {
              outline: 'none',
            },
            '.MuiDataGrid-columnHeader': {
              bgcolor: 'transparent',
              fontSize: 12,
              color: '#7D7D7F',
              fontWeight: 400,
              '&.MuiDataGrid-withBorderColor': {
                borderBottom: 'none',
              },
            },
            '.MuiDataGrid-columnHeader:focus-within': {
              outline: 'none !important',
            },
            '.MuiDataGrid-columnHeaders': {
              borderBottom: '1px solid #DFDEE6',
            },
            '& .MuiDataGrid-cell': {
              border: 0,
            },
            '.MuiDataGrid-columnSeparator': {
              visibility: 'hidden',
            },
            '.MuiDataGrid-row': {
              borderBottom: '1px solid #DFDEE6',
            },
            '.MuiDataGrid-cell': {
              overflow: 'hidden !important',
              position: 'relative',
              '&:focus': {
                outline: 0,
              },
            },
            '.MuiDataGrid-filler': {
              display: 'none',
            },
            minWidth: 682,
          }}
        />
      </Stack>

      <Drawer
        anchor={'right'}
        onClose={() => onClickToClose()}
        open={visibleDetails}
      >
        <Stack maxWidth={1362} pb={6} pt={3} px={3} width={'70vw'}>
          <Stack
            flex={1}
            flexDirection={'row'}
            position={'sticky'}
            py={3}
            sx={{ background: 'white', zIndex: 9999 }}
            top={0}
          >
            <Stack flex={1} flexDirection={'row'} gap={2}>
              <Avatar
                src={itemDetails?.avatar || ''}
                sx={{
                  bgcolor: itemDetails?.backgroundColor || '#dedede',
                  width: 40,
                  height: 40,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {avatarName(
                  itemDetails?.leadFirstName ?? '',
                  itemDetails?.leadLastName ?? '',
                )}
              </Avatar>

              <Stack>
                <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                  <Typography
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'fit-content',
                      maxWidth: '100%',
                    }}
                    variant={'subtitle2'}
                  >
                    {itemDetails?.name}
                  </Typography>
                  <Icon
                    component={ICON_LINKEDIN}
                    sx={{ width: 18, height: 18 }}
                  />
                </Stack>

                <Stack
                  color={'text.secondary'}
                  flexDirection={'row'}
                  fontSize={14}
                  gap={0.5}
                >
                  <Typography
                    color={'text.secondary'}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'fit-content',
                      maxWidth: '100%',
                      fontSize: 'inherit',
                    }}
                  >
                    {itemDetails?.jobTitle}
                  </Typography>
                  @
                  <Typography
                    alignSelf={'center'}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: 'inherit',
                    }}
                  >
                    {itemDetails?.company}
                  </Typography>
                </Stack>
              </Stack>

              <Icon
                component={ICON_CLOSE}
                onClick={() => onClickToClose()}
                sx={{ width: 24, height: 24, ml: 'auto', cursor: 'pointer' }}
              />
            </Stack>
          </Stack>

          <Stack
            bgcolor={'#ffffff'}
            border={'1px solid #DFDEE6'}
            borderRadius={4}
            p={2}
          >
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={2}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpendInfo(!expendInfo);
              }}
              sx={{
                cursor: 'pointer',
              }}
            >
              <Icon
                component={ICON_NEXT}
                sx={{
                  width: 18,
                  height: 18,
                  transform: expendInfo ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform .3s',
                  '& path': {
                    fill: '#2A292E',
                  },
                }}
              />

              <StyledButton
                color={'info'}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveInfo('company');
                }}
                size={'small'}
                sx={{
                  color:
                    activeInfo !== 'company'
                      ? '#6F6C7D !important'
                      : '#2A292E !important',
                }}
                variant={activeInfo === 'company' ? 'outlined' : 'text'}
              >
                <Icon
                  component={ICON_COMPANY}
                  sx={{
                    width: 18,
                    height: 18,
                    mr: 0.4,
                    '& path': {
                      fill: activeInfo === 'company' ? '#2A292E' : '#6F6C7D',
                    },
                  }}
                />
                Company research
              </StyledButton>
              <StyledButton
                color={'info'}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveInfo('person');
                }}
                size={'small'}
                sx={{
                  color:
                    activeInfo !== 'person'
                      ? '#6F6C7D !important'
                      : '#2A292E !important',
                }}
                variant={activeInfo === 'person' ? 'outlined' : 'text'}
              >
                <Icon
                  component={ICON_PERSON}
                  sx={{
                    width: 18,
                    height: 18,
                    mr: 0.5,
                    '& path': {
                      fill: activeInfo === 'person' ? '#2A292E' : '#6F6C7D',
                    },
                  }}
                />
                Personal research
              </StyledButton>
            </Stack>

            <Collapse in={expendInfo}>
              <Stack gap={1} mt={2}>
                <Typography variant={'h7'}>Overview</Typography>

                {activeInfo === 'company' ? (
                  <Typography variant={'body2'}>
                    {itemDetails?.companyResearch || 'No data'}
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      fontSize: '14px',
                      padding: '0',
                      '& p': { margin: '0.5em 0' },
                      '& h1, & h2, & h3, & h4, & h5, & h6': {
                        marginTop: '1em',
                        marginBottom: '0.5em',
                      },
                      '& a': { color: '#6E4EFB' },
                    }}
                  >
                    <Markdown rehypePlugins={[rehypeRaw]}>
                      {itemDetails?.personalResearch}
                    </Markdown>
                  </Box>
                )}
              </Stack>
            </Collapse>
          </Stack>

          <Stack
            bgcolor={'#ffffff'}
            border={'1px solid #DFDEE6'}
            borderRadius={4}
            mt={3}
            p={2}
          >
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={2}
              onClick={(e) => {
                if (fetchLoading) {
                  return;
                }
                e.preventDefault();
                e.stopPropagation();
                setExpendCampaigns(!expendCampaigns);
              }}
              sx={{
                cursor: 'pointer',
              }}
            >
              <Icon
                component={ICON_NEXT}
                sx={{
                  width: 18,
                  height: 18,
                  transform: expendCampaigns ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform .3s',
                  '& path': {
                    fill: '#2A292E',
                  },
                }}
              />

              <Typography variant={'body2'}>Campaigns</Typography>
            </Stack>

            <Collapse in={expendCampaigns}>
              <Stack gap={1} mt={2}>
                {campaignsData.map((campaign, index) => (
                  <Stack
                    borderBottom={
                      index !== campaignsData.length - 1
                        ? '1px solid #DFDEE6'
                        : 'unset'
                    }
                    gap={1.5}
                    key={`${campaign.sentOn}-${index}`}
                    p={1.5}
                  >
                    <Stack
                      flexDirection={'row'}
                      fontSize={16}
                      fontWeight={600}
                      gap={0.5}
                    >
                      Step {index + 1}
                      <Typography
                        color={'text.secondary'}
                        ml={'auto'}
                        variant={'body2'}
                      >
                        {UFormatDate(campaign.sentOn, 'MMM dd, yyyy')}
                      </Typography>
                    </Stack>
                    <Typography variant={'subtitle1'}>
                      {campaign.subject}
                    </Typography>
                    <StyledShadowContent html={campaign.content} />
                  </Stack>
                ))}
              </Stack>
            </Collapse>
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
};
