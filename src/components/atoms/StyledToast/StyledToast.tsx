import { FC, ReactNode } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { toast, ToastT } from 'sonner';

import { HttpVariantEnum } from '@/types';

import ICON_SUCCESS from './assets/icon_success.svg';
import ICON_ERROR from './assets/icon_error.svg';
import ICON_CLOSE from './assets/icon_close.svg';
import ICON_WARNING from './assets/icon_warning.svg';

// header => message
// variant => type
// message => description

type IStyledToastProps = {
  id: string | number;
  header: ReactNode | (() => ReactNode);
  message?: (() => ReactNode) | ReactNode;
  variant?: HttpVariantEnum;
};

const computedData = (variant?: HttpVariantEnum) => {
  switch (variant) {
    case HttpVariantEnum.success:
      return {
        icon: ICON_SUCCESS,
        color: '#369B7C',
      };
    case HttpVariantEnum.error:
      return { icon: ICON_ERROR, color: '#E26E6E' };
    case HttpVariantEnum.warning:
      return {
        icon: ICON_WARNING,
        color: '#F9A240',
      };
    default:
      return {
        icon: null,
        color: '#160F33',
      };
  }
};

export const StyledToast: FC<IStyledToastProps> = ({
  header,
  variant,
  message,
  id,
}) => {
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
        {computedData(variant).icon && (
          <Icon
            component={computedData(variant).icon}
            sx={{ width: 20, height: 20 }}
          />
        )}
        <Typography
          color={computedData(variant).color}
          component={'div'}
          variant={'subtitle2'}
        >
          {typeof header === 'function' ? header() : header}
        </Typography>
      </Stack>
      {message && (
        <Typography
          color={'#7D7D7F'}
          component={'div'}
          pl={computedData(variant).icon ? 3 : 0}
          variant={'body2'}
        >
          {typeof message === 'function' ? message() : message}
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

type ISDRToastParams = {
  header: ReactNode;
  variant: HttpVariantEnum;
  message: (() => ReactNode) | ReactNode;
  data?: ExternalToast;
};

export const SDRToast = ({
  data: config,
  header,
  variant,
  message,
}: ISDRToastParams) => {
  toast.custom((id) => {
    return (
      <StyledToast
        header={header || message}
        id={id}
        message={header ? message : ''}
        variant={variant}
      />
    );
  }, config);
};
