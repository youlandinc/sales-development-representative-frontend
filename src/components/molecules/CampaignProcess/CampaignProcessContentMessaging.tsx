import {
  Box,
  Icon,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';
import { UFormatNumber } from '@/utils';

import ICON_NEXT from './assets/icon_next.svg';
import ICON_PREV from './assets/icon_prev.svg';
import { CampaignLeadsCard } from '@/components/molecules';
import { useEffect, useState } from 'react';
import { useClassNameObserver } from '@/hooks/useClassNameObserver';
import { _fetchChatLeads } from '@/request';
import { HttpError } from '@/types';
import { SDRToast } from '@/components/atoms';

export const CampaignProcessContentMessaging = () => {
  const {
    leadsCount,
    leadsList,
    leadsVisible,
    setLeadsList,
    setLeadsCount,
    chatId,
    returning,
    setLeadsVisible,
  } = useDialogStore();

  const [leadsFetching, setLeadsFetching] = useState(false);

  const [buttons, setButtons] = useState<HTMLElement[] | null>(null);

  const [activeValue, setActiveValue] = useState(0);

  const [preDisabled, setPreDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    const elements = document.getElementsByClassName(
      'custom-scroll-btn',
    ) as unknown as HTMLElement[];
    setButtons(elements);
  }, [leadsFetching]);

  useClassNameObserver(buttons?.[0], (className) => {
    setPreDisabled(className.includes('Mui-disabled'));
  });
  useClassNameObserver(buttons?.[1], (className) => {
    setNextDisabled(className.includes('Mui-disabled'));
  });

  const fetchLeads = async () => {
    !leadsVisible && setLeadsVisible(true);
    setLeadsFetching(true);
    try {
      const {
        data: { leads, counts },
      } = await _fetchChatLeads(chatId);
      setLeadsList(leads);
      setLeadsCount(counts);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLeadsFetching(false);
    }
  };

  useEffect(
    () => {
      if (!returning) {
        fetchLeads();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [returning],
  );

  return (
    <Stack
      borderLeft={'1px solid #DFDEE6'}
      flex={1}
      gap={3}
      p={3}
      sx={{
        transition: 'all .3s',
      }}
      width={'calc(100% - 510px)'}
    >
      <Stack gap={2} width={'100%'}>
        <Stack alignItems={'center'} flexDirection={'row'}>
          <Typography variant={'subtitle2'}>
            Estimated <b>{UFormatNumber(leadsCount)}</b> leads
          </Typography>

          <Stack flexDirection={'row'} gap={1} ml={'auto'}>
            <Icon
              component={ICON_PREV}
              onClick={() => {
                if (preDisabled || leadsFetching) {
                  return;
                }
                buttons?.[0].click();
              }}
              sx={{
                width: 24,
                height: 24,
                cursor: preDisabled || leadsFetching ? 'default' : 'pointer',
                opacity: preDisabled || leadsFetching ? 0.3 : 1,
                transition: 'opacity .3s',
              }}
            />
            <Icon
              component={ICON_NEXT}
              onClick={() => {
                if (nextDisabled || leadsFetching) {
                  return;
                }
                buttons?.[1].click();
              }}
              sx={{
                width: 24,
                height: 24,
                cursor: nextDisabled || leadsFetching ? 'default' : 'pointer',
                opacity: nextDisabled || leadsFetching ? 0.3 : 1,
                transition: 'opacity .3s',
              }}
            />
          </Stack>
        </Stack>

        <Box maxWidth={'100%'} width={'100%'}>
          <Tabs
            indicatorColor={'primary'}
            scrollButtons
            selectionFollowsFocus={false}
            slotProps={{
              startScrollButtonIcon: {
                sx: { display: 'none' },
              },
              endScrollButtonIcon: {
                sx: { display: 'none' },
              },
            }}
            TabIndicatorProps={{
              sx: {
                display: 'none',
              },
            }}
            TabScrollButtonProps={{
              className: 'custom-scroll-btn',
              sx: {
                display: 'none',
              },
            }}
            value={activeValue}
            variant={'scrollable'}
          >
            {leadsFetching
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Tab
                    key={i}
                    label={
                      <Stack
                        border={'1px solid #E5E5E5'}
                        borderRadius={2}
                        flexDirection={'row'}
                        flexShrink={0}
                        gap={2}
                        height={65}
                        mr={3}
                        p={1.5}
                        width={320}
                      >
                        <Skeleton height={40} variant={'circular'} width={40} />
                        <Stack alignSelf={'center'}>
                          <Skeleton height={20} width={135} />
                          <Skeleton height={20} width={220} />
                        </Stack>
                      </Stack>
                    }
                    sx={{ textTransform: 'none' }}
                  />
                ))
              : leadsList.map((lead, index) => (
                  <Tab
                    key={index}
                    label={
                      <CampaignLeadsCard
                        key={index}
                        {...lead}
                        onClick={() => setActiveValue(index)}
                        sx={{
                          border:
                            activeValue === index
                              ? '1px solid #D5CBFB'
                              : '1px solid #E5E5E5',
                          bgcolor:
                            activeValue === index ? '#F7F4FD' : '#ffffff',
                          borderRadius: 2,
                          width: 320,
                          flexShrink: 0,
                          mr: 3,
                          p: 1.5,
                          cursor: 'pointer',
                        }}
                      />
                    }
                    sx={{ textTransform: 'none' }}
                  />
                ))}
          </Tabs>
        </Box>
      </Stack>

      <Stack>content</Stack>
    </Stack>
  );
};
