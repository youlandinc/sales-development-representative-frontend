import { FC, MouseEvent, useEffect, useMemo, useState } from 'react';
import { Icon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'nextjs-toploader/app';
import useSWR from 'swr';

import { useSwitch } from '@/hooks';
import { UFormatDate } from '@/utils';

import { EnrichmentTableItem, HttpError } from '@/types';
import {
  _deleteEnrichmentTable,
  _fetchEnrichmentTableList,
  _renameEnrichmentTable,
} from '@/request';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';
import { CommonPagination } from '@/components/molecules';

import ICON_NO_RESULT from './assets/icon_table_no_result.svg';

import ICON_TABLE_ACTION from './assets/icon_table_action.svg';
import ICON_TABLE_RENAME from './assets/icon_table_rename.svg';
import ICON_TABLE_DELETE from './assets/icon_table_delete.svg';

interface EnrichmentTableProps {
  store: { searchWord: string };
  openDialog: () => void;
}

export const EnrichmentList: FC<EnrichmentTableProps> = ({
  store,
  openDialog,
}) => {
  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [totalElements, setTotalElements] = useState(0);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tableId, setTableId] = useState<string | number>('');
  const [tableName, setTableName] = useState('');

  const columns: GridColDef<EnrichmentTableItem>[] = useMemo(
    () => [
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
              sx={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: 1,
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Typography
                component={'span'}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                variant={'body2'}
              >
                {row.tableName}
              </Typography>
            </Stack>
          );
        },
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
            {UFormatDate(value, 'MMM d, yyyy')}
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
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              sx={{
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center',
              }}
            >
              <Icon
                component={ICON_TABLE_ACTION}
                onClick={(e: MouseEvent) => {
                  setAnchorEl(e.currentTarget as HTMLElement);
                  setTableId(row.tableId);
                  setTableName(row.tableName);
                }}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          );
        },
      },
    ],
    [],
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const {
    open: openDelete,
    close: closeDelete,
    visible: visibleDelete,
  } = useSwitch(false);

  const [isRenaming, setIsRenaming] = useState(false);
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
        const { data } = await _fetchEnrichmentTableList({
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

  const onTableRenameSubmit = async (name: string) => {
    if (!tableId) {
      return;
    }
    setIsRenaming(true);
    try {
      await _renameEnrichmentTable({ tableName: name, tableId });
      setTableId('');
      setTableName('');
      closeRename();
      await mutate();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setIsRenaming(false);
    }
  };

  const onTableDeleteConfirm = async () => {
    if (!tableId) {
      return;
    }
    setIsDeleting(true);
    try {
      await _deleteEnrichmentTable(tableId);
      setTableId('');
      closeDelete();
      await mutate();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Stack sx={{ flex: 1, flexDirection: 'column', overflow: 'auto' }}>
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
        onRowClick={({ row }) => {
          router.push(`/enrichment/${row.tableId}`);
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
              sx={{
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center',
                minHeight: 480,
                width: '100%',
              }}
            >
              <Icon
                component={ICON_NO_RESULT}
                sx={{
                  width: 240,
                  height: 240,
                }}
              />
              <Typography
                sx={{ color: 'text.secondary', mt: 1.5 }}
                variant={'body2'}
              >
                {store.searchWord
                  ? `No results found for ${store.searchWord}`
                  : "You don't have any table yet."}
              </Typography>
              <Typography
                onClick={() => openDialog()}
                sx={{ color: '#6E4EFB', cursor: 'pointer' }}
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
            border: 0,
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
          <Typography sx={{ pb: 0.5 }} variant={'body3'}>
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
          <Typography sx={{ pb: 0.5 }} variant={'body3'}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      <RenameDialog
        initialName={tableName}
        isLoading={isRenaming}
        onClickToClose={() => {
          closeRename();
          setTableId('');
          setTableName('');
        }}
        onClickToSave={(name) => onTableRenameSubmit(name)}
        open={visibleRename}
      />

      <StyledDialog
        content={
          <Typography
            sx={{ color: 'text.secondary', pb: 3, pt: 1.5 }}
            variant={'body2'}
          >
            Are you sure you want to delete this workbook?
          </Typography>
        }
        footer={
          <Stack
            sx={{ flexDirection: 'row', gap: 3, justifyContent: 'flex-end' }}
          >
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
              disabled={isDeleting}
              loading={isDeleting}
              onClick={onTableDeleteConfirm}
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
  onClickToClose: () => void;
  onClickToSave: (name: string) => Promise<void>;
  isLoading: boolean;
}> = ({ open, initialName, onClickToClose, onClickToSave, isLoading }) => {
  const [localName, setLocalName] = useState<string>('');

  useEffect(() => {
    setLocalName(initialName);
  }, [initialName]);

  return (
    <StyledDialog
      content={
        <Stack sx={{ py: 3 }}>
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
        <Stack
          sx={{ flexDirection: 'row', gap: 3, justifyContent: 'flex-end' }}
        >
          <StyledButton
            color={'info'}
            onClick={onClickToClose}
            size={'medium'}
            sx={{ width: 90 }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            disabled={isLoading}
            loading={isLoading}
            onClick={async () => await onClickToSave(localName)}
            size={'medium'}
            sx={{ width: 90 }}
          >
            Save
          </StyledButton>
        </Stack>
      }
      header={'Rename table'}
      onClose={onClickToClose}
      open={open}
    />
  );
};
