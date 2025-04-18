import { FC, Fragment } from 'react';
import { Box, Fade, Icon, Stack, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';

import ICON_DELETE from './assets/icon_grid_delete.svg';
import ICON_EXPORT from './assets/icon_grid_export.svg';
import ICON_CLOSE from './assets/icon_close.svg';

type ExportLoanTypeProps = {
  onClose?: () => void;
  open: boolean;
  handleExport?: () => void;
  exportLoading?: boolean;
  deleteLoading?: boolean;
  disabled?: boolean;
  handleDelete?: () => void;
};

export const GridActionsCard: FC<ExportLoanTypeProps> = ({
  open,
  handleExport,
  handleDelete,
  exportLoading,
  deleteLoading,
  onClose,
}) => {
  const btns = [
    {
      icon: ICON_EXPORT,
      label: 'Export',
      loading: exportLoading,
      onClick: handleExport,
    },
    {
      icon: ICON_DELETE,
      label: 'Delete',
      loading: deleteLoading,
      onClick: handleDelete,
    },
  ];

  return (
    <Fade in={open}>
      <Stack
        alignItems={'center'}
        bgcolor={'primary.main'}
        borderRadius={25}
        bottom={0}
        flexDirection={'row'}
        left={0}
        m={'0 auto'}
        pl={2.5}
        position={'absolute'}
        pr={4}
        py={2}
        right={0}
        width={'fit-content'}
        zIndex={20}
      >
        <Icon
          component={ICON_CLOSE}
          onClick={onClose}
          sx={{
            width: 20,
            height: 20,
            cursor: 'pointer',
            '& path': {
              fill: '#fff',
            },
          }}
        />
        <Stack alignItems={'center'} flexDirection={'row'} gap={3} pl={3}>
          {btns.map((item, index) => (
            <Fragment key={index}>
              <StyledButton
                loading={item.loading}
                onClick={item.onClick}
                sx={{
                  color: 'text.white',
                  p: '0 !important',
                  height: 'fit-content !important',
                  minWidth: 'fit-content !important',
                  width: 'auto',
                  border: 'unset',
                }}
                variant={'text'}
              >
                <Stack alignItems={'center'} gap={'6px'}>
                  <Icon component={item.icon} sx={{ width: 24, height: 24 }} />
                  <Typography color={'background.default'} variant={'body2'}>
                    {item.label}
                  </Typography>
                </Stack>
              </StyledButton>
              {index !== btns.length - 1 && (
                <Box
                  bgcolor={'background.default'}
                  height={25}
                  width={'1px'}
                ></Box>
              )}
            </Fragment>
          ))}
        </Stack>
      </Stack>
    </Fade>
  );
};
