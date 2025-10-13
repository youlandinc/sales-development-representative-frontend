import { Icon, Stack, Typography } from '@mui/material';

import { StyledSelect } from '@/components/atoms';
import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailCustomSelect,
  DialogWorkEmailIntegrationColumnMapping,
} from './index';

import { useWorkEmailStore } from '@/stores/Prospect';

import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';

export const DialogWorkEmailIntegrationAccount = () => {
  const { setDisplayType, setWorkEmailVisible } = useWorkEmailStore(
    (store) => store,
  );

  return (
    <Stack>
      <Stack gap={3} pt={3} px={3}>
        <Stack gap={1}>
          <Typography fontWeight={600}>Waterfall output</Typography>
          <Typography variant={'body2'}>
            Choose what to output to your table from this waterfall
          </Typography>
          <DialogWorkEmailCustomSelect />
        </Stack>
        <Stack gap={1}>
          <Typography fontWeight={600}>Action</Typography>
          <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
            <Typography>{'{icon}'}</Typography>
            <Typography color={'text.secondary'} variant={'body3'}>
              {'{integration name}'}
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
            <Typography variant={'body3'}>{'{function name}'}</Typography>
          </Stack>
          <Typography variant={'body3'}>
            Find person&apos;s work email from name and company domain.
          </Typography>
        </Stack>
        <Typography variant={'body3'}>
          We automatically try to map the correct columns for you. If any inputs
          are empty, just select the columns you want to map. Once all inputs
          are filled, you&apos;re ready to save and run!
        </Typography>
        <DialogWorkEmailCollapseCard title={'Account'}>
          <Stack gap={1.5}>
            <Typography>Select LeadMagic account</Typography>
            <StyledSelect options={[]} />
          </Stack>
        </DialogWorkEmailCollapseCard>
        <DialogWorkEmailIntegrationColumnMapping />
      </Stack>
    </Stack>
  );
};
