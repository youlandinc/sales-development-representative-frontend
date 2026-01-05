import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { PanelIcon } from '../PanelIcon';

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
        <PanelIcon.ViewRename
          sx={{
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
        <PanelIcon.ViewDescription
          sx={{
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
        <PanelIcon.ViewDuplicate
          sx={{
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
        <PanelIcon.ViewDelete
          sx={{
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
