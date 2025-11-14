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

import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { UFormatNumber } from '@/utils';
import { useClassNameObserver, useSwitch } from '@/hooks';

import {
  SDRToast,
  StyledButton,
  StyledShadowContent,
  StyledTextFieldNumber,
} from '@/components/atoms';

import {
  AIModelEnum,
  CampaignLeadItem,
  HttpError,
  ProcessCreateTypeEnum,
  ResponseCampaignEmail,
  ResponseCampaignMessagingStepFormBody,
  ResponseCampaignMessagingStepFormSubject,
} from '@/types';
import {
  _addStepEmail,
  _deleteStepEmail,
  _fetchChatLeadsLocally,
  _fetchEmailByLead,
  _fetchLeadPersonalResearch,
  _fetchStepEmail,
  _switchAIModel,
  _updateStepEmailSendDays,
} from '@/request';

import {
  CampaignProcessDrawerBody,
  CampaignProcessDrawerSubject,
  StyledLeadsCard,
  StyledSwitchModel,
} from '../index';

import ICON_NEXT from '../assets/icon_next.svg';
import ICON_PREV from '../assets/icon_prev.svg';

import ICON_MESSAGING_COMPANY from '../assets/icon_messaging_company.svg';
import ICON_MESSAGING_PERSON from '../assets/icon_messaging_person.svg';

import ICON_MESSAGING_EMAIL from '../assets/icon_messaging_email.svg';

import ICON_ADD from '../assets/icon_add.svg';
import ICON_DASHED from '../assets/icon_dashed.svg';
import ICON_TRASH from '../assets/icon_trash.svg';

