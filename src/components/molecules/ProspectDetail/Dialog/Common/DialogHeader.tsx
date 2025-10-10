import { Icon, Stack, Typography } from '@mui/material';
import { ElementType, FC } from 'react';

import ICON_ARROW from '../../assets/dialog/icon_arrow.svg';
import CloseIcon from '@mui/icons-material/Close';

type DialogHeaderProps = {
  handleClose?: () => void;
  title: string;
  handleBack?: () => void;
  titleIcon?: ElementType;
};

export const DialogHeader: FC<DialogHeaderProps> = ({
  handleClose,
  title,
  handleBack,
  titleIcon,
}) => {
  return (
    <Stack alignItems={'center'} flexDirection={'row'} pt={3} px={3}>
      <Icon
        component={ICON_ARROW}
        onClick={handleBack}
        sx={{ width: 20, height: 20, mr: 3, cursor: 'pointer' }}
      />
      {titleIcon && (
        <Icon component={titleIcon} sx={{ width: 20, height: 20, mr: 0.5 }} />
      )}
      <Typography fontWeight={600}>{title}</Typography>
      <CloseIcon
        onClick={handleClose}
        sx={{ fontSize: 20, ml: 'auto', cursor: 'pointer' }}
      />
    </Stack>
  );
};
