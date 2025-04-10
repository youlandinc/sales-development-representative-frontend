import React, { FC, useEffect, useRef, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import useSWR from 'swr';
import { useRouter } from 'nextjs-toploader/app';

import { useDialogStore } from '@/stores/useDialogStore';

import { _fetchCrmLeads, _fetchCrmList } from '@/request';
import { HttpError, UserIntegrationEnum } from '@/types';

import { SDRToast, StyledSelect } from '@/components/atoms';

import ICON_HUBSPOT from './assets/icon_hubspot.svg';

import ICON_CHAT_THINKING from './assets/icon_chat_thinking.svg';

import ICON_EARTH from './assets/icon_earth.svg';
import ICON_LINKEDIN from './assets/icon_linkedin.svg';

import ICON_CHAT_SEARCH from './assets/icon_chat_search.svg';
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

export const CampaignProcessContentCRM: FC = () => {
  const router = useRouter();

  const {
    leadsVisible,
    setLeadsList,
    setLeadsVisible,
    setLeadsCount,
    setCRMFormData,
    crmFormData,
    leadsCount,
    setLeadsFetchLoading,
    setIsFirst,
    resetDialogState,
    providerOptions,
    fetchProviderOptionsLoading,
  } = useDialogStore();

  const [listOptions, setListOptions] = useState<TOption[]>([]);

  const [mode, setMode] = useState<'default' | 'animating' | 'complete'>(
    crmFormData.listId ? 'complete' : 'default',
  );

  const { isLoading } = useSWR(
    crmFormData.provider,
    async () => {
      if (!crmFormData?.provider) {
        return;
      }
      try {
        const { data } = await _fetchCrmList({
          provider: crmFormData?.provider as UserIntegrationEnum,
        });
        const reducedData = data.reduce((acc: TOption[], cur) => {
          acc.push({
            label: cur.name,
            value: cur.listId,
            key: cur.listId,
          });
          return acc;
        }, []);
        setListOptions(reducedData);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
    },
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
    setCRMFormData({
      ...crmFormData,
      listId: '',
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
    crmFormData?.listId && crmFormData?.provider ? crmFormData : null,
    async () => {
      if (!crmFormData?.listId || !crmFormData?.provider) {
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
        } = await _fetchCrmLeads({
          provider: crmFormData.provider,
          listId: crmFormData.listId,
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

  const renderFiledNode = () => {
    return (
      <>
        <Typography fontWeight={700} variant={'body2'}>
          CRM List
        </Typography>
        <Stack gap={3} mt={3} px={1.5}>
          <Stack gap={1}>
            <Typography
              color={
                fetchProviderOptionsLoading ? 'text.secondary' : 'text.primary'
              }
              fontWeight={700}
              variant={'body2'}
            >
              Select a CRM provider
            </Typography>
            <StyledSelect
              loading={fetchProviderOptionsLoading}
              onChange={(e) => {
                setCRMFormData({
                  ...crmFormData,
                  provider: e.target.value as string,
                });
              }}
              options={providerOptions}
              placeholder={'Select a CRM provider (Hubspot, Salesforce)'}
              value={crmFormData?.provider}
            />
          </Stack>
          <Stack gap={1}>
            <Typography
              color={!crmFormData?.provider ? 'text.disabled' : 'text.primary'}
              fontWeight={700}
              variant={'body2'}
            >
              List
            </Typography>
            <StyledSelect
              disabled={!crmFormData?.provider || isLoading}
              onChange={(e) => {
                setCRMFormData({
                  ...crmFormData,
                  listId: e.target.value as string,
                });
                setMode('animating');
              }}
              options={listOptions}
              placeholder={'Select contact list'}
              value={crmFormData?.listId}
            />
          </Stack>
        </Stack>
      </>
    );
  };

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
            sx={{
              cursor: 'pointer',
            }}
            width={'fit-content'}
          >
            <Icon component={ICON_HUBSPOT} />
            <Typography sx={{ transition: 'color .3s' }} variant={'body2'}>
              {listOptions.find((item) => item.value === crmFormData?.listId)
                ?.label || 'CRM List'}
            </Typography>

            <Typography
              color={'#5B76BC'}
              onClick={() => onClickToReSelect()}
              sx={{ textDecoration: 'underline' }}
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

      <Stack
        display={mode === 'default' ? 'flex' : 'none'}
        height={'100%'}
        width={'100%'}
      >
        {providerOptions.length > 0 ? (
          renderFiledNode()
        ) : (
          <Stack
            alignItems={'center'}
            height={'100%'}
            justifyContent={'center'}
            width={'100%'}
          >
            <Typography color={'#6F6C7D'}>
              No CRM providers integrated yet.
            </Typography>
            <Typography
              color={'#6E4EFB'}
              mt={1.5}
              onClick={async () => {
                await resetDialogState();
                router.push('/settings');
              }}
              sx={{ cursor: 'pointer' }}
            >
              Manage integrations
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );
};
