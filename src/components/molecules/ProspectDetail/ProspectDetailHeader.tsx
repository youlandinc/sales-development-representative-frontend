import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { LayoutUserInfo } from '@/components/molecules';

import ICON_BACK from './assets/header/icon-back.svg';
import ICON_ARROW from './assets/header/icon-arrow.svg';
import { useProspectTableStore } from '@/stores/Prospect';

interface ProspectDetailHeaderProps {
  tableId: string;
}

export const ProspectDetailHeader: FC<ProspectDetailHeaderProps> = ({
  tableId,
}) => {
  const { resetTable } = useProspectTableStore((store) => store);

  const router = useRouter();

  return (
    <Stack border={'1px solid'} gap={3} pb={1.5} pt={3} px={4}>
      <Stack alignItems={'center'} flexDirection={'row'} height={32}>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
          <Icon
            component={ICON_BACK}
            onClick={() => {
              resetTable();
              router.push('/prospect-enrich');
            }}
            sx={{ width: 20, height: 20, mt: 0.25, cursor: 'pointer' }}
          />
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            height={'100%'}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Typography fontWeight={600}>name</Typography>
            <Icon component={ICON_ARROW} sx={{ width: 12, height: 12 }} />
          </Stack>
        </Stack>

        <Stack ml={'auto'}>
          <LayoutUserInfo />
        </Stack>
      </Stack>

      <Stack height={32}>
        <Stack>
          <Typography>Default view</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
