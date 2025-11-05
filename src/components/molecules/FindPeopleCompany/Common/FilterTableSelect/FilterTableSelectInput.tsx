import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import ICON_FOLDER from './assets/icon-folder.svg';
import ICON_CLOSE from './assets/icon-close.svg';
import ICON_MORE from './assets/icon-more.svg';

import {
  closeIconSx,
  CONSTANTS,
  folderIconSx,
  hoverableIconSx,
  inputContainerSx,
  moreButtonSx,
  placeholderTextSx,
} from './FilterTableSelect.styles';

interface FilterTableSelectInputProps {
  selectedTableName: string;
  onOpenDialog: () => void;
  onClearSelection: () => void;
}

export const FilterTableSelectInput: FC<FilterTableSelectInputProps> = ({
  selectedTableName,
  onOpenDialog,
  onClearSelection,
}) => {
  return (
    <Stack flexDirection={'row'} gap={1.5}>
      <Stack sx={inputContainerSx}>
        <Icon component={ICON_FOLDER} sx={folderIconSx} />
        <Typography onClick={onOpenDialog} sx={placeholderTextSx}>
          {selectedTableName || CONSTANTS.PLACEHOLDER_TEXT}
        </Typography>
        <Stack flexDirection={'row'} gap={1.5} ml={'auto'}>
          <Icon
            component={ICON_FOLDER}
            onClick={onOpenDialog}
            sx={hoverableIconSx}
          />
          <Icon
            component={ICON_CLOSE}
            onClick={onClearSelection}
            sx={closeIconSx}
          />
        </Stack>
      </Stack>
      {selectedTableName && (
        <Stack sx={moreButtonSx}>
          <Icon component={ICON_MORE} sx={{ width: 16, height: 16 }} />
        </Stack>
      )}
    </Stack>
  );
};
