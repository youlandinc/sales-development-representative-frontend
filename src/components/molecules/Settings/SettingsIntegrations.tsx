import { FC, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import useSWR from 'swr';
import { useRouter } from 'nextjs-toploader/app';

import { SDRToast, StyledButton } from '@/components/atoms';

import { _fetchHubspotIntegrations } from '@/request';
import { HttpError, UserIntegrationEnum, UserIntegrationItem } from '@/types';

import ICON_HUBSPOT from './assets/icon_hubspot.svg';
import ICON_SALESFORCE from './assets/icon_salesforce.svg';

const INTEGRATIONS_NAME_MAP: {
  [key in UserIntegrationEnum]: { name: string; icon: any };
} = {
  [UserIntegrationEnum.hubspot]: { name: 'HubSpot', icon: ICON_HUBSPOT },
  [UserIntegrationEnum.salesforce]: {
    name: 'Salesforce',
    icon: ICON_SALESFORCE,
  },
};

const DEFAULT_INTEGRATION: UserIntegrationItem[] = [
  {
    provider: UserIntegrationEnum.hubspot,
    oauthUrl: '',
    connected: false,
    websiteUrl: '',
    account: null,
    tenantId: '',
  },
  {
    provider: UserIntegrationEnum.salesforce,
    oauthUrl: '',
    connected: false,
    websiteUrl: '',
    account: null,
    tenantId: '',
  },
];

export const SettingsIntegrations: FC = () => {
  const router = useRouter();
  const [integrations, setIntegrations] =
    useState<UserIntegrationItem[]>(DEFAULT_INTEGRATION);

  const { isLoading } = useSWR(
    'fetch',
    async () => {
      try {
        const { data } = await _fetchHubspotIntegrations();
        setIntegrations(data);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <Stack border={'1px solid #DFDEE6'} borderRadius={4} gap={3} p={3}>
      <Typography component={'div'} lineHeight={1.2} variant={'h6'}>
        Integrations
      </Typography>

      <Stack flexDirection={'row'} gap={3} maxWidth={900} width={'100%'}>
        {integrations.map((integration, index) => (
          <Stack
            alignItems={'center'}
            border={'1px solid #DFDEE6'}
            borderRadius={2}
            flexDirection={'row'}
            key={`${integration.provider}-${index}`}
            p={1.5}
            width={438}
          >
            <Stack alignItems={'center'} flexDirection={'row'} gap={2}>
              <Stack border={'1px solid #DFDEE6'} borderRadius={'50%'} p={0.75}>
                <Icon
                  component={INTEGRATIONS_NAME_MAP[integration.provider]?.icon}
                  sx={{
                    height: 24,
                    width: 24,
                  }}
                />
              </Stack>

              <Typography variant={'subtitle2'}>
                {INTEGRATIONS_NAME_MAP[integration.provider]?.name}
              </Typography>
            </Stack>
            <StyledButton
              color={'info'}
              disabled={isLoading}
              loading={isLoading}
              onClick={() => {
                if (isLoading) {
                  return;
                }
                router.push(
                  integration.connected
                    ? integration.websiteUrl
                    : integration.oauthUrl,
                );
              }}
              size={'medium'}
              sx={{
                ml: 'auto',
                minWidth: 64,
                maxWidth: 220,
              }}
              variant={'outlined'}
            >
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                variant={'body2'}
                width={'fit-content'}
              >
                {integration.connected ? integration.account : 'Add'}
              </Typography>
            </StyledButton>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
