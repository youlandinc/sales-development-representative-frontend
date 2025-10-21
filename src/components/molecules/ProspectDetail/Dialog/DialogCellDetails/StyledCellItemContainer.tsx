import { Stack, StackProps } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { SDRToast } from '@/components/atoms';

import { HttpVariantEnum } from '@/types';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const StyledCellItemContainer: FC<
  PropsWithChildren & StackProps & { showCopy?: boolean; copyContent?: string }
> = ({ children, showCopy = true, copyContent, ...rest }) => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#F8F8FA'}
      border={'1px solid #E5E5E5'}
      borderRadius={2}
      flexDirection={'row'}
      position={'relative'}
      px={1}
      py={0.5}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': {
          borderColor: '#6E4EFB',
          bgcolor: '#F7F4FD',
          '& .icon_copy': {
            display: 'block',
          },
        },
      }}
      {...rest}
    >
      {children}
      {showCopy && (
        <ContentCopyIcon
          className={'icon_copy'}
          onClick={async () => {
            await navigator.clipboard.writeText(copyContent || '');
            SDRToast({
              message: 'Copied to Clipboard',
              header: false,
              variant: 'success' as HttpVariantEnum,
            });
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: 12,
            display: 'none',
          }}
        />
      )}
    </Stack>
  );
};
