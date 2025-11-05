import { SxProps, Theme } from '@mui/material';

// Common constants
const COLORS = {
  border: '#E5E5E5',
  iconDefault: '#6F6C7D',
  iconHover: '#363440',
};

const SIZES = {
  defaultContainer: 32,
  defaultDialog: 600,
};

// Base styles
export const inputContainerSx: SxProps<Theme> = {
  px: 1.5,
  gap: 1.5,
  height: SIZES.defaultContainer,
  borderRadius: 2,
  border: `1px solid ${COLORS.border}`,
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
};

export const iconSx = {
  small: { width: 16, height: 16 },
  medium: { width: 20, height: 20 },
  large: { width: 24, height: 24 },
};

// Common icon styles
const baseIconHoverSx = {
  '&:hover': {
    '& path': {
      fill: COLORS.iconHover,
    },
  },
};

const clickableIconSx = {
  cursor: 'pointer',
  ...baseIconHoverSx,
};

// Icon variations
export const folderIconSx: SxProps<Theme> = {
  ...iconSx.small,
  flexShrink: 0,
};

export const hoverableIconSx: SxProps<Theme> = {
  ...iconSx.small,
  ...clickableIconSx,
};

export const closeIconSx: SxProps<Theme> = {
  ...iconSx.small,
  ...clickableIconSx,
  '& path': {
    fill: COLORS.iconDefault,
  },
};

export const closeIconLargeSx: SxProps<Theme> = {
  ...iconSx.large,
  cursor: 'pointer',
};

export const placeholderTextSx: SxProps<Theme> = {
  fontSize: 12,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  py: 0.5,
  cursor: 'pointer',
};

export const dialogTitleSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 600,
  lineHeight: 1.2,
};

export const moreButtonSx: SxProps<Theme> = {
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  height: SIZES.defaultContainer,
  width: SIZES.defaultContainer,
  borderRadius: 2,
  border: `1px solid ${COLORS.border}`,
};

// Dialog styles
const baseDialogContentSx = {
  height: SIZES.defaultDialog,
  overflow: 'auto' as const,
};

const centeredContentSx = {
  ...baseDialogContentSx,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const dialogStyles = {
  headerSx: { pb: 3 },
  footerSx: { pt: 3 },
  contentSx: baseDialogContentSx,
  loadingContentSx: centeredContentSx,
  emptyContentSx: centeredContentSx,
};

export const selectButtonSx: SxProps<Theme> = {
  width: 104,
};

export const CONSTANTS = {
  PLACEHOLDER_TEXT: 'Select company table',
  DIALOG_TITLE: 'Select table',
  BUTTON_TEXT: 'Select table',
  FILTER_TITLE: 'Company table',
  LOADING_SIZE: 36,
};
