import { FC, useEffect, useState } from 'react';
import { Icon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'nextjs-toploader/app';
import useSWR from 'swr';

import { useSwitch } from '@/hooks';
import { UFormatDate, UFormatNumber } from '@/utils';

import { HttpError, ProspectTableItem } from '@/types';
import {
  _deleteProspectTableItem,
  _fetchProspectTableData,
  _renameProspectTable,
} from '@/request';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';
import {
  CommonPagination,
  CommonSkeletonLoadingOverlay,
} from '@/components/molecules';

import ICON_NO_RESULT from './assets/icon_table_no_result.svg';

import ICON_TABLE_ACTION from './assets/icon_table_action.svg';
import ICON_TABLE_RENAME from './assets/icon_table_rename.svg';
import ICON_TABLE_DELETE from './assets/icon_table_delete.svg';

interface ProspectTableProps {
  store: { searchWord: string };
}

export const ProspectTable: FC<ProspectTableProps> = ({ store }) => {
  const router = useRouter();

  const columns: GridColDef<ProspectTableItem>[] = [
    {
      headerName: 'Name',
      field: 'tableName',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      flex: 1,
      minWidth: 780,
      renderCell: ({ row }) => {
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            height={'100%'}
          >
            <Typography component={'span'} variant={'body2'}>
              {row.tableName}
            </Typography>
          </Stack>
        );
      },
    },
    {
      headerName: 'Contacts',
      field: 'contacts',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 120,
      renderCell: ({ value }) => (
        <Typography component={'span'} variant={'body2'}>
          {UFormatNumber(value)}
        </Typography>
      ),
    },
    {
      headerName: 'Last modified',
      field: 'updatedAt',
      sortable: false,
      align: 'left',
      headerAlign: 'left',
      minWidth: 120,
      renderCell: ({ value }) => (
        <Typography component={'span'} variant={'body2'}>
          {UFormatDate(value, 'MMM dd, yyyy')}
        </Typography>
      ),
    },
    {
      headerName: '',
      field: '',
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      minWidth: 80,
      renderCell: ({ row }) => {
        return (
          <Stack
            alignItems={'center'}
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
                setTableId(row.tableId);
                setTableName(row.tableName);
              }}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        );
      },
    },
  ];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [totalElements, setTotalElements] = useState(0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tableId, setTableId] = useState<string | number>('');
  const [tableName, setTableName] = useState('');

  const [deleting, setDeleting] = useState(false);
  const {
    open: openDelete,
    close: closeDelete,
    visible: visibleDelete,
  } = useSwitch(false);

  const [renaming, setRenaming] = useState(false);
  const {
    open: openRename,
    close: closeRename,
    visible: visibleRename,
  } = useSwitch(false);

  const { data, isLoading, mutate } = useSWR(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      searchWord: store.searchWord,
    },
    async ({ page, size, searchWord }) => {
      try {
        const { data } = await _fetchProspectTableData({
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
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  const onClickToRename = async (name: string) => {
    if (!tableId) {
      return;
    }
    setRenaming(true);
    try {
      await _renameProspectTable({ tableName: name, tableId });
      setTableId('');
      setTableName('');
      closeRename();
      await mutate();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setRenaming(false);
    }
  };

  const onClickToDelete = async () => {
    if (!tableId) {
      return;
    }
    setDeleting(true);
    try {
      await _deleteProspectTableItem(tableId);
      setTableId('');
      closeDelete();
      await mutate();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setDeleting(false);
    }
  };

  return (
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
        getRowId={(row) => row.tableId}
        loading={isLoading}
        onPaginationModelChange={setPaginationModel}
        onRowClick={async ({ row }) => {
          //await onRawClick(row);
        }}
        paginationMode={'server'}
        paginationModel={paginationModel}
        rowCount={totalElements}
        rowHeight={40}
        rows={data?.content || []}
        slots={{
          pagination: CommonPagination,
          loadingOverlay: CommonSkeletonLoadingOverlay,
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
                  width: 240,
                  height: 240,
                }}
              />
              <Typography color={'text.secondary'} mt={1.5} variant={'body2'}>
                {store.searchWord
                  ? `No results found for ${store.searchWord}`
                  : "You don't have any table yet."}
              </Typography>
              <Typography
                color={'#6E4EFB'}
                //onClick={() => openProcess()}
                sx={{ cursor: 'pointer' }}
                variant={'body2'}
              >
                Create new table
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
          horizontal: 'center',
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
          list: {
            sx: {
              minWidth: 'fit-content',
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
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={() => {
            openRename();
            setAnchorEl(null);
          }}
          sx={{ alignItems: 'center' }}
        >
          <Icon component={ICON_TABLE_RENAME} sx={{ mr: 1 }} />
          <Typography pb={0.5} variant={'subtitle3'}>
            Rename
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            openDelete();
            setAnchorEl(null);
          }}
          sx={{ alignItems: 'center' }}
        >
          <Icon component={ICON_TABLE_DELETE} sx={{ mr: 1 }} />
          <Typography pb={0.5} variant={'subtitle3'}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      <RenameDialog
        initialName={tableName}
        loading={renaming}
        onClose={() => {
          closeRename();
          setTableId('');
          setTableName('');
        }}
        onSave={(name) => onClickToRename(name)}
        open={visibleRename}
      />

      <StyledDialog
        content={
          <Typography
            color={'text.secondary'}
            pb={3}
            pt={1.5}
            variant={'body2'}
          >
            Are you sure you want to delete this workbook?
          </Typography>
        }
        footer={
          <Stack flexDirection={'row'} gap={3} justifyContent={'flex-end'}>
            <StyledButton
              color={'info'}
              onClick={() => {
                closeDelete();
                setTableId('');
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
        header={`Do you want to delete ${tableName}?`}
        onClose={() => {
          closeDelete();
          setTableId('');
          setTableName('');
        }}
        open={visibleDelete}
      />
    </Stack>
  );
};

const RenameDialog: FC<{
  open: boolean;
  initialName: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  loading: boolean;
}> = ({ open, initialName, onClose, onSave, loading }) => {
  const [localName, setLocalName] = useState<string>('');

  useEffect(() => {
    setLocalName(initialName);
  }, [initialName]);

  return (
    <StyledDialog
      content={
        <Stack py={3}>
          <StyledTextField
            autoFocus
            label={'Table name'}
            onChange={(e) => {
              setLocalName(e.target.value);
            }}
            onFocus={(e) => {
              e.target.select();
            }}
            placeholder={'Table name'}
            value={localName}
          />
        </Stack>
      }
      footer={
        <Stack flexDirection={'row'} gap={3} justifyContent={'flex-end'}>
          <StyledButton
            color={'info'}
            onClick={() => {
              onClose();
            }}
            size={'medium'}
            sx={{ width: 90 }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            disabled={loading}
            loading={loading}
            onClick={async () => await onSave(localName)}
            size={'medium'}
            sx={{ width: 90 }}
          >
            Save
          </StyledButton>
        </Stack>
      }
      header={'Rename table'}
      onClose={() => {
        onClose();
      }}
      open={open}
    />
  );
};
