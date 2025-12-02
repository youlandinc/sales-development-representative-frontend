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
import {
  StyledCollapseMenuContainer,
  StyledIntegrationCost,
  StyledMenu,
} from './base';
import { TableColumnMenuActionEnum } from '@/types/Prospect/table';

import { useSwitch } from '@/hooks';
import { useProspectTableStore } from '@/stores/Prospect';
import { useDialogStore } from '@/stores/useDialogStore';
import { useDialogHeaderActionsHook } from './hooks/useDialogHeaderActionsHook';

import { ProcessCreateTypeEnum } from '@/types';

import CloseIcon from '@mui/icons-material/Close';
import ICON_ARROW from '../../assets/dialog/icon_arrow_down.svg';
import ICON_SPARK from '../../assets/dialog/icon_sparkle.svg';

export const DialogHeaderActions = () => {
  const dialogType = useProspectTableStore((state) => state.dialogType);
  const dialogVisible = useProspectTableStore((state) => state.dialogVisible);
  const closeDialog = useProspectTableStore((state) => state.closeDialog);

  const openProcess = useDialogStore((state) => state.openProcess);
  const setCampaignType = useDialogStore((state) => state.setCampaignType);

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

  const handleCampaignClick = async () => {
    handleClose();
    setCampaignType(ProcessCreateTypeEnum.ai_table);
    await openProcess('FROM_TABLE');
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
                <StyledCollapseMenuContainer
                  icon={ENRICHMENTS_SUGGESTION_MENUS.icon}
                  title={ENRICHMENTS_SUGGESTION_MENUS.title}
                >
                  <Stack gap={1.5}>
                    {ENRICHMENTS_SUGGESTION_MENUS.children.map(
                      (item, index) => (
                        <StyledMenu
                          iconUrl={item.logoUrl}
                          key={index}
                          name={item.name}
                          onClick={item.onClick}
                          slot={
                            <StyledIntegrationCost
                              cost={item.estimatedScore}
                              integrationCost={
                                item.waterfallConfigs.length - 1 || 0
                              }
                              integrationIcon={item.waterfallConfigs[0].logoUrl}
                            />
                          }
                        />
                      ),
                    )}
                  </Stack>
                </StyledCollapseMenuContainer>
                <StyledCollapseMenuContainer
                  icon={ENRICHMENTS_AI_MENUS.icon}
                  title={ENRICHMENTS_AI_MENUS.title}
                >
                  {ENRICHMENTS_AI_MENUS.children.map((item, index) => (
                    <StyledMenu
                      key={index}
                      name={item.title}
                      onClick={item.onClick}
                      slot={
                        <StyledCost
                          border={'1px solid #D0CEDA'}
                          borderRadius={1}
                          count={'0.5'}
                        />
                      }
                    />
                  ))}
                </StyledCollapseMenuContainer>
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
                        bgcolor: '#F4F5F9',
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
      open={
        dialogType === TableColumnMenuActionEnum.header_actions && dialogVisible
      }
    />
  );
};
