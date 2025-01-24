import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Collapse,
  Icon,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { UFormatNumber } from '@/utils';
import { useClassNameObserver } from '@/hooks';

import { SDRToast, StyledButton } from '@/components/atoms';
import { CampaignLeadsCard } from '@/components/molecules';

import { CampaignLeadItem, HttpError, ResponseCampaignEmail } from '@/types';
import { _fetchChatLeads, _fetchEmailByLead } from '@/request';

import ICON_NEXT from './assets/icon_next.svg';
import ICON_PREV from './assets/icon_prev.svg';

import ICON_MESSAGING_COMPANY from './assets/icon_messaging_company.svg';
import ICON_MESSAGING_PERSON from './assets/icon_messaging_person.svg';

import ICON_MESSAGING_EMAIL from './assets/icon_messaging_email.svg';

export const CampaignProcessContentMessaging = () => {
  const {
    campaignId,
    leadsCount,
    leadsList,
    leadsVisible,
    setLeadsList,
    setLeadsCount,
    chatId,
    returning,
    setLeadsVisible,
    messagingSteps,
  } = useDialogStore();

  const [leadsFetching, setLeadsFetching] = useState(false);

  const [activeInfo, setActiveInfo] = useState<'company' | 'person'>('company');
  const [activeValue, setActiveValue] = useState(0);
  const [expend, setExpend] = useState(true);

  const [emailTemplate, setEmailTemplate] = useState<ResponseCampaignEmail[]>();

  const fetchLeads = async () => {
    !leadsVisible && setLeadsVisible(true);
    setLeadsFetching(true);
    setExpend(false);
    setActiveInfo('company');
    try {
      const {
        data: { leads, counts },
      } = await _fetchChatLeads(chatId);
      setLeadsList(leads);
      setLeadsCount(counts);
      setExpend(true);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setLeadsFetching(false);
    }
  };

  const [fetchTemplateLoading, setFetchTemplateLoading] = useState(false);

  const onClickToChangeLead = useCallback(
    async (item: CampaignLeadItem, index: number) => {
      setActiveValue(index);
      if (!campaignId || !item.previewLeadId || fetchTemplateLoading) {
        return;
      }
      const postData = {
        campaignId,
        previewLeadId: item.previewLeadId,
      };
      setFetchTemplateLoading(true);
      try {
        const { data } = await _fetchEmailByLead(postData);
        setEmailTemplate(data);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setFetchTemplateLoading(false);
      }
    },
    [campaignId, fetchTemplateLoading],
  );

  const [buttons, setButtons] = useState<HTMLElement[] | null>(null);
  const [preDisabled, setPreDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    const elements = document.getElementsByClassName(
      'custom-scroll-btn',
    ) as unknown as HTMLElement[];
    setButtons(elements);
  }, []);

  useClassNameObserver(buttons?.[0], (className) => {
    setPreDisabled(className.includes('Mui-disabled'));
  });
  useClassNameObserver(buttons?.[1], (className) => {
    setNextDisabled(className.includes('Mui-disabled'));
  });

  useEffect(
    () => {
      if (!returning) {
        fetchLeads();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [returning],
  );

  useEffect(() => {
    if (leadsList.length === 0 || fetchTemplateLoading) {
      return;
    }
    if (!emailTemplate) {
      onClickToChangeLead(leadsList[0], 0);
    }
  }, [emailTemplate, fetchTemplateLoading, leadsList, onClickToChangeLead]);

  const computedEmail = useMemo(() => {
    if (fetchTemplateLoading) {
      return messagingSteps.map((step) => {
        return {
          ...step,
          content: '',
          subject: '',
          loading: true,
        };
      });
    }
    return messagingSteps.map((step) => {
      const template = emailTemplate?.find(
        (template) => template.stepId === step.stepId,
      );
      return template
        ? {
            ...step,
            ...template,
            loading: false,
          }
        : {
            ...step,
            content: '',
            subject: '',
            loading: false,
          };
    });
  }, [emailTemplate, messagingSteps, fetchTemplateLoading]);

  return (
    <Stack
      borderLeft={'1px solid #DFDEE6'}
      flex={1}
      gap={3}
      pt={3}
      px={3}
      sx={{
        transition: 'all .3s',
        overflowY: 'hidden',
      }}
      width={'calc(100% - 510px)'}
    >
      <Stack gap={3} width={'100%'}>
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
            sx={{ p: 0 }}
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
                    sx={{ textTransform: 'none', p: 0 }}
                  />
                ))
              : leadsList.map((lead, index) => (
                  <Tab
                    disabled={leadsFetching || fetchTemplateLoading}
                    key={index}
                    label={
                      <CampaignLeadsCard
                        key={index}
                        {...lead}
                        onClick={() => onClickToChangeLead(lead, index)}
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
                    sx={{ textTransform: 'none', p: 0 }}
                  />
                ))}
          </Tabs>
        </Box>

        <Stack
          bgcolor={'#ffffff'}
          border={'1px solid #DFDEE6'}
          borderRadius={4}
          p={2}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={2}
            onClick={(e) => {
              if (leadsFetching) {
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              setExpend(!expend);
            }}
            sx={{
              cursor: leadsFetching ? 'default' : 'pointer',
            }}
          >
            <Icon
              component={ICON_NEXT}
              sx={{
                width: 18,
                height: 18,
                transform: expend ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform .3s',
                '& path': {
                  fill: leadsFetching ? '#6F6C7D' : '#2A292E',
                },
              }}
            />

            <StyledButton
              color={'info'}
              disabled={leadsFetching || !leadsList[activeValue]}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveInfo('company');
              }}
              size={'small'}
              sx={{
                color:
                  leadsFetching || activeInfo !== 'company'
                    ? '#6F6C7D !important'
                    : '#2A292E !important',
              }}
              variant={activeInfo === 'company' ? 'outlined' : 'text'}
            >
              <Icon
                component={ICON_MESSAGING_COMPANY}
                sx={{
                  width: 18,
                  height: 18,
                  mr: 0.4,
                  '& path': {
                    fill: activeInfo === 'company' ? '#2A292E' : '#6F6C7D',
                  },
                }}
              />
              Company research
            </StyledButton>
            <StyledButton
              color={'info'}
              disabled={leadsFetching || !leadsList[activeValue]}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveInfo('person');
              }}
              size={'small'}
              sx={{
                color:
                  leadsFetching || activeInfo !== 'person'
                    ? '#6F6C7D !important'
                    : '#2A292E !important',
              }}
              variant={activeInfo === 'person' ? 'outlined' : 'text'}
            >
              <Icon
                component={ICON_MESSAGING_PERSON}
                sx={{
                  width: 18,
                  height: 18,
                  mr: 0.5,
                  '& path': {
                    fill: activeInfo === 'person' ? '#2A292E' : '#6F6C7D',
                  },
                }}
              />
              Personal research
            </StyledButton>
          </Stack>

          <Collapse in={expend}>
            <Stack gap={1} mt={2}>
              <Typography color={'text.secondary'} variant={'subtitle3'}>
                Overview
              </Typography>
              <Typography variant={'body3'}>
                {activeInfo === 'company'
                  ? leadsList[activeValue]?.companyResearch
                  : leadsList[activeValue]?.personalResearch}
              </Typography>
            </Stack>
          </Collapse>
        </Stack>
      </Stack>

      <Stack
        bgcolor={'#F8F8FA'}
        border={'1px solid #D2D6E1'}
        borderRadius={4}
        flex={1}
        gap={3}
        overflow={'auto'}
        p={3}
      >
        {computedEmail.map((step, index) => (
          <Stack
            bgcolor={'#FFF'}
            borderRadius={2}
            gap={1.5}
            key={`step-${step.stepId}-${index}`}
            minWidth={600}
            mx={'auto'}
            p={3}
            width={'65%'}
          >
            {/*header*/}
            <Stack borderBottom={'1px solid #E5E5E5'} gap={1} pb={1.5}>
              <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
                <Typography variant={'h6'}>Step {index + 1}</Typography>
                <Icon
                  component={ICON_MESSAGING_EMAIL}
                  sx={{ width: 24, height: 24 }}
                />
              </Stack>

              <Stack flexDirection={'row'}>
                <Stack flexDirection={'row'} gap={'.5em'}>
                  <Typography flexShrink={0}>Subject :</Typography>
                  {step.loading ? (
                    <Skeleton animation={'wave'} height={'100%'} width={320} />
                  ) : (
                    <Typography variant={'subtitle1'}>
                      {step.subject}
                    </Typography>
                  )}
                </Stack>

                <StyledButton
                  color={'info'}
                  disabled={step.loading}
                  size={'small'}
                  sx={{ ml: 'auto' }}
                  variant={'outlined'}
                >
                  Edit subject prompt
                </StyledButton>
              </Stack>
            </Stack>

            {/*content*/}
            <Stack>
              {step.loading ? (
                <Stack>
                  <Skeleton width={120} />
                  <Skeleton sx={{ mt: 1.5 }} width={'80%'} />
                  <Skeleton width={'50%'} />
                  <Skeleton sx={{ mt: 1.5 }} width={'60%'} />
                  <Skeleton width={'90%'} />
                  <Skeleton sx={{ mt: 3 }} width={'30%'} />
                </Stack>
              ) : (
                <ShadowContent html={step.content} />
              )}
            </Stack>

            <StyledButton
              color={'info'}
              disabled={step.loading}
              size={'small'}
              sx={{ ml: 'auto' }}
              variant={'outlined'}
            >
              Edit body prompt
            </StyledButton>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

const ShadowContent = ({ html }: { html: string }) => {
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shadowRef.current) {
      return;
    }

    const shadowRoot =
      shadowRef.current.shadowRoot ||
      shadowRef.current.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = '';

    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = html;

    shadowRoot.appendChild(contentContainer);
  }, [html]);

  return <div ref={shadowRef} />;
};
