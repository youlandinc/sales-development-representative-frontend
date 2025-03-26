import { useCallback, useState } from 'react';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useRouter } from 'nextjs-toploader/app';
import { MRT_ColumnDef } from 'material-react-table';
import { format } from 'date-fns';
import useSWR from 'swr';

import { useSwitch } from '@/hooks';

import {
  useContactsStore,
  useContactsToolbarStore,
} from '@/stores/ContactsStores';

import {
  SDRToast,
  StyledButton,
  StyledDialog,
  StyledGrid,
  StyledTextField,
} from '@/components/atoms';
import { GridPagination } from '@/components/molecules';

import { HttpError } from '@/types';
import {
  _deleteExistSegment,
  _fetchSegmentsList,
  _updateExistSegment,
} from '@/request';
import { UFormatNumber } from '@/utils';

export const GridSegments = () => {
  const router = useRouter();

  const { updateSelectedSegment } = useContactsStore((state) => state);
  const { resetToolbarData } = useContactsToolbarStore((state) => state);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });

  const { data, isLoading, mutate } = useSWR(pagination, _fetchSegmentsList, {
    revalidateOnFocus: false,
  });

  const pageCount = data?.data?.page?.totalPages || 0;
  const total = data?.data?.page?.totalElements || 0;

  const onClickToRedirectToDirectory = useCallback(
    async (id: string | number) => {
      await updateSelectedSegment(id);
      router.push('/contacts/directory');
    },
    [router, updateSelectedSegment],
  );

  return (
    <Stack bgcolor={'#fff'} border={'1px solid #ccc'} borderRadius={2}>
      <StyledGrid
        columns={genColumns(mutate, resetToolbarData)}
        data={data?.data?.content || []}
        enableColumnResizing={false}
        getRowId={(row) => row.segmentId}
        loading={isLoading}
        muiTableHeadSx={{
          '& .MuiTableCell-stickyHeader:not(.MuiTableCell-stickyHeader:last-of-type)::after':
            {
              content: "''",
              position: 'absolute',
              right: 0,
              top: 10,
              width: 2,
              bgcolor: '#D2D6E1',
              height: 20,
            },
        }}
        onRowClick={async ({ row }) => {
          const { id } = row;
          await onClickToRedirectToDirectory(id);
        }}
        style={{
          borderBottom: '1px solid #ccc',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      />
      <GridPagination
        currentPage={pagination.page}
        onPageChange={(page) => {
          setPagination({ ...pagination, page });
        }}
        onRowsPerPageChange={(e) => {
          setPagination({ ...pagination, size: parseInt(e.target.value) });
        }}
        pageCount={pageCount}
        rowCount={total}
        rowsPerPage={pagination.size}
      />
    </Stack>
  );
};

const genColumns = (mutate: any, resetToolbarData: () => void) => {
  return [
    {
      accessorKey: 'segmentName',
      header: 'Name',
      grow: true,
      muiTableBodyCellProps: {
        align: 'left',
      },
      muiTableHeadCellProps: {
        align: 'left',
      },
      enableHiding: true,
      Cell: ({ renderedCellValue }) => {
        return (
          <Typography
            fontSize={14}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
          >
            {renderedCellValue}
          </Typography>
        );
      },
    },
    { accessorKey: 'object', header: 'List type' },
    {
      accessorKey: 'Contacts',
      header: 'contacts',
      Cell: ({ renderedCellValue }) => {
        return UFormatNumber(renderedCellValue as number);
      },
    },
    {
      accessorKey: 'lastEdit',
      header: 'Last edit',
      grow: true,
      muiTableBodyCellProps: {
        align: 'left',
      },
      muiTableHeadCellProps: {
        align: 'left',
      },
      enableHiding: true,
      Cell: ({ renderedCellValue }) => {
        return (
          <Typography
            fontSize={14}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
          >
            {format(
              new Date(renderedCellValue as string),
              'LLL d, yyyy, h:m aa',
            )}
          </Typography>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Actions',
      grow: false,
      size: 100,
      muiTableBodyCellProps: {
        align: 'center',
      },
      muiTableHeadCellProps: {
        align: 'center',
      },
      enableHiding: true,
      Cell: ({ row }) => {
        const {
          original: { segmentId },
        } = row;

        const [segmentName, setSegmentName] = useState(
          row.original.segmentName,
        );
        const [deleteLoading, setDeleteLoading] = useState(false);
        const [renameLoading, setRenameLoading] = useState(false);
        const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);

        const {
          open: deleteOpen,
          close: deleteClose,
          visible: deleteVisible,
        } = useSwitch(false);
        const {
          open: renameOpen,
          close: renameClose,
          visible: renameVisible,
        } = useSwitch(false);

        const onClickToRename = useCallback(async () => {
          const postData = {
            segmentId: segmentId,
            segmentName,
          };
          setRenameLoading(true);
          try {
            await _updateExistSegment(postData);
            await mutate();
          } catch (err) {
            const { header, message, variant } = err as HttpError;
            SDRToast({ message, header, variant });
          } finally {
            setRenameLoading(false);
            renameClose();
            resetToolbarData();
          }
        }, [renameClose, segmentId, segmentName]);

        const onClickToDelete = useCallback(async () => {
          if (!segmentId) {
            return;
          }
          setDeleteLoading(true);
          try {
            await _deleteExistSegment(segmentId);
            await mutate();
          } catch (err) {
            const { header, message, variant } = err as HttpError;
            SDRToast({ message, header, variant });
          } finally {
            setDeleteLoading(false);
            deleteClose();
            resetToolbarData();
          }
        }, [deleteClose, segmentId]);

        return (
          <Stack
            alignItems={'center'}
            flex={1}
            height={60}
            justifyContent={'center'}
            mx={-2}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <MoreHoriz
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setAnchorEl(e.currentTarget);
              }}
              sx={{ cursor: 'pointer' }}
            />
            <Menu
              anchorEl={anchorEl}
              MenuListProps={{
                sx: {
                  width: 160,
                  borderRadius: 2,
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
            >
              <MenuItem
                onClick={() => {
                  renameOpen();
                  setAnchorEl(null);
                }}
                sx={{ p: '14px 24px', fontSize: 14 }}
              >
                Rename
              </MenuItem>
              <MenuItem
                onClick={() => {
                  deleteOpen();
                  setAnchorEl(null);
                }}
                sx={{ p: '14px 24px', fontSize: 14 }}
              >
                Delete segment
              </MenuItem>
            </Menu>

            <StyledDialog
              content={
                <Typography color={'text.secondary'} my={1.5} variant={'body2'}>
                  Keep in mind that when you delete a segment, you do not delete
                  the contacts in it.
                </Typography>
              }
              footer={
                <Stack
                  flexDirection={'row'}
                  gap={1.5}
                  justifyContent={'center'}
                >
                  <StyledButton
                    color={'info'}
                    onClick={() => {
                      deleteClose();
                    }}
                    size={'medium'}
                    variant={'outlined'}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    color={'error'}
                    disabled={deleteLoading}
                    loading={deleteLoading}
                    onClick={onClickToDelete}
                    size={'medium'}
                    sx={{
                      width: 72,
                    }}
                  >
                    Delete
                  </StyledButton>
                </Stack>
              }
              header={'Delete a segment'}
              open={deleteVisible}
            />
            <StyledDialog
              content={
                <Stack my={1.5}>
                  <StyledTextField
                    label={'List name'}
                    onChange={(e) => setSegmentName(e.target.value)}
                    value={segmentName}
                  />
                </Stack>
              }
              footer={
                <Stack
                  flexDirection={'row'}
                  gap={1.5}
                  justifyContent={'center'}
                >
                  <StyledButton
                    color={'info'}
                    onClick={() => {
                      renameClose();
                    }}
                    size={'medium'}
                    variant={'outlined'}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    disabled={renameLoading}
                    loading={renameLoading}
                    onClick={onClickToRename}
                    size={'medium'}
                    sx={{ width: 60 }}
                  >
                    Save
                  </StyledButton>
                </Stack>
              }
              header={'Rename list'}
              onClose={renameClose}
              open={renameVisible}
            />
          </Stack>
        );
      },
    },
  ] as MRT_ColumnDef<any>[];
};