export const ContentMessaging = () => {
  const {
    campaignId,
    leadsCount,
    leadsList,
    setLeadsList,
    setLeadsCount,
    chatId,
    returning,
    messagingSteps,
    setMessagingSteps,
    campaignType,
    aiModel,
    setAiModel,
  } = useDialogStore();

  const [personalResearchLoading, setPersonalResearchLoading] = useState(false);
  const [researchInfo, setResearchInfo] = useState('');

  const onClickToFetchPersonalResearch = async (id: string | number) => {
    if (!id) {
      return;
    }
    setPersonalResearchLoading(true);
    try {
      const { data } = await _fetchLeadPersonalResearch(id, chatId);
      setResearchInfo(data);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setPersonalResearchLoading(false);
    }
  };

  //const onClickToFetchPersonalResearch = async (id: string | number) => {
  //  setPersonalResearchLoading(true);
  //  let str = '';
  //  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/generate`, {
  //    method: 'POST',
  //    headers: {
  //      'Content-Type': 'application/json',
  //    },
  //    body: JSON.stringify({
  //      module: ModuleEnum.personal_research,
  //      params: {
  //        leadId: id,
  //      },
  //    }),
  //  })
  //    .then((response) => {
  //      if (response.body) {
  //        const reader = response.body.getReader();
  //        const decoder = new TextDecoder('utf-8');
  //
  //        const readStream = () => {
  //          reader.read().then(({ done, value }) => {
  //            if (done) {
  //              setPersonalResearchLoading(false);
  //              return;
  //            }
  //            // decode
  //            const data = decoder.decode(value).replace(/data:/g, '');
  //            //.replace(/\n/g, '');
  //
  //            str = str + data;
  //            setResearchInfo(str);
  //
  //            // continue read stream
  //            readStream();
  //          });
  //        };
  //
  //        readStream();
  //      }
  //    })
  //    .catch((error) => {
  //      const { message, header, variant } = error as HttpError;
  //      SDRToast({ message, header, variant });
  //    });
  //};

  const {
    open: openSubject,
    visible: visibleSubject,
    close: closeSubject,
  } = useSwitch(false);
  const {
    open: openBody,
    visible: visibleBody,
    close: closeBody,
  } = useSwitch(false);

  const [formSubject, setFormSubject] =
    useState<ResponseCampaignMessagingStepFormSubject>(FORM_SUBJECT);
  const [formBody, setFormBody] =
    useState<ResponseCampaignMessagingStepFormBody>(FORM_BODY);

  const onClickToOpenSubject = (index: number) => {
    openSubject();
    setFormSubject({
      subjectInstructions: messagingSteps[index].subjectInstructions || '',
      subjectExamples: messagingSteps[index].subjectExamples.length
        ? messagingSteps[index].subjectExamples
        : [''],
      stepId: messagingSteps[index].stepId,
    });
  };

  const onClickToOpenBody = (index: number) => {
    openBody();
    setFormBody({
      bodyInstructions: messagingSteps[index].bodyInstructions || '',
      bodyCallToAction: messagingSteps[index].bodyCallToAction || '',
      bodyWordCount: messagingSteps[index].bodyWordCount || 0,
      bodyExamples: messagingSteps[index].bodyExamples.length
        ? messagingSteps[index].bodyExamples
        : [''],
      stepId: messagingSteps[index].stepId,
    });
  };

  const messagingBoxRef = useRef<HTMLDivElement>(null);

  const onCloseDrawer = () => {
    closeSubject();
    closeBody();
  };

  const [leadsFetching, setLeadsFetching] = useState(false);

  const [activeInfo, setActiveInfo] = useState<'company' | 'person'>('company');
  const [activeValue, setActiveValue] = useState(0);
  const [expend, setExpend] = useState(true);

  const [emailTemplate, setEmailTemplate] = useState<ResponseCampaignEmail[]>();

  const fetchLeads = async () => {
    setLeadsFetching(true);
    setExpend(false);
    setActiveInfo('company');
    try {
      const {
        data: { leads, counts },
      } = await _fetchChatLeadsLocally(chatId);
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

  const [addStepEmailLoading, setAddStepEmailLoading] = useState(false);
  const [removeStepEmailLoading, setRemoveStepEmailLoading] = useState(false);
  const [updateStepEmailDaysLoading, setUpdateStepEmailDaysLoading] =
    useState(false);

  const [daysHash, setDaysHash] = useState<{
    [key: string]: number | undefined;
  }>();

  const onBlurToChangeSendDays = useCallback(
    async (id: string | number, days: number) => {
      if (updateStepEmailDaysLoading || !id) {
        return;
      }
      setUpdateStepEmailDaysLoading(true);
      const postData = {
        stepId: id,
        sendAfterDays: days,
      };
      try {
        await _updateStepEmailSendDays(postData);
        const temp = JSON.parse(JSON.stringify(messagingSteps));
        const index = temp.findIndex((step: any) => step.stepId === id);
        temp[index].afterDays = days;
        setMessagingSteps(temp);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setUpdateStepEmailDaysLoading(false);
      }
    },
    [messagingSteps, setMessagingSteps, updateStepEmailDaysLoading],
  );

  const onClickToRemoveStepEmail = useCallback(
    async (id: string | number) => {
      if (removeStepEmailLoading || !id) {
        return;
      }
      setRemoveStepEmailLoading(true);
      try {
        await _deleteStepEmail(id);
        const temp = JSON.parse(JSON.stringify(messagingSteps));
        const index = temp.findIndex((step: any) => step.stepId === id);
        temp.splice(index, 1);
        setMessagingSteps(temp);
        setEmailTemplate((prev) => {
          if (prev) {
            prev.splice(index, 1);
          }
          return prev;
        });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setRemoveStepEmailLoading(false);
      }
    },
    [messagingSteps, removeStepEmailLoading, setMessagingSteps],
  );

  const onClickToAddStepEmail = useCallback(async () => {
    if (
      !campaignId ||
      addStepEmailLoading ||
      !leadsList[activeValue]?.previewLeadId
    ) {
      return;
    }
    setAddStepEmailLoading(true);
    const postData = {
      campaignId,
      previewLeadId: leadsList[activeValue].previewLeadId,
    };
    try {
      const { data } = await _addStepEmail(postData);
      const temp = JSON.parse(JSON.stringify(messagingSteps));
      temp.push(data);
      setMessagingSteps(temp);
      const insidePostData = {
        stepId: data.stepId,
        previewLeadId: leadsList[activeValue].previewLeadId,
      };
      const { data: newStep } = await _fetchStepEmail(insidePostData);
      setEmailTemplate((prev) => {
        if (prev) {
          prev.push(newStep);
        }
        return prev;
      });
      setAddStepEmailLoading(false);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      setAddStepEmailLoading(false);
    }
  }, [
    activeValue,
    addStepEmailLoading,
    campaignId,
    leadsList,
    messagingSteps,
    setMessagingSteps,
  ]);

  const onClickToChangeLead = useCallback(
    async (item: CampaignLeadItem, index: number) => {
      setPersonalResearchLoading(false);
      setResearchInfo('');
      setActiveInfo('company');
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
      // 只有在 chatId 存在且不在 returning 状态时才获取数据
      if (!returning && chatId) {
        fetchLeads();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [returning, chatId],
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
    setDaysHash(() => {
      const newHash = {} as any;
      messagingSteps.forEach((step) => {
        newHash[step.stepId] = step.afterDays;
      });
      return newHash;
    });
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
    if (addStepEmailLoading) {
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
  }, [
    fetchTemplateLoading,
    addStepEmailLoading,
    messagingSteps,
    emailTemplate,
  ]);

  const onClickToSwitchModel = useCallback(
    async (value: AIModelEnum) => {
      if (
        !campaignId ||
        !leadsList[activeValue]?.previewLeadId ||
        value === aiModel
      ) {
        return;
      }
      setAiModel(value);

      const postData = {
        campaignId,
        model: value,
      };
      const previewData = {
        campaignId,
        previewLeadId: leadsList[activeValue].previewLeadId,
      };
      setFetchTemplateLoading(true);
      try {
        await _switchAIModel(postData);
        const { data } = await _fetchEmailByLead(previewData);
        setEmailTemplate(data);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setFetchTemplateLoading(false);
      }
    },
    [activeValue, aiModel, campaignId, leadsList, setAiModel],
  );

  return (
    <Stack
      borderLeft={
        campaignType === ProcessCreateTypeEnum.agent
          ? '1px solid #DFDEE6'
          : 'unset'
      }
      flex={1}
      gap={3}
      pt={3}
      px={3}
      ref={messagingBoxRef}
      sx={{
        transition: 'all .3s',
      }}
      width={'calc(100% - 510px)'}
    >
      <Stack gap={1.5} width={'100%'}>
        <Stack alignItems={'center'} flexDirection={'row'} mt={1.5}>
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
              scrollButtons: {
                className: 'custom-scroll-btn',
                sx: {
                  display: 'none',
                },
              },
              indicator: {
                sx: {
                  display: 'none',
                },
              },
            }}
            sx={{ p: 0 }}
            value={activeValue}
            variant={'scrollable'}
          >
            {leadsFetching
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Tab
                    key={i}
                    label={
                      <Stack
                        border={'1px solid #DFDEE6'}
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
                    key={index}
                    label={
                      <StyledLeadsCard
                        disabled={
                          activeValue !== index
                            ? leadsFetching || fetchTemplateLoading
                            : false
                        }
                        key={index}
                        onClick={async () => {
                          if (leadsFetching || fetchTemplateLoading) {
                            return;
                          }
                          await onClickToChangeLead(lead, index);
                        }}
                        sx={{
                          border:
                            activeValue === index
                              ? '1px solid #6E4EFB'
                              : '1px solid #DFDEE6',
                          bgcolor:
                            activeValue === index ? '#F7F4FD' : '#ffffff',
                          borderRadius: 2,
                          width: 320,
                          flexShrink: 0,
                          mr: 3,
                          p: 1.5,
                          cursor: 'pointer',
                        }}
                        {...lead}
                      />
                    }
                    sx={{ textTransform: 'none', p: 0 }}
                  />
                ))}
          </Tabs>
        </Box>

        <Stack
          bgcolor={'background.default'}
          border={'1px solid #DFDEE6'}
          borderRadius={4}
          mt={1.5}
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
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveInfo('person');
                if (
                  !personalResearchLoading &&
                  leadsList[activeValue] &&
                  !researchInfo
                ) {
                  await onClickToFetchPersonalResearch(
                    leadsList[activeValue].previewLeadId!,
                  );
                }
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
              <Typography color={'text.primary'} variant={'h7'}>
                Overview
              </Typography>

              {activeInfo === 'company' ? (
                <Typography variant={'body2'}>
                  {leadsList[activeValue]?.companyResearch || 'No data'}
                </Typography>
              ) : personalResearchLoading ? (
                <>
                  <Skeleton animation={'wave'} width={'85%'} />
                  <Skeleton animation={'wave'} width={'100%'} />
                  <Skeleton animation={'wave'} width={'70%'} />
                </>
              ) : (
                <Box
                  sx={{
                    fontSize: '14px',
                    padding: '0',
                    '& p': { margin: '0.5em 0' },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      marginTop: '1em',
                      marginBottom: '0.5em',
                    },
                    '& a': { color: '#6E4EFB' },
                  }}
                >
                  <Markdown rehypePlugins={[rehypeRaw]}>
                    {researchInfo}
                  </Markdown>
                </Box>
              )}
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
        p={3}
        position={'relative'}
      >
        <StyledSwitchModel
          loading={fetchTemplateLoading}
          onSelect={onClickToSwitchModel}
          sx={{
            position: 'sticky',
            top: 24,
            ml: 'auto',
            width: 'calc(17.5% - 24px)',
            cursor: fetchTemplateLoading ? 'not-allowed' : 'pointer',
          }}
          value={aiModel}
        />
        <Stack mt={'-56px'}>
          {computedEmail.map((step, index) => (
            <Stack
              gap={1.5}
              key={`step-${step.stepId}-${index}`}
              mx={'auto'}
              width={'65%'}
            >
              <Stack bgcolor={'#FFF'} borderRadius={2} gap={1.5} p={3}>
                {/*header*/}
                <Stack borderBottom={'1px solid #DFDEE6'} gap={1} pb={1.5}>
                  <Stack alignItems={'center'} flexDirection={'row'}>
                    <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
                      <Typography variant={'h6'}>Step {index + 1}</Typography>
                      <Icon
                        component={ICON_MESSAGING_EMAIL}
                        sx={{ width: 24, height: 24 }}
                      />
                    </Stack>
                    {index > 0 && (
                      <Icon
                        component={ICON_TRASH}
                        onClick={async () => {
                          if (step.loading || removeStepEmailLoading) {
                            return;
                          }
                          await onClickToRemoveStepEmail(step.stepId);
                        }}
                        sx={{
                          width: 24,
                          height: 24,
                          ml: 'auto',
                          cursor:
                            step.loading || removeStepEmailLoading
                              ? 'default'
                              : 'pointer',
                          '& path': {
                            fill:
                              step.loading || removeStepEmailLoading
                                ? '#D5CBFB'
                                : '#343330',
                          },
                        }}
                      />
                    )}
                  </Stack>

                  <Stack flexDirection={'row'}>
                    <Stack flexDirection={'row'} gap={'.5em'}>
                      <Typography flexShrink={0}>Subject:</Typography>
                      {step.loading ? (
                        <Skeleton
                          animation={'wave'}
                          height={'100%'}
                          width={320}
                        />
                      ) : (
                        <Typography variant={'subtitle1'}>
                          {step.subject}
                        </Typography>
                      )}
                    </Stack>

                    <StyledButton
                      color={'info'}
                      disabled={step.loading}
                      onClick={() => onClickToOpenSubject(index)}
                      size={'medium'}
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
                    <StyledShadowContent html={step.content} />
                  )}
                </Stack>

                <StyledButton
                  color={'info'}
                  disabled={step.loading}
                  onClick={() => onClickToOpenBody(index)}
                  size={'medium'}
                  sx={{ ml: 'auto' }}
                  variant={'outlined'}
                >
                  Edit body prompt
                </StyledButton>
              </Stack>

              {index === computedEmail.length - 1 ? (
                <Icon
                  component={ICON_ADD}
                  onClick={async () => {
                    if (addStepEmailLoading || step.loading) {
                      return;
                    }
                    await onClickToAddStepEmail();
                  }}
                  sx={{
                    height: 48,
                    width: 48,
                    cursor:
                      step.loading || addStepEmailLoading
                        ? 'default'
                        : 'pointer',
                    alignSelf: 'center',
                    '& path': {
                      fill:
                        step.loading || addStepEmailLoading
                          ? '#D5CBFB'
                          : '#343330',
                    },
                  }}
                />
              ) : (
                <Stack alignItems={'center'} alignSelf={'center'} width={160}>
                  <Icon component={ICON_DASHED} sx={{ height: 24, width: 1 }} />
                  <Stack
                    alignItems={'center'}
                    color={step.loading ? 'text.secondary' : 'text.primary'}
                    flexDirection={'row'}
                    fontSize={12}
                    gap={0.5}
                  >
                    Send after{' '}
                    <StyledTextFieldNumber
                      disabled={step.loading}
                      onBlur={async () => {
                        if (!daysHash?.[step.stepId]) {
                          setDaysHash((prev) => {
                            return {
                              ...prev,
                              [step.stepId]: 2,
                            };
                          });
                        }
                        await onBlurToChangeSendDays(
                          step.stepId,
                          daysHash?.[step.stepId] || 2,
                        );
                      }}
                      onValueChange={({ floatValue }) => {
                        setDaysHash((prev) => {
                          return {
                            ...prev,
                            [step.stepId]: floatValue,
                          };
                        });
                      }}
                      sx={{
                        p: 1,
                        fontSize: 12,
                        borderRadius: 1,
                        flex: 1,
                        '& .MuiInputBase-input': { py: 0 },
                      }}
                      value={daysHash?.[step.stepId]}
                    />{' '}
                    days
                  </Stack>
                  <Icon
                    component={ICON_DASHED}
                    sx={{ height: 24, width: 1, mb: 1.5 }}
                  />
                </Stack>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack flexShrink={0} height={'1px'} />

      <CampaignProcessDrawerSubject
        container={messagingBoxRef.current}
        formData={formSubject}
        onChangeTemplate={(template) => {
          const target = JSON.parse(
            JSON.stringify(
              emailTemplate?.find((item) => item.stepId === template.stepId),
            ),
          );
          target.subject = template.subject;
          setEmailTemplate((prev) => {
            const index = prev?.findIndex(
              (item) => item.stepId === template.stepId,
            );
            if (index !== -1) {
              prev![index!] = target;
            }
            return prev;
          });
        }}
        onClose={onCloseDrawer}
        previewLeadId={leadsList[activeValue]?.previewLeadId}
        visible={visibleSubject}
      />

      <CampaignProcessDrawerBody
        container={messagingBoxRef.current}
        formData={formBody}
        onChangeTemplate={(template) => {
          const target = JSON.parse(
            JSON.stringify(
              emailTemplate?.find((item) => item.stepId === template.stepId),
            ),
          );
          target.content = template.content;
          setEmailTemplate((prev) => {
            const index = prev?.findIndex(
              (item) => item.stepId === template.stepId,
            );
            if (index !== -1) {
              prev![index!] = target;
            }
            return prev;
          });
        }}
        onClose={onCloseDrawer}
        previewLeadId={leadsList[activeValue]?.previewLeadId}
        visible={visibleBody}
      />
    </Stack>
  );
};

const FORM_SUBJECT: ResponseCampaignMessagingStepFormSubject = {
  stepId: -1,
  subjectInstructions: '',
  subjectExamples: [],
};

const FORM_BODY: ResponseCampaignMessagingStepFormBody = {
  stepId: -1,
  bodyInstructions: '',
  bodyCallToAction: '',
  bodyWordCount: 100,
  bodyExamples: [],
};
