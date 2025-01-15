import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import ICON_LEADS_SOURCED from './assets/icon_leads_sourced.svg';
import ICON_ACTIVE_LEADS from './assets/icon_active_leads.svg';
import ICON_OPEN_RATE from './assets/icon_open_rate.svg';
import ICON_REPLY_RATE from './assets/icon_reply_rate.svg';
import ICON_MEETINGS_BOOKED from './assets/icon_meetings_booked.svg';

const mock = [
  {
    label: 'Leads sourced',
    icon: ICON_LEADS_SOURCED,
  },
  {
    label: 'Active leads',
    icon: ICON_ACTIVE_LEADS,
  },
  {
    label: 'Open rate',
    icon: ICON_OPEN_RATE,
  },
  {
    label: 'Reply rate',
    icon: ICON_REPLY_RATE,
  },
  {
    label: 'Meetings booked',
    icon: ICON_MEETINGS_BOOKED,
  },
];

export const CampaignsHeader: FC = () => {
  return (
    <Stack gap={3}>
      <Typography variant={'h7'}>Campaigns</Typography>

      <Stack flexDirection={'row'} gap={3}>
        {mock.map((item, index) => (
          <Stack
            border={'1px solid #E5E5E5'}
            borderRadius={2}
            flex={1}
            gap={1.5}
            key={index}
            p={3}
          >
            <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
              <Icon component={item.icon} />
              <Typography pb={0.25} variant={'subtitle1'}>
                {item.label}
              </Typography>
            </Stack>

            <Typography variant={'h4'}>25,898</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
