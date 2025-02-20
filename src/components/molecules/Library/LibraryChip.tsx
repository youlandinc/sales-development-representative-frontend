import { FC, SyntheticEvent } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useSwitch } from '@/hooks';

import ICON_DELETE from './assets/icon_delete_x.svg';
import { LibraryChipEditDialog } from '@/components/molecules/Library/LibraryChipEditDialog';
import { ITag } from '@/stores/useLibraryStore';

export type LibraryChipProps = ITag & {
  isDelete?: boolean;
  handleDelete?: (id: number) => Promise<void>;
  handleSave?: (param: ITag) => Promise<void>;
  loading?: boolean;
};

export const LibraryChip: FC<LibraryChipProps> = ({
  id,
  name,
  description,
  isDelete,
  handleDelete,
  handleSave,
  loading,
}) => {
  const { visible: editShow, open: editOpen, close: editClose } = useSwitch();

  return (
    <>
      <Stack
        alignItems={'center'}
        border={'1px solid'}
        borderColor={'border.normal'}
        borderRadius={'8px'}
        flexDirection={'row'}
        gap={1.25}
        justifyContent={'space-between'}
        onClick={(e) => {
          e.stopPropagation();
          editOpen();
        }}
        px={1.5}
        py={'6px'}
        sx={{
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'rgb(243 244 246 )' },
          transition: 'all 0.3s',
        }}
        width={'fit-content'}
      >
        <Typography variant={'body3'}>{name}</Typography>
        {isDelete && (
          <Icon
            component={ICON_DELETE}
            onClick={async (e: SyntheticEvent) => {
              e.stopPropagation();
              await handleDelete?.(id);
            }}
            sx={{ width: 12, height: 12 }}
          />
        )}
      </Stack>
      <LibraryChipEditDialog
        description={description}
        handleSave={handleSave}
        header={name}
        loading={loading}
        name={name}
        onClose={editClose}
        open={editShow}
        uid={id}
      />
    </>
  );
};
