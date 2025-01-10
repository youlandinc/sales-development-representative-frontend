import { FC, ReactNode } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { toast, ToastT } from 'sonner';

import ICON_SUCCESS from './assets/icon_success.svg';
import ICON_ERROR from './assets/icon_error.svg';
import { EnumHttpVariantType } from '@/types/enum';

type IStyledToastProps = {
  message: ReactNode;
  description?: (() => ReactNode) | ReactNode;
  type?: EnumHttpVariantType;
};

export const StyledToast: FC<IStyledToastProps> = ({
  message,
  type,
  description,
}) => {
  const computedData = (type?: EnumHttpVariantType) => {
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

  computedData(EnumHttpVariantType.error);

  return (
    <Stack
      bgcolor={'background.white'}
      border={'1px solid hsl(0, 0%, 93%)'}
      borderRadius={3}
      boxShadow={'0 4px 12px #0000001a'}
      gap={'4px'}
      p={2}
      width={350}
    >
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
  type?: EnumHttpVariantType,
  description?: (() => ReactNode) | ReactNode,
  data?: ExternalToast,
) => {
  toast.custom((_id) => {
    return (
      <StyledToast description={description} message={message} type={type} />
    );
  }, data);
};
