import { FC, useEffect, useRef, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import useSWR from 'swr';

import { useDialogStore } from '@/stores/useDialogStore';

import { _fetchSavedListLeads } from '@/request';
import { HttpError } from '@/types';

import { SDRToast, StyledSelect } from '@/components/atoms';

import ICON_CHAT_THINKING from './assets/icon_chat_thinking.svg';
import ICON_CHAT_SEARCH from './assets/icon_chat_search.svg';
import ICON_LINKEDIN from './assets/icon_linkedin.svg';
import ICON_EARTH from './assets/icon_earth.svg';
import ICON_CHAT_COMPLETED from './assets/icon_chat_completed.svg';
import ICON_CHAT_LOGO from './assets/icon_chat_logo.svg';

const FAKE_ANIMATE = [
  <Stack flexDirection={'row'} gap={1}>
    <Stack alignItems={'center'} width={20}>
      <Icon component={ICON_CHAT_THINKING} />
      <Stack bgcolor={'#D0CEDA'} flex={1} minHeight={24} mt={1} width={'1px'} />
    </Stack>

    <Stack gap={1.5}>
      <Typography>Thinking:</Typography>
      <Typography>
        We’re reading your CRM list to detect user details—such as names and
        email addresses—then applying advanced enrichment to create more
        comprehensive profiles. By having deeper insights into your audience,
        you’ll be able to personalize your outreach for higher engagement and
        improved success rates.
      </Typography>
    </Stack>
  </Stack>,
  <Stack flexDirection={'row'} gap={1}>
    <Stack alignItems={'center'} width={20}>
      <Icon component={ICON_CHAT_SEARCH} />
      <Stack bgcolor={'#D0CEDA'} flex={1} minHeight={24} mt={1} width={'1px'} />
    </Stack>

    <Stack gap={1.5}>
      <Typography>Spinning up researchers</Typography>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon component={ICON_LINKEDIN} sx={{ width: 16, height: 16 }} />
        <Typography variant={'body3'}>Searching Linkedin</Typography>
      </Stack>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon component={ICON_EARTH} sx={{ width: 16, height: 16 }} />
        <Typography variant={'body3'}>Doing deep internet research</Typography>
      </Stack>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Icon component={ICON_EARTH} sx={{ width: 16, height: 16 }} />
        <Typography variant={'body3'}>Searching Rocketreach</Typography>
      </Stack>
    </Stack>
  </Stack>,
  <Stack flexDirection={'row'} gap={1}>
    <Icon component={ICON_CHAT_COMPLETED} />
    <Typography>Finalizing your results</Typography>
  </Stack>,
];

export const CampaignProcessContentSavedList: FC = () => {
  const {
    leadsVisible,
    setLeadsList,
    setLeadsVisible,
    setLeadsCount,
    leadsCount,
    setLeadsFetchLoading,
    setIsFirst,
    //resetDialogState,
    // crm
    savedListFormData,
    setSavedListFormData,
    savedListOptions,
    fetchSavedListLoading,
  } = useDialogStore();

  const [mode, setMode] = useState<'default' | 'animating' | 'complete'>(
    savedListFormData.listId ? 'complete' : 'default',
  );

  const timerRef = useRef<any>(null);
  const [animateIndex, setAnimateIndex] = useState(0);
  const [animateList, setAnimateList] = useState<any[]>([]);
  const [animateComplete, setAnimateComplete] = useState(false);

  useEffect(() => {
    if (mode !== 'default') {
      if (!animateComplete && mode === 'complete') {
        setAnimateIndex(FAKE_ANIMATE.length - 1);
        clearInterval(timerRef.current);
        setAnimateList([
          ...FAKE_ANIMATE.slice(0, -1),
          <Stack flexDirection={'row'} gap={1}>
            <Icon component={ICON_CHAT_COMPLETED} />
            <Typography>
              Based on the CSV you provided, a total of {leadsCount} records
              were found.
            </Typography>
          </Stack>,
        ]);
        setLeadsFetchLoading(false);
        setAnimateComplete(true);
        return;
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mode === 'complete') {
        return;
      }
      if (animateIndex === FAKE_ANIMATE.length) {
        setMode('complete');
        return;
      }
      timerRef.current = setInterval(() => {
        setAnimateList((prev) => [...prev, FAKE_ANIMATE[animateIndex]]);
        setAnimateIndex((prev) => prev + 1);
      }, 1500);
      return () => clearInterval(timerRef.current);
    }
  }, [animateComplete, animateIndex, leadsCount, mode, setLeadsFetchLoading]);

  const onClickToReSelect = () => {
    // global
    setSavedListFormData({
      listId: '',
      name: '',
    });
    setLeadsList([]);
    setLeadsCount(0);
    // inside
    setMode('default');
    setAnimateList([]);
    setAnimateIndex(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setAnimateComplete(false);
  };

  useSWR(
    savedListFormData?.listId && savedListFormData?.name
      ? savedListFormData
      : null,
    async () => {
      if (!savedListFormData?.listId || !savedListFormData?.name) {
        return;
      }
      if (!leadsVisible) {
        setLeadsVisible(true);
      }
      setIsFirst(false);
      setLeadsFetchLoading(true);
      try {
        const {
          data: { leads, counts },
        } = await _fetchSavedListLeads({
          listId: savedListFormData.listId,
          name: savedListFormData.name,
        });
        setLeadsList(leads);
        setLeadsCount(counts);
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
    <>
      <Fade
        in={['animating', 'complete'].includes(mode)}
        style={{
          display: ['animating', 'complete'].includes(mode) ? 'block' : 'none',
        }}
      >
        <Stack
          display={mode === 'default' ? 'none' : 'flex'}
          gap={3}
          overflow={'auto'}
          width={'100%'}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            flexShrink={0}
            gap={1}
            ml={'auto'}
            px={2}
            py={1}
            width={'fit-content'}
          >
            <Typography sx={{ transition: 'color .3s' }} variant={'body2'}>
              {savedListFormData.name}
            </Typography>

            <Typography
              color={'#5B76BC'}
              onClick={() => onClickToReSelect()}
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              variant={'body2'}
            >
              Try another list
            </Typography>
          </Stack>

          <Stack width={'100%'}>
            <Stack flexDirection={'row'} gap={1}>
              <Icon
                component={ICON_CHAT_LOGO}
                sx={{ width: 32, height: 32, flexShrink: 0 }}
              />
              <Stack
                gap={3}
                sx={{
                  '& > *': {
                    fontSize: 14,
                    color: 'text.secondary',
                  },
                }}
              >
                {animateList.map((item, index) => (
                  <Fade in={true} key={`fake-animate-${index}}`}>
                    {item}
                  </Fade>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Fade>

      <Fade
        in={mode === 'default'}
        style={{
          display: mode === 'default' ? 'block' : 'none',
        }}
      >
        <Stack height={'100%'} width={'100%'}>
          <Typography fontWeight={700} variant={'body2'}>
            Saved list
          </Typography>
          <Stack gap={3} mt={3} px={1.5}>
            <Stack gap={1}>
              <Typography
                color={
                  fetchSavedListLoading ? 'text.secondary' : 'text.primary'
                }
                fontWeight={700}
                variant={'body2'}
              >
                List
              </Typography>
              <StyledSelect
                loading={fetchSavedListLoading}
                onChange={(e) => {
                  const target = savedListOptions.find(
                    (item) => item.value === e.target.value,
                  );
                  if (!target) {
                    return;
                  }
                  setSavedListFormData({
                    listId: target.value,
                    name: target.label,
                  });
                  setMode('animating');
                }}
                options={savedListOptions}
                placeholder={'Select a list'}
                value={savedListFormData?.listId}
              />
            </Stack>
          </Stack>
        </Stack>
      </Fade>
    </>
  );
};
