import { CSSProperties, FC, ReactNode } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  SxProps,
} from '@mui/material';

export interface StyledDialogProps
  extends Omit<DialogProps, 'maxWidth' | 'content' | 'header' | 'footer'> {
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  headerSx?: SxProps;
  contentSx?: SxProps;
  footerSx?: SxProps;
  paperWidth?: CSSProperties['width'];
}

export const StyledDialog: FC<StyledDialogProps> = ({
  header,
  content,
  footer,
  sx,
  open,
  headerSx,
  contentSx,
  footerSx,
  paperWidth = 600,
  ...rest
}) => {
  const handleSx = (name: string) => {
    switch (name) {
      case 'dialog_header': {
        const defaultSx = {
          px: 3,
          pt: 3,
          fontWeight: 600,
          fontSize: 18,
          color: 'text.primary',
        };
        if (content || footer) {
          return {
            ...defaultSx,
            pb: 0,
          };
        }
        return defaultSx;
      }
      case 'dialog_content': {
        const result = {
          px: 3,
        };
        if (header) {
          Object.assign(result, {
            pt: 0,
          });
        }
        if (footer) {
          Object.assign(result, {
            pb: 0,
          });
        }
        return result;
      }

      case 'dialog_footer': {
        const defaultSx = {
          textAlign: 'right',
          px: 3,
          pt: 3,
          pb: 3,
        };
        if (content || header) {
          return {
            ...defaultSx,
            pt: 0,
          };
        }
        return defaultSx;
      }
    }
  };

  return (
    <Dialog
      closeAfterTransition={true}
      fullWidth={true}
      open={open}
      sx={[
        {
          '&.MuiDialog-root': {
            '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root':
              {},
            '& .MuiDialog-paper': {
              width: rest.fullScreen
                ? '100%'
                : {
                    lg: 'calc(100% - 64px)',
                    xs: 'calc(100% - 48px)',
                  },
              //mx: 3,
            },
            '& .MuiPaper-root': {
              transition: 'all 0.3s ease-in-out',
              borderRadius: rest.fullScreen ? 0 : 4,
              width: rest.fullScreen
                ? '100%'
                : {
                    lg: paperWidth,
                    xs: '100%',
                  },
              maxWidth: rest.fullScreen ? '100%' : paperWidth,
              boxShadow:
                '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
            },
          },
        },
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
      {...rest}
    >
      {header && (
        <DialogTitle
          component={'div'}
          sx={{ ...handleSx('dialog_header'), ...headerSx }}
        >
          {header}
        </DialogTitle>
      )}
      {content && (
        <DialogContent sx={{ ...handleSx('dialog_content'), ...contentSx }}>
          {content}
        </DialogContent>
      )}
      {footer && (
        <DialogActions sx={{ ...handleSx('dialog_footer'), ...footerSx }}>
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
};
