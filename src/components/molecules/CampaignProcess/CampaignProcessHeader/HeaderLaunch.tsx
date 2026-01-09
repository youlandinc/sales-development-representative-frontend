import { ChangeEvent, FC, useMemo, useState } from 'react';
import { debounce, Icon, Stack } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';
import { StyledButton } from '@/components/atoms';
import {
  CampaignsStatusBadge,
  CommonRenameTextField,
} from '@/components/molecules';

import { HeaderButtonGroup } from './HeaderButtonGroup';
import { useCampaignLaunch } from './hooks/useCampaignLaunch';

import ICON_BACK from '../assets/icon_back.svg';

export const HeaderLaunch: FC = () => {
  const { campaignName, campaignStatus, closeProcessAndReset, renameCampaign } =
    useDialogStore();

  const [value, setValue] = useState(campaignName);
  const { isLoading, onCampaignLaunchNext } = useCampaignLaunch();

  const debounceSearchWord = useMemo(
    () =>
      debounce(async (value) => {
        await renameCampaign(value);
      }, 500),
    [renameCampaign],
  );

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    await debounceSearchWord(e.target.value);
  };

  return (
    <Stack
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      p={3}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={1}
        height={30}
        my={'auto'}
      >
        <Icon
          component={ICON_BACK}
          onClick={closeProcessAndReset}
          sx={{
            cursor: 'pointer',
            width: 20,
            height: 20,
          }}
        />
        <CommonRenameTextField
          onChange={onChange}
          slotProps={{
            input: {
              onBlur: (e) => {
                if (e.target.value === '') {
                  setValue('Untitled campaign');
                }
              },
            },
          }}
          value={value}
        />
        <CampaignsStatusBadge status={campaignStatus} />
      </Stack>

      <HeaderButtonGroup />

      <StyledButton
        disabled={isLoading}
        loading={isLoading}
        onClick={onCampaignLaunchNext}
        size={'medium'}
        sx={{ width: 180, alignSelf: 'flex-end' }}
      >
        Launch campaign
      </StyledButton>
    </Stack>
  );
};
