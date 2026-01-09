import { Stack, StackProps, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

import { DrawersIconConfig } from '../DrawersIconConfig';

import CloseIcon from '@mui/icons-material/Close';

type DialogHeaderProps = {
  handleClose?: () => void;
  title: string | ReactNode;
  handleBack?: () => void;
  titleIcon?: ReactNode;
  showBackButton?: boolean;
} & Omit<StackProps, 'title'>;

export const DialogHeader: FC<DialogHeaderProps> = ({
  handleClose,
  title,
  handleBack,
  titleIcon,
  showBackButton = true,
  ...rest
}) => {
  return (
    <Stack alignItems={'center'} flexDirection={'row'} pt={3} px={3} {...rest}>
      {showBackButton && (
        <DrawersIconConfig.Arrow
          onClick={handleBack}
          sx={{ width: 20, height: 20, mr: 3, cursor: 'pointer' }}
        />
      )}
      {titleIcon && <div style={{ marginRight: 4 }}>{titleIcon}</div>}
      <Typography component={'div'} fontWeight={600}>
        {title}
      </Typography>
      <CloseIcon
        onClick={handleClose}
        sx={{ fontSize: 20, ml: 'auto', cursor: 'pointer' }}
      />
    </Stack>
  );
};
