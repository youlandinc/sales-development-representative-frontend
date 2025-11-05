import { SxProps, Theme } from '@mui/material';

export const inputContainerSx: SxProps<Theme> = {
  px: 1.5,
  gap: 1.5,
  height: 32,
  borderRadius: 2,
  border: '1px solid #E5E5E5',
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
};

export const iconSx = {
  small: { width: 16, height: 16 },
  medium: { width: 20, height: 20 },
  large: { width: 24, height: 24 },
};

export const folderIconSx: SxProps<Theme> = {
  ...iconSx.small,
  flexShrink: 0,
};

export const hoverableIconSx: SxProps<Theme> = {
  ...iconSx.small,
  cursor: 'pointer',
  '&:hover': {
    '& path': {
      fill: '#363440',
    },
  },
};

export const closeIconSx: SxProps<Theme> = {
  ...iconSx.small,
  cursor: 'pointer',
  '& path': {
    fill: '#6F6C7D',
  },
  '&:hover': {
    '& path': {
      fill: '#363440',
    },
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
  height: 32,
  width: 32,
  borderRadius: 2,
  border: '1px solid #E5E5E5',
};

export const dialogStyles = {
  headerSx: { pb: 3 },
  footerSx: { pt: 3 },
  contentSx: {
    height: 600,
    overflow: 'auto',
  },
  loadingContentSx: {
    height: 600,
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
