import { FC, useState } from 'react';
import { Icon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'nextjs-toploader/app';
import useSWR from 'swr';

import { useDialogStore } from '@/stores/useDialogStore';

import { UFormatDate, UFormatNumber, UFormatPercent } from '@/utils';
import { useSwitch } from '@/hooks';

import { SDRToast, StyledButton, StyledDialog } from '@/components/atoms';
import { CampaignsStatusBadge, CommonPagination } from '@/components/molecules';

import {
  CampaignStatusEnum,
  CampaignTableItem,
  HttpError,
  ProcessCreateTypeEnum,
  SetupPhaseEnum,
} from '@/types';
import {
  _deleteCampaignTableItem,
  _fetchCampaignInfo,
  _fetchCampaignTableData,
} from '@/request';

import ICON_TABLE_ACTION from './assets/icon_table_action.svg';
import ICON_TABLE_DELETE from './assets/icon_table_delete.svg';
import ICON_NO_RESULT from './assets/icon_no_result.svg';

interface CampaignsTableProps {
  store: { searchWord: string };
}

const ACTIVE_STEP_HASH: {
  [key in SetupPhaseEnum]: number;
} = {
  [SetupPhaseEnum.audience]: 1,
  [SetupPhaseEnum.messaging]: 2,
  [SetupPhaseEnum.launch]: 3,
};

export const CampaignsTable: FC<CampaignsTableProps> = ({ store }) => {
  const router = useRouter();

  const columns: GridColDef<CampaignTableItem>[] = [
    {
      headerName: 'Campaign name',
      field: 'campaignName',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 780,
      renderCell: ({ row }) => {
        const { campaignName, campaignStatus } = row;
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            height={'100%'}
          >
            <Typography component={'span'} variant={'body2'}>
              {campaignName}
            </Typography>
            <CampaignsStatusBadge status={campaignStatus} />
          </Stack>
        );
      },
    },
    {
      headerName: 'Created At',
      field: 'createdAt',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      renderCell: ({ value }) => (
        <Typography component={'span'} variant={'body2'}>
          {UFormatDate(value, 'MMM dd, yyyy')}
        </Typography>
      ),
    },
    {
      headerName: 'Leads sourced',
      field: 'sourced',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      renderCell: ({ value }) => (
        <Typography component={'span'} variant={'body2'}>
          {UFormatNumber(value)}
        </Typography>
      ),
    },
    {
      headerName: 'Active Leads',
      field: 'activeLeads',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      renderCell: ({ value }) => (
        <Typography component={'span'} variant={'body2'}>
          {UFormatNumber(value)}
        </Typography>
      ),
    },
    {
      headerName: 'Emails Sent',
      field: 'sent',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      renderCell: ({ value }) => (
        <Typography component={'span'} variant={'body2'}>
          {UFormatNumber(value)}
        </Typography>
      ),
    },
    {
      headerName: 'Unique opens',
      field: 'uniqueOpens',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      renderCell: ({ row }) => {
        const { uniqueOpens, uniqueOpenRate } = row;
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            height={'100%'}
          >
            <Typography component={'span'} variant={'body2'}>
              {UFormatNumber(uniqueOpens)}
            </Typography>
            <Typography
              color={'text.secondary'}
              component={'span'}
              variant={'body3'}
            >
              {UFormatPercent(uniqueOpenRate)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      headerName: 'Unique clicks',
      field: 'uniqueClicks',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      renderCell: ({ row }) => {
        const { uniqueClicks, uniqueClickRate } = row;
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            height={'100%'}
          >
            <Typography component={'span'} variant={'body2'}>
              {UFormatNumber(uniqueClicks)}
            </Typography>
            <Typography
              color={'text.secondary'}
              component={'span'}
              variant={'body3'}
            >
              {UFormatPercent(uniqueClickRate)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      headerName: 'Replied',
      field: 'replied',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      renderCell: ({ row }) => {
        const { replied, repliedRate } = row;
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            height={'100%'}
          >
            <Typography component={'span'} variant={'body2'}>
              {UFormatNumber(replied)}
            </Typography>
            <Typography
              color={'text.secondary'}
              component={'span'}
              variant={'body3'}
            >
              {UFormatPercent(repliedRate)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      headerName: '',
      field: '',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 160,
      renderCell: ({ row }) => {
        return (
          <Stack
            height={'100%'}
            justifyContent={'center'}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Icon
              component={ICON_TABLE_ACTION}
              onClick={(e: any) => {
                setAnchorEl(e.currentTarget);
                setRowId(row.campaignId);
              }}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        );
      },
    },
  ];

  const {
    openProcess,
    reloadTable,
    setReloadTable,
    setActiveStep,
    setCampaignType,
    setIsFirst,
    setLeadsVisible,
    setLeadsCount,
    setLeadsList,
    setCampaignName,
    setCampaignStatus,
    setCampaignId,
    setSetupPhase,
    setChatId,
    setAiModel,
    // common
    setMessagingSteps,
    setLunchInfo,
    setOfferOptions,
    setDetailsFetchLoading,

    // chat
    createChatSSE,
    setMessageList,
    // filter
    setFilterFormData,
    // csv
    setCSVFormData,
    //crm
    fetchProviderOptions,
    setCRMFormData,
    //saved list
    setSavedListFormData,
    fetchSavedListOptions,
  } = useDialogStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const {
    open: openDelete,
    close: closeDelete,
    visible: visibleDelete,
  } = useSwitch(false);
  const [deleting, setDeleting] = useState(false);
  const [rowId, setRowId] = useState<string | number>(0);

  const [totalElements, setTotalElements] = useState(0);

  const { data, isLoading, mutate } = useSWR(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      searchWord: store.searchWord,
      reloadTable,
    },
    async ({ page, size, searchWord }) => {
      try {
        const { data } = await _fetchCampaignTableData({
          size,
          page,
          searchWord,
        });
        const { page: resPage } = data;
        setTotalElements(resPage.totalElements);
        setReloadTable(false);
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

  const onClickToDelete = async () => {
    if (!rowId) {
      return;
    }
    setDeleting(true);
    try {
      await _deleteCampaignTableItem(rowId);
      setRowId(0);
      closeDelete();
      await mutate();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setDeleting(false);
    }
  };

  const onRawClick = async (row: CampaignTableItem) => {
    const {
      campaignId,
      campaignStatus,
      startingPoint,
      setupPhase,
      campaignName,
    } = row;
    if (!campaignId) {
      return;
    }
    switch (campaignStatus) {
      case CampaignStatusEnum.draft: {
        setDetailsFetchLoading(true);
        setIsFirst(false);
        setCampaignId(campaignId);
        setCampaignType(startingPoint);
        setCampaignStatus(campaignStatus);
        setCampaignName(campaignName || 'Untitled Campaign');
        setActiveStep(ACTIVE_STEP_HASH[setupPhase]);
        await setSetupPhase(setupPhase, false);
        setLeadsVisible(true);
        // pre open
        openProcess();

        try {
          const {
            data: {
              chatId,
              data: {
                leadInfo: { counts, leads },
                aiModel,
                steps,
                launchInfo,
                offerOptions,
                // chat
                chatRecord,
                // filter
                conditions,
                // csv
                fileInfo,
                // crm
                crmInfo,
                // saved list
                savedListInfo,
              },
            },
          } = await _fetchCampaignInfo(campaignId);

          setAiModel(aiModel);
          // chat
          setChatId(chatId);
          // step 1 & 2 leads
          setLeadsList(leads);
          setLeadsCount(counts);
          // step 2
          setOfferOptions(offerOptions);
          setMessagingSteps(steps);
          // step 3 lunch
          setLunchInfo(launchInfo);

          switch (startingPoint) {
            case ProcessCreateTypeEnum.agent:
              setMessageList(chatRecord!);
              await createChatSSE(chatId);
              break;
            case ProcessCreateTypeEnum.filter:
              setFilterFormData(conditions!);
              break;
            case ProcessCreateTypeEnum.csv:
              setCSVFormData(fileInfo!);
              break;
            case ProcessCreateTypeEnum.crm:
              setCRMFormData(crmInfo!);
              await fetchProviderOptions();
              break;
            case ProcessCreateTypeEnum.saved_list:
              setSavedListFormData(savedListInfo!);
              await fetchSavedListOptions();
              break;
          }
        } catch (err) {
          const { message, variant, header } = err as HttpError;
          SDRToast({ message, variant, header });
        } finally {
          setDetailsFetchLoading(false);
        }
        break;
      }
      default: {
        router.push(`/campaigns/report/${campaignId}`);
        break;
      }
    }
  };

  return data === 'error' ? null : (
    <Stack flex={1} flexDirection={'column'} overflow={'auto'}>
      <DataGrid
        columnHeaderHeight={40}
        columns={columns}
        disableColumnFilter
        disableColumnMenu
        disableColumnResize
        disableColumnSelector
        disableColumnSorting
        disableDensitySelector
        disableEval
        disableMultipleRowSelection
        disableRowSelectionOnClick
        getRowId={(row) => row.campaignId}
        loading={isLoading}
        onPaginationModelChange={setPaginationModel}
        onRowClick={async ({ row }) => {
          await onRawClick(row);
        }}
        paginationMode={'server'}
        paginationModel={paginationModel}
        rowCount={totalElements}
        rowHeight={40}
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
              <Typography color={'text.secondary'} mt={1.5} variant={'body2'}>
                You don&#39;t have any campaigns yet.
              </Typography>
              <Typography
                color={'#6E4EFB'}
                onClick={() => openProcess()}
                sx={{ cursor: 'pointer' }}
                variant={'body2'}
              >
                Create new campaign
              </Typography>
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
            '&:hover': {
              cursor: 'pointer',
            },
          },
          '.MuiDataGrid-cell': {
            overflow: 'unset !important',
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

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        slotProps={{
          paper: {
            sx: {
              '& .MuiList-root': {
                padding: 0,
              },
            },
          },
          list: {
            sx: {
              minWidth: 120,
            },
          },
        }}
        sx={{
          '& .MuiMenu-list': {
            p: 0,
            '& .MuiMenuItem-root': {
              bgcolor: 'transparent !important',
            },
            '& .MuiMenuItem-root:hover': {
              bgcolor: 'rgba(144, 149, 163, 0.1) !important',
            },
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            openDelete();
            setAnchorEl(null);
          }}
          sx={{ alignItems: 'center' }}
        >
          <Icon component={ICON_TABLE_DELETE} />
          <Typography pb={0.5} variant={'subtitle3'}>
            Delete campaign
          </Typography>
        </MenuItem>
      </Menu>

      <StyledDialog
        content={
          <Typography
            color={'text.secondary'}
            pb={3}
            pt={1.5}
            variant={'body2'}
          >
            This action cannot be undone, and all data will be permanently
            deleted.
          </Typography>
        }
        footer={
          <Stack flexDirection={'row'} gap={3} justifyContent={'flex-end'}>
            <StyledButton
              color={'info'}
              onClick={() => {
                closeDelete();
                setRowId(0);
              }}
              size={'medium'}
              sx={{ width: 90 }}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              color={'error'}
              disabled={deleting}
              loading={deleting}
              onClick={onClickToDelete}
              size={'medium'}
              sx={{ width: 90 }}
            >
              Delete
            </StyledButton>
          </Stack>
        }
        header={'Do you want to delete this campaign?'}
        onClose={() => {
          closeDelete();
          setRowId(0);
        }}
        open={visibleDelete}
      />
    </Stack>
  );
};
