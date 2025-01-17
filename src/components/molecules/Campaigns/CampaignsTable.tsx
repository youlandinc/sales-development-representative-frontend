import { FC, useState } from 'react';
import { Icon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { UFormatDate, UFormatNumber, UFormatPercent } from '@/utils/UFormater';

import { CampaignsStatusBadge, CommonPagination } from '@/components/molecules';
import { CampaignStatusEnum, CampaignTableItem } from '@/types';

import ICON_TABLE_ACTION from './assets/icon_table_action.svg';
import ICON_TABLE_DELETE from './assets/icon_table_delete.svg';

const generateMockData = (length: number): CampaignTableItem[] => {
  const randomEnumValue = (
    enumObj: typeof CampaignStatusEnum,
  ): CampaignStatusEnum => {
    const values = Object.values(enumObj) as CampaignStatusEnum[];
    return values[Math.floor(Math.random() * values.length)];
  };

  return Array.from({ length }, (_, i) => {
    const sourced = Math.floor(Math.random() * 5000);
    const sent = Math.random() > 0.5 ? Math.floor(Math.random() * 3000) : null;
    const uniqueOpens = Math.floor(Math.random() * 100);
    const uniqueClicks = Math.floor(Math.random() * 100);
    const replied = Math.floor(Math.random() * 50);

    return {
      campaignId: -(i + 1),
      campaignName: `Campaign ${i + 1}: Lock in Low Rates on YouLand Bridge Loans!`,
      campaignStatus: randomEnumValue(CampaignStatusEnum),
      createdAt: new Date(2025, 0, Math.floor(Math.random() * 30) + 1)
        .toISOString()
        .split('T')[0],
      sourced: sourced,
      activeLeads:
        Math.random() > 0.5 ? Math.floor(Math.random() * 5000) : null,
      sent: sent,
      uniqueOpens: uniqueOpens,
      uniqueOpenRate: sent ? parseFloat((uniqueOpens / sent).toFixed(2)) : 0,
      uniqueClicks: uniqueClicks,
      uniqueClickRate: sent ? parseFloat((uniqueClicks / sent).toFixed(2)) : 0,
      replied: replied,
      repliedRate: sent ? parseFloat((replied / sent).toFixed(2)) : 0,
    };
  });
};

const mockData = generateMockData(10000);

export const CampaignsTable: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const onClickToDelete = () => {
    console.log('delete');
  };

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
      renderCell: () => {
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
              }}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        );
      },
    },
  ];

  return (
    <Stack flex={1} flexDirection={'column'} overflow={'auto'}>
      <DataGrid
        columnHeaderHeight={40}
        columns={columns}
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        disableRowSelectionOnClick
        getRowId={(row) => row.campaignId}
        onPaginationModelChange={setPaginationModel}
        onRowClick={(row) => {
          console.log(row);
        }}
        paginationModel={paginationModel}
        rowHeight={40}
        rows={mockData}
        slots={{
          pagination: CommonPagination,
        }}
        sx={{
          m: '0 auto',
          height: 'auto',
          width: '100%',
          border: 'none',
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
        <MenuItem onClick={onClickToDelete} sx={{ alignItems: 'center' }}>
          <Icon component={ICON_TABLE_DELETE} />
          <Typography pb={0.5} variant={'subtitle3'}>
            Delete campaign
          </Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};
