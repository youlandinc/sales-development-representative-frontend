import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';

import { StyledDialog } from '@/components/atoms';
import { CostCoins, DialogHeader } from '@/components/molecules';

import { useWorkEmailStore } from '@/stores/Prospect';

import ICON_ARROW from '../assets/dialog/icon_arrow_down.svg';

export const DialogAllIntegrations: FC = () => {
  const { dialogIntegrationsVisible, setDialogIntegrationsVisible } =
    useWorkEmailStore();

  return (
    <StyledDialog
      content={
        <Stack pt={3}>
          <Stack
            alignItems={'center'}
            borderRadius={'2px'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() => {
              setDialogIntegrationsVisible(false);
            }}
            px={1.5}
            py={0.5}
            sx={{
              '&:hover': { backgroundColor: '#F7F4FD' },
              cursor: 'pointer',
            }}
          >
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1}
              justifyContent={'space-between'}
            >
              <Icon component={ICON_ARROW} sx={{ width: 18, height: 18 }} />
              <Typography color={'text.secondary'} variant={'body3'}>
                LeadMagic
              </Typography>
              <Icon
                component={ICON_ARROW}
                sx={{
                  width: 14,
                  height: 14,
                  transform: 'rotate(-90deg)',
                  '& path': { fill: '#6F6C7D' },
                }}
              />
              <Typography variant={'body3'}>Select action</Typography>
            </Stack>
            <CostCoins
              border={'1px solid #D0CEDA'}
              count={'4'}
              textColor={'text.secondary'}
            />
          </Stack>
        </Stack>
      }
      header={
        <DialogHeader
          handleBack={() => {
            setDialogIntegrationsVisible(false);
          }}
          handleClose={() => {
            setDialogIntegrationsVisible(false);
          }}
          sx={{ p: 0 }}
          title={
            <Typography lineHeight={1.2} ml={'-16px'} variant={'h5'}>
              Select action
            </Typography>
          }
        />
      }
      onClose={() => {
        setDialogIntegrationsVisible(false);
      }}
      open={dialogIntegrationsVisible}
    />
  );
};
