import { FC, ReactNode, useMemo, useState } from 'react';
import {
  Box,
  Icon,
  LinearProgress,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
  useGridApiContext,
} from '@mui/x-data-grid';
import useSWR from 'swr';
import { useRouter } from 'nextjs-toploader/app';

import { useDialogStore } from '@/stores/useDialogStore';

import { UFormatDate, UFormatNumber, UFormatPercent } from '@/utils';
import { useSwitch } from '@/hooks';

import { SDRToast, StyledButton, StyledDialog } from '@/components/atoms';
import { CampaignsStatusBadge, CommonPagination } from '@/components/molecules';

import {
  CampaignStatusEnum,
  CampaignTableItem,
  HttpError,
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
    setLeadsVisible,
    setLeadsCount,
    setChatId,
    setActiveStep,
    setLeadsList,
    setCampaignName,
    setCampaignStatus,
    setSetupPhase,
    setMessageList,
    setCampaignId,
    createChatSSE,
    setMessagingSteps,
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
    const { campaignId, campaignStatus } = row;
    if (!campaignId) {
      return;
    }
    switch (campaignStatus) {
      case CampaignStatusEnum.draft: {
        try {
          const {
            data: {
              campaignName,
              chatId,
              setupPhase,
              campaignStatus,
              data: {
                leadInfo: { counts, leads },
                chatRecord,
                steps,
              },
            },
          } = await _fetchCampaignInfo(campaignId);

          setCampaignId(campaignId);
          setChatId(chatId);
          setLeadsVisible(true);
          setCampaignName(campaignName || 'Untitled Campaign');
          setCampaignStatus(campaignStatus);
          setLeadsList(leads);
          setLeadsCount(counts);
          setActiveStep(ACTIVE_STEP_HASH[setupPhase]);
          await setSetupPhase(setupPhase, false);
          setMessageList(chatRecord);
          await createChatSSE(chatId);
          setMessagingSteps(steps);
          openProcess();
        } catch (err) {
          const { message, variant, header } = err as HttpError;
          SDRToast({ message, variant, header });
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
        slots={{
          pagination: CommonPagination,
          loadingOverlay: SkeletonLoadingOverlay,
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
                You don&#39;t have any Campaigns yet.
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
            borderBottom: '1px solid #E5E5E5',
          },
          '& .MuiDataGrid-cell': {
            border: 0,
          },
          '.MuiDataGrid-columnSeparator': {
            visibility: 'hidden',
          },
          '.MuiDataGrid-row': {
            borderBottom: '1px solid #E5E5E5',
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
        MenuListProps={{
          sx: {
            //width: avatarRef.current?.offsetWidth,
            minWidth: 120,
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
            // Menu item default style
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

function mulberry32(a: number): () => number {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(seed: number, min: number, max: number): () => number {
  const random = mulberry32(seed);
  return () => min + (max - min) * random();
}

const SkeletonCell = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottom: '1px solid #D2D6E1',
}));

function SkeletonLoadingOverlay() {
  const apiRef = useGridApiContext();

  const dimensions = apiRef.current?.getRootDimensions();
  const viewportHeight = dimensions?.viewportInnerSize.height ?? 0;

  const rowHeight = 40;
  const skeletonRowsCount = Math.ceil(viewportHeight / rowHeight);

  const totalWidth = gridColumnsTotalWidthSelector(apiRef);
  const positions = gridColumnPositionsSelector(apiRef);
  const inViewportCount = useMemo(
    () => positions.filter((value) => value <= totalWidth).length,
    [totalWidth, positions],
  );
  const columns = apiRef.current.getVisibleColumns().slice(0, inViewportCount);

  const children = useMemo(() => {
    // reseed random number generator to create stable lines betwen renders
    const random = randomBetween(12345, 25, 75);
    const array: ReactNode[] = [];

    for (let i = 0; i < skeletonRowsCount; i += 1) {
      for (const column of columns) {
        const width = Math.round(random());
        array.push(
          <SkeletonCell
            key={`col-${column.field}-${i}`}
            sx={{ justifyContent: column.align }}
          >
            <Skeleton sx={{ mx: 1 }} width={`${width}%`} />
          </SkeletonCell>,
        );
      }
      array.push(<SkeletonCell key={`fill-${i}`} />);
    }
    return array;
  }, [skeletonRowsCount, columns]);

  const rowsCount = apiRef.current.getRowsCount();

  return rowsCount > 0 ? (
    <LinearProgress />
  ) : (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${columns
          .map(({ computedWidth }) => `${computedWidth}px`)
          .join(' ')} 1fr`,
        gridAutoRows: `${rowHeight}px`,
      }}
    >
      {children}
    </div>
  );
}
