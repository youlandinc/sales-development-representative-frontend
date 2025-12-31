import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import ICON_RENAME from './assets/icon-rename.svg';
import ICON_DESCRIPTION from './assets/icon-description.svg';
import ICON_DUPLICATE from './assets/icon-duplicate.svg';
import ICON_DELETE from './assets/icon-delete.svg';

export interface ViewActionsProps {
  onRenameView: () => void;
  onEditDescription: () => void;
  onDuplicateView: () => void;
  onDeleteView: () => void;
}

const ACTION_ITEM_SX = {
  gap: 1,
  px: 1.5,
  py: 0.75,
  height: 32,
  alignItems: 'center',
  flexDirection: 'row',
  cursor: 'pointer',
  '&:hover': {
    bgcolor: '#F4F5F9',
  },
};

export const ViewActions: FC<ViewActionsProps> = ({
  onRenameView,
  onEditDescription,
  onDuplicateView,
  onDeleteView,
}) => {
  return (
    <>
      <Stack onClick={onRenameView} sx={ACTION_ITEM_SX}>
        <Icon
          component={ICON_RENAME}
          sx={{
            width: 16,
            height: 16,
            flexShrink: 0,
            '& path': {
              fill: '#363440',
            },
          }}
        />
        <Typography sx={{ fontSize: 14, color: '#363440' }}>
          Rename view
        </Typography>
      </Stack>

      <Stack onClick={onEditDescription} sx={ACTION_ITEM_SX}>
        <Icon
          component={ICON_DESCRIPTION}
          sx={{
            width: 16,
            height: 16,
            flexShrink: 0,
            '& path': {
              fill: '#363440',
            },
          }}
        />
        <Typography sx={{ fontSize: 14, color: '#363440' }}>
          Edit description
        </Typography>
      </Stack>

      <Stack onClick={onDuplicateView} sx={ACTION_ITEM_SX}>
        <Icon
          component={ICON_DUPLICATE}
          sx={{
            width: 16,
            height: 16,
            flexShrink: 0,
            '& path': {
              fill: '#363440',
            },
          }}
        />
        <Typography sx={{ fontSize: 14, color: '#363440' }}>
          Duplicate view
        </Typography>
      </Stack>

      <Stack onClick={onDeleteView} sx={ACTION_ITEM_SX}>
        <Icon
          component={ICON_DELETE}
          sx={{
            width: 16,
            height: 16,
            flexShrink: 0,
            '& path': {
              fill: '#E26E6E',
            },
          }}
        />
        <Typography sx={{ fontSize: 14, color: '#E26E6E' }}>
          Delete view
        </Typography>
      </Stack>
    </>
  );
};
