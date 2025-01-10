import { FC, ReactNode } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { toast, ToastT } from 'sonner';

import { HttpVariantEnum } from '@/types';

import ICON_SUCCESS from './assets/icon_success.svg';
import ICON_ERROR from './assets/icon_error.svg';
import ICON_CLOSE from './assets/icon_close.svg';

type IStyledToastProps = {
  id: string | number;
  message: ReactNode;
  description?: (() => ReactNode) | ReactNode;
  type?: HttpVariantEnum;
};

export const StyledToast: FC<IStyledToastProps> = ({
  message,
  type,
  description,
  id,
}) => {
  const computedData = (type?: HttpVariantEnum) => {
    switch (type) {
      case 'success':
        return {
          icon: ICON_SUCCESS,
          color: '#369B7C',
        };
      case 'error':
        return { icon: ICON_ERROR, color: '#E26E6E' };
      default:
        return {
          icon: null,
          color: '#160F33',
        };
    }
  };

  return (
    <Stack
      bgcolor={'background.white'}
      border={'1px solid #E5E5E5'}
      borderRadius={3}
      gap={'4px'}
      p={2}
      position={'relative'}
      sx={{
        '&:hover': {
          '.icon_close': {
            opacity: 1,
          },
        },
      }}
      width={350}
    >
      <Icon
        className={'icon_close'}
        component={ICON_CLOSE}
        onClick={() => toast.dismiss(id)}
        sx={{
          width: 16,
          height: 16,
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          cursor: 'pointer',
          opacity: 0,
          transition: 'opacity .3s',
        }}
      />
      <Stack flexDirection={'row'} gap={'4px'}>
        {computedData(type).icon && (
          <Icon
            component={computedData(type).icon}
            sx={{ width: 20, height: 20 }}
          />
        )}
        <Typography
          color={computedData(type).color}
          component={'div'}
          variant={'subtitle2'}
        >
          {message}
        </Typography>
      </Stack>
      {description && (
        <Typography
          color={'#7D7D7F'}
          component={'div'}
          pl={computedData(type).icon ? 3 : 0}
          variant={'body2'}
        >
          {typeof description === 'function' ? description() : description}
        </Typography>
      )}
    </Stack>
  );
};

type ExternalToast = Omit<
  ToastT,
  'id' | 'type' | 'title' | 'jsx' | 'delete' | 'promise' | 'description'
> & {
  id?: number | string;
};

export const customToast = (
  message: ReactNode,
  type?: HttpVariantEnum,
  description?: (() => ReactNode) | ReactNode,
  data?: ExternalToast,
) => {
  toast.custom((id) => {
    return (
      <StyledToast
        description={description}
        id={id}
        message={message}
        type={type}
      />
    );
  }, data);
};
