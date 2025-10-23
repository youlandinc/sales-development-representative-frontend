import {
  Box,
  Collapse,
  Icon,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import { StyledCost, StyledDialog } from '@/components/atoms';
import { TableColumnMenuEnum } from '@/components/molecules';
import { useSwitch } from '@/hooks';
import { useProspectTableStore } from '@/stores/Prospect';
import { useDialogStore } from '@/stores/useDialogStore';
import { ProcessCreateTypeEnum } from '@/types';
import CloseIcon from '@mui/icons-material/Close';
import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';
import ICON_SPARK from '../../assets/dialog/icon_sparkle_blue.svg';
import { DialogHeaderActionsMenus } from './DialogHeaderActionsMenus';
import { useDialogHeaderActionsHook } from './hooks/useDialogHeaderActionsHook';

export const DialogHeaderActions = () => {
  const { dialogType, closeDialog, dialogVisible } = useProspectTableStore(
    (store) => store,
  );
  const {
    openProcess,
    setCampaignType,
    setEnrichmentTableDisabled,
    setLeadsVisible,
  } = useDialogStore();

  const { ENRICHMENTS_SUGGESTION_MENUS, ENRICHMENTS_AI_MENUS } =
    useDialogHeaderActionsHook();

  const [value, setValue] = useState<'Enrichments' | 'Campaign'>('Enrichments');
  const handleChange = (
    _: SyntheticEvent,
    value: 'Enrichments' | 'Campaign',
  ) => {
    setValue(value);
  };

  const { visible: campaignVisible, toggle: campaignToggle } = useSwitch(true);

  const handleClose = () => {
    closeDialog();
    setValue('Enrichments');
  };

  const handleCampaignClick = () => {
    handleClose();
    setCampaignType(ProcessCreateTypeEnum.ai_table);
    openProcess();
    setEnrichmentTableDisabled(true);
    setLeadsVisible(true);
  };

  return (
    <StyledDialog
      content={
        <Box>
          <Box position={'relative'}>
            <Tabs
              onChange={handleChange}
              slotProps={{
                indicator: {
                  sx: {
                    bgcolor: 'text.default',
                    height: '1px',
                  },
                },
              }}
              sx={{
                minHeight: 0,
                '& .MuiTab-root': {
                  minHeight: 0,
                  textTransform: 'none',
                  p: 1.25,
                  lineHeight: 1.2,
                  '&.Mui-selected': {
                    color: 'text.default',
                  },
                },
                pb: 0,
                px: 3,
                position: 'relative',
                zIndex: 1,
              }}
              value={value}
            >
              <Tab label={'Enrichments'} value={'Enrichments'} />
              <Tab label={'Outreach'} value={'Campaign'} />
            </Tabs>
            <Box
              bgcolor={'#B0ADBD'}
              bottom={0}
              height={'1px'}
              position={'absolute'}
              width={'100%'}
            ></Box>
          </Box>
          <Box p={3}>
            {value === 'Enrichments' ? (
              <Stack gap={1.5}>
                <DialogHeaderActionsMenus
                  children={ENRICHMENTS_SUGGESTION_MENUS.children}
                  icon={ENRICHMENTS_SUGGESTION_MENUS.icon}
                  title={ENRICHMENTS_SUGGESTION_MENUS.title}
                />
                <DialogHeaderActionsMenus
                  children={ENRICHMENTS_AI_MENUS.children}
                  icon={ENRICHMENTS_AI_MENUS.icon}
                  title={ENRICHMENTS_AI_MENUS.title}
                />
              </Stack>
            ) : (
              <Stack gap={1.5}>
                <Stack
                  alignItems={'center'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  onClick={campaignToggle}
                  sx={{
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    gap={0.5}
                    justifyContent={'space-between'}
                  >
                    <Icon
                      component={ICON_SPARK}
                      sx={{ width: 20, height: 20 }}
                    />
                    <Typography lineHeight={1.2} variant={'subtitle2'}>
                      Outreach
                    </Typography>
                  </Stack>
                  <Icon component={ICON_ARROW} sx={{ width: 16, height: 16 }} />
                </Stack>
                <Collapse in={campaignVisible}>
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    onClick={handleCampaignClick}
                    px={1.5}
                    py={0.5}
                    sx={{
                      '&:hover': {
                        bgcolor: '#F7F4FD',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant={'body2'}>Email campaign</Typography>
                    <StyledCost
                      border={'1px solid #D0CEDA'}
                      borderRadius={1}
                      count={'0.5'}
                    />
                  </Stack>
                </Collapse>
              </Stack>
            )}
          </Box>
        </Box>
      }
      contentSx={{
        px: 0,
      }}
      header={
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          pb={3}
        >
          <Typography lineHeight={1.2} variant={'h5'}>
            Actions
          </Typography>
          <CloseIcon
            onClick={handleClose}
            sx={{ fontSize: 20, ml: 'auto', cursor: 'pointer' }}
          />
        </Stack>
      }
      onClose={handleClose}
      open={dialogType === TableColumnMenuEnum.header_actions && dialogVisible}
    />
  );
};
