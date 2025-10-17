'use client';
import { Icon, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

import { StyledDialog } from '@/components/atoms';
import { CostCoins, DialogHeader } from '@/components/molecules';

import { useWorkEmailStore } from '@/stores/Prospect';

import { DisplayTypeEnum } from '@/types/Prospect';

import ICON_ARROW from '../assets/dialog/icon_arrow_down.svg';

export const DialogAllIntegrations: FC = () => {
  const {
    dialogIntegrationsVisible,
    setDialogIntegrationsVisible,
    allIntegrations,
    setAllIntegrations,
    setSelectedIntegrationToConfig,
    setDisplayType,
  } = useWorkEmailStore();

  return (
    <StyledDialog
      content={
        <Stack gap={1.5} pt={3}>
          {allIntegrations
            .filter((i) => !i.isDefault)
            .map((item, index) => (
              <Stack
                alignItems={'center'}
                borderRadius={'2px'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                key={index}
                onClick={() => {
                  setAllIntegrations([
                    ...allIntegrations,
                    { ...item, isDefault: true },
                  ]);
                  setDisplayType(DisplayTypeEnum.integration);
                  setSelectedIntegrationToConfig(item);
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
                  <Image
                    alt={item.integrationName}
                    height={18}
                    src={item.logoUrl}
                    width={18}
                  />
                  <Typography color={'text.secondary'} variant={'body3'}>
                    {item.integrationName}
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
                  <Typography variant={'body3'}>{item.name}</Typography>
                </Stack>
                <CostCoins
                  border={'1px solid #D0CEDA'}
                  count={'4'}
                  textColor={'text.secondary'}
                />
              </Stack>
            ))}
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
      slotProps={{
        paper: {
          sx: {
            maxWidth: '900px !important',
            width: '100%',
          },
        },
      }}
    />
  );
};
