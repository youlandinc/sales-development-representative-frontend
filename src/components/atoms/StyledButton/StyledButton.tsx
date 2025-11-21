import { FC } from 'react';
import { Box, Button, ButtonProps } from '@mui/material';

import { StyledLoading } from '@/components/atoms';

interface StyledButtonPropsWithDisabled extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
}

export type StyledButtonProps<
  T extends StyledButtonPropsWithDisabled = StyledButtonPropsWithDisabled,
> = T &
  (T['loading'] extends undefined
    ? { disabled?: boolean }
    : { disabled?: boolean });

export const StyledButton: FC<StyledButtonProps> = ({
  loading = false,
  loadingText,
  disabled,
  onClick,
  sx,
  variant = 'contained',
  children,
  color = 'primary',
  size = 'large',
  ...rest
}) => {
  return (
    <Button
      color={color}
      disabled={disabled || loading}
      onClick={onClick}
      size={size}
      sx={[
        {
          position: 'relative',
          flexShrink: 0,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.5,
          textTransform: 'none',
          borderRadius: 2,
          minWidth: 'auto',
          maxWidth: 'auto',
          boxShadow: '0px 1px 2px 0px rgba(52, 50, 62, 0.15)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          '&.MuiButton-contained': {
            bgcolor: `${color}.main`,
            '&:hover': {
              bgcolor: `${color}.hover`,
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabled_background',
            },
          },
          '&.MuiButton-outlined': {
            border: '1px solid',
            borderColor: '#DFDEE6',
            color: 'primary.main',
            '&:hover': {
              bgcolor: '#FFFFFF',
              borderColor: '#6F6C7D',
            },
            '&.Mui-disabled': {
              borderColor: 'action.disabled',
              color: '#BABCBE !important',
            },
          },
          '&.MuiButton-text': {
            bgcolor: 'transparent',
            boxShadow: 'none',
            border: '1px solid transparent',
            color: `${color}.main`,
            '&:hover': {
              bgcolor: 'transparent',
              color: `${color}.hover`,
            },
            '&.Mui-disabled': {
              color: '#BABCBE !important',
            },
          },
          '&.MuiButton-outlined.MuiButton-colorInfo, &.MuiButton-textInfo': {
            color: 'text.primary',
          },
          '&.MuiButton-sizeLarge': {
            px: 2.5,
            height: 48,
            fontSize: 16,
          },
          '&.MuiButton-sizeMedium': {
            px: 2,
            height: 40,
            fontSize: 14,
          },
          '&.MuiButton-sizeSmall': {
            px: 1.5,
            height: 32,
            fontSize: 12,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      variant={variant}
      {...rest}
    >
      <Box
        component="span"
        sx={{
          visibility: loading ? 'hidden' : 'visible',
        }}
      >
        {children}
      </Box>

      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loadingText ? loadingText : <StyledLoading size={size} />}
        </Box>
      )}
    </Button>
  );
};
