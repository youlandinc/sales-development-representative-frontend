import { FC } from 'react';
import { Button, ButtonProps } from '@mui/material';

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
      sx={{
        flexShrink: 0,
        fontSize: 16,
        fontWeight: 600,
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
          bgcolor:
            color !== 'primary'
              ? `${color}.main`
              : `${color}.contrastBackground`,
          '&:hover': {
            bgcolor:
              color !== 'primary' ? `${color}.hover` : `${color}.contrastHover`,
          },
          '&.Mui-disabled': {
            bgcolor: 'action.disabled_background',
          },
        },
        '&.MuiButton-outlined': {
          border: '1px solid',
          borderColor:
            color !== 'primary'
              ? `${color}.main`
              : `${color}.contrastBackground`,
          color:
            color !== 'primary'
              ? `${color}.main`
              : `${color}.contrastBackground`,
          '&:hover': {
            bgcolor: `${color}.background`,
            borderColor:
              color !== 'primary' ? `${color}.main` : `${color}.contrastHover`,
          },
          '&.Mui-disabled': {
            borderColor: 'action.disabled',
            color: 'action.disabled',
          },
        },
        '&.MuiButton-text': {
          bgcolor: 'transparent',
          boxShadow: 'none',
          border: '1px solid transparent',
          color:
            color !== 'primary'
              ? `${color}.main`
              : `${color}.contrastBackground`,
          '&:hover': {
            bgcolor: 'transparent',
            color:
              color !== 'primary' ? `${color}.hover` : `${color}.contrastHover`,
          },
          '&.Mui-disabled': {
            color: 'action.disabled',
          },
        },
        '&.MuiButton-outlinedInfo, &.MuiButton-textInfo': {
          color: 'text.primary',
        },
        '&.MuiButton-sizeLarge': {
          px: 2.5,
          height: 48,
          fontSize: 16,
        },
        '&.MuiButton-sizeMedium': {
          px: 2,
          height: 32,
          fontSize: 14,
        },
        '&.MuiButton-sizeSmall': {
          px: 1.5,
          height: 24,
          fontSize: 12,
        },
        ...sx,
      }}
      variant={variant}
      {...rest}
    >
      {loading ? (
        loadingText ? (
          loadingText
        ) : (
          <StyledLoading size={size} />
        )
      ) : (
        children
      )}
    </Button>
  );
};
