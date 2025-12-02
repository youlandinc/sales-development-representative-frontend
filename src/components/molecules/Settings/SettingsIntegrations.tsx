import { FC, useState } from 'react';
import { CircularProgress, Icon, Stack, Typography } from '@mui/material';
import useSWR from 'swr';
import { useRouter } from 'nextjs-toploader/app';

import { SDRToast } from '@/components/atoms';

import { _fetchHubspotIntegrations } from '@/request';
import { HttpError, UserIntegrationEnum, UserIntegrationItem } from '@/types';

import ICON_HUBSPOT from './assets/icon_hubspot.svg';
import ICON_SALESFORCE from './assets/icon_salesforce.svg';
import ICON_PIPEDRIVE from './assets/icon_pipedrive.svg';
import ICON_LINK from './assets/icon_link.svg';
import ICON_ADD from './assets/icon_add.svg';

const INTEGRATIONS_NAME_MAP: {
  [key in UserIntegrationEnum]: { name: string; icon: any };
} = {
  [UserIntegrationEnum.hubspot]: { name: 'HubSpot', icon: ICON_HUBSPOT },
  [UserIntegrationEnum.salesforce]: {
    name: 'Salesforce',
    icon: ICON_SALESFORCE,
  },
  [UserIntegrationEnum.pipedrive]: {
    name: 'Pipedrive',
    icon: ICON_PIPEDRIVE,
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
  {
    provider: UserIntegrationEnum.pipedrive,
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
      <Stack gap={'4px'}>
        <Typography
          component={'div'}
          fontSize={18}
          lineHeight={1.2}
          variant={'h6'}
        >
          Integrations
        </Typography>
        <Typography
          color={'#6F6C7D'}
          component={'div'}
          fontSize={14}
          fontWeight={400}
          lineHeight={1.2}
          variant={'h6'}
        >
          Import your contacts and segments from connected CRMs into your
          workspace for faster campaign setup.
        </Typography>
      </Stack>

      <Stack
        flexDirection={'row'}
        flexWrap={'wrap'}
        gap={3}
        maxWidth={900}
        width={'100%'}
      >
        {integrations.map((integration, index) => (
          <Stack
            alignItems={'center'}
            border={'1px solid #DFDEE6'}
            borderRadius={1}
            flexDirection={'row'}
            justifyContent={'space-between'}
            key={`${integration.provider}-${index}`}
            p={1.5}
            sx={{
              backgroundColor: integration.connected ? '#fff' : '#F4F5F9',
            }}
            width={438}
          >
            <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
              <Stack border={'1px solid #DFDEE6'} borderRadius={'50%'} p={0.5}>
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
            {isLoading ? (
              <CircularProgress
                size={20}
                sx={{ width: '100%', color: '#E3E3EE' }}
              />
            ) : (
              <Stack
                onClick={() => {
                  router.push(
                    integration.connected
                      ? integration.websiteUrl
                      : integration.oauthUrl,
                  );
                }}
                sx={{
                  cursor: 'pointer',
                }}
              >
                {integration.connected ? (
                  <Stack flexDirection={'row'} gap={'4px'}>
                    <Typography
                      color="#363440"
                      fontSize={14}
                      fontWeight={400}
                      lineHeight={1.5}
                      variant={'body2'}
                    >
                      {integration.account}
                    </Typography>
                    <Icon
                      component={ICON_LINK}
                      sx={{ width: 20, height: 20 }}
                    />
                  </Stack>
                ) : (
                  <Icon component={ICON_ADD} sx={{ width: 20, height: 20 }} />
                )}
              </Stack>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
