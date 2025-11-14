import { FC, useMemo } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useShallow } from 'zustand/shallow';

import { useDialogStore } from '@/stores/useDialogStore';
import { StyledButton } from '@/components/atoms';
import { ProcessCreateTypeEnum } from '@/types';

import { HeaderButtonGroup } from './HeaderButtonGroup';
import { titleTail } from './utils';

import ICON_CLOSE from '../assets/icon_close.svg';

export const HeaderAudience: FC = () => {
  const {
    closeProcessAndReset,
    createCampaign,
    creating,
    campaignId,
    campaignType,
    csvFormData,
    crmFormData,
    aiTableFormData,
  } = useDialogStore(
    useShallow((state) => ({
      closeProcessAndReset: state.closeProcessAndReset,
      createCampaign: state.createCampaign,
      creating: state.creating,
      campaignId: state.campaignId,
      campaignType: state.campaignType,
      csvFormData: state.csvFormData,
      crmFormData: state.crmFormData,
      aiTableFormData: state.aiTableFormData,
    })),
  );

  const isFormValid = useMemo(() => {
    if (!campaignType) {
      return false;
    }

    switch (campaignType) {
      case ProcessCreateTypeEnum.csv:
        return !!(
          csvFormData?.fileInfo?.url &&
          csvFormData?.fileInfo?.fileName &&
          csvFormData?.fileInfo?.originalFileName &&
          csvFormData?.data
        );

      case ProcessCreateTypeEnum.crm:
        return !!(crmFormData?.listId && crmFormData?.provider);

      case ProcessCreateTypeEnum.ai_table:
        return !!aiTableFormData?.tableId;

      default:
        return false;
    }
  }, [campaignType, csvFormData, crmFormData, aiTableFormData]);

  return (
    <Stack gap={1.5} pt={3} px={3}>
      <Stack alignItems={'center'} flexDirection={'row'}>
        <Typography variant={'h5'}>
          Start new campaign -{' '}
          <Typography color={'#6F6C7D'} component={'span'} variant={'h5'}>
            {titleTail(campaignType)}
          </Typography>
        </Typography>
        <Icon
          component={ICON_CLOSE}
          onClick={closeProcessAndReset}
          sx={{ ml: 'auto', cursor: 'pointer' }}
        />
      </Stack>

      <Stack flexDirection={'row'}>
        <HeaderButtonGroup />
        {!campaignId && (
          <StyledButton
            disabled={creating || !isFormValid}
            loading={creating}
            onClick={async () => await createCampaign()}
            size={'medium'}
            sx={{ ml: 'auto', width: 180 }}
          >
            Continue to Messaging
          </StyledButton>
        )}
      </Stack>
    </Stack>
  );
};
