import { useEffect, useMemo, useState } from 'react';
import { debounce, Fade, Slider, Stack, Typography } from '@mui/material';
import { addDays, isDate, isValid } from 'date-fns';
import { useRouter } from 'nextjs-toploader/app';
import useSWR from 'swr';

import { useDialogStore } from '@/stores/useDialogStore';

import { WORD_COUNT_OPTIONS } from '@/constant';
import { UNotUndefined } from '@/utils';

import {
  SDRToast,
  StyledDatePicker,
  StyledRadioGroup,
  StyledSwitch,
} from '@/components/atoms';
import { CommonSelectWithAction } from '@/components/molecules';

import { _commonFetchSettings, _fetchEmailProfiles } from '@/request';
import {
  BizCodeEnum,
  HttpError,
  ProcessCreateTypeEnum,
  ResponseCampaignLaunchInfo,
} from '@/types';

const tomorrow = addDays(new Date(), 1);

const INITIAL_STATE: Omit<ResponseCampaignLaunchInfo, 'scheduleTime'> & {
  scheduleTime: Date | null;
  emilProfileId: number | null;
} = {
  dailyLimit: 100,
  autopilot: false,
  sendNow: false,
  scheduleTime: null,
  // sender: 'example@site.com',
  // senderName: 'example',
  // signatureId: null,
  emilProfileId: null,
};

const INITIAL_OPTION = [
  {
    label: 'Send anytime',
    key: 'sendAnytime',
    value: 'send',
  },
  {
    label: 'Schedule for time',
    key: 'scheduleTime',
    value: 'schedule',
  },
];

const DEFAULT_CARD_STYLE = {
  border: '1px solid #E5E5E5',
  borderRadius: 4,
  p: 3,
};

export const CampaignProcessContentLunch = () => {
  const {
    lunchInfo,
    setLunchInfo,
    setIsValidate,
    isValidate,
    campaignType,
    resetDialogState,
  } = useDialogStore();

  const router = useRouter();

  const [formData, setFormData] = useState<
    Omit<ResponseCampaignLaunchInfo, 'scheduleTime'> & {
      scheduleTime: Date | null;
      emilProfileId: number | null;
    }
  >(INITIAL_STATE);

  const [optionValue, setOptionValue] = useState('schedule');

  useEffect(
    () => {
      setFormData({
        dailyLimit: lunchInfo.dailyLimit || INITIAL_STATE.dailyLimit,
        autopilot: lunchInfo.autopilot || INITIAL_STATE.autopilot,
        sendNow: lunchInfo.sendNow || INITIAL_STATE.sendNow,
        scheduleTime: lunchInfo.scheduleTime
          ? new Date(lunchInfo.scheduleTime)
          : INITIAL_STATE.scheduleTime,
        // sender: lunchInfo.sender || INITIAL_STATE.sender,
        // senderName: lunchInfo.senderName || INITIAL_STATE.senderName,
        // signatureId: lunchInfo.signatureId || INITIAL_STATE.signatureId,
        emilProfileId: lunchInfo.emilProfileId || INITIAL_STATE.emilProfileId,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const updateLunchInfo = useMemo(
    () =>
      debounce(() => {
        setLunchInfo({
          ...formData,
          scheduleTime:
            formData.scheduleTime &&
            isDate(formData.scheduleTime) &&
            isValid(formData.scheduleTime)
              ? formData.scheduleTime.toISOString()
              : null,
        });
      }, 500),
    [formData, setLunchInfo],
  );

  useEffect(() => {
    updateLunchInfo();
  }, [formData, updateLunchInfo]);

  const [signatureList, setSignatureList] = useState<TOption[]>([
    {
      label: 'No signature',
      value: null,
      key: 'noSignature',
      default: false,
    },
  ]);

  const { isLoading } = useSWR(
    'fetchSignature',
    async () => {
      try {
        const {
          data: {
            [BizCodeEnum.signature]: signatureList,
            [BizCodeEnum.email_domain]: emailDomainList,
          },
        } = await _commonFetchSettings({
          bizCode: [BizCodeEnum.email_domain, BizCodeEnum.signature],
        });

        const reducedSignatureList = signatureList.map((item) => ({
          label: item.label,
          key: String(item.key),
          value: String(item.value),
          selected: item.selected,
        }));

        const reducedEmailDomainList = emailDomainList.map((item) => ({
          label: item.label,
          key: String(item.key),
          value: String(item.value),
          selected: item.selected,
        }));

        setSignatureList((prev) => [
          ...reducedSignatureList,
          ...prev.filter((item) => item.key === 'noSignature'),
        ]);

        const defaultSignature = reducedSignatureList.find(
          (item) => item.selected,
        );
        const defaultEmailDomain = reducedEmailDomainList.find(
          (item) => item.selected,
        );

        // if (defaultSignature) {
        //   setFormData((prev) => ({
        //     ...prev,
        //     signatureId:
        //       prev.signatureId === null
        //         ? defaultSignature.value
        //         : prev.signatureId,
        //   }));
        // }
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  const { data, isValidating: emailProfilesLoading } = useSWR(
    'emailProfiles',
    async () => {
      try {
        const data = await _fetchEmailProfiles();
        if (data?.data?.length > 0) {
          setFormData({
            ...formData,
            emilProfileId: data.data[0].id,
          });
        }
        return data;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  );

  const onClickToChangeSignature = (value: any) => {
    if (value === formData.emilProfileId) {
      return;
    }
    setFormData({
      ...formData,
      emilProfileId: value,
    });
  };

  return (
    <Stack
      borderLeft={
        campaignType === ProcessCreateTypeEnum.agent
          ? '1px solid #DFDEE6'
          : 'unset'
      }
      flex={1}
      gap={6}
      maxWidth={1200}
      mr={'auto'}
      sx={{
        transition: 'all .3s',
      }}
    >
      <Stack gap={1.5} sx={DEFAULT_CARD_STYLE}>
        <Typography fontSize={18} variant={'h6'}>
          Select sender profile
        </Typography>
        <Stack>
          <Typography color={'text.secondary'} variant={'body2'}>
            Choose which sender profile to use for this campaign. Each profile
            includes your sender name, email signature, and connected mailboxes.
          </Typography>
          <Typography color={'text.secondary'} variant={'body2'}>
            If mailbox rotation is enabled, emails will send evenly across them.
          </Typography>
        </Stack>
        <CommonSelectWithAction
          actionsNode={
            <>
              <Stack bgcolor={'#EAE9EF'} height={'1px'} my={1.5} />
              <Typography
                color={'#6E4EFB'}
                fontSize={14}
                lineHeight={1}
                ml={'auto'}
                onClick={async () => {
                  await resetDialogState();
                  router.push('/settings');
                }}
                sx={{
                  cursor: 'pointer',
                }}
              >
                Manage profiles
              </Typography>
            </>
          }
          containerSx={{ width: '600px' }}
          defaultValue={'No sender profile selected'}
          labelSx={{
            justifyContent: 'space-between',
          }}
          loading={emailProfilesLoading}
          noOptionTip={'No profiles available — create one in Settings'}
          onSelect={(value) => {
            onClickToChangeSignature(value);
          }}
          options={
            data?.data?.map((item) => ({
              label: `${item.senderName} (${item.mailboxList.length} mailbox${
                item.mailboxList.length > 1 ? 'es' : ''
              })`,
              value: item.id,
              key: item.id,
            })) || []
          }
          value={formData.emilProfileId}
        />
      </Stack>
      <Stack gap={1.5} sx={DEFAULT_CARD_STYLE}>
        <Typography fontSize={18} variant={'h6'}>
          Daily send limit
        </Typography>
        <Stack>
          <Typography color={'text.secondary'} variant={'body2'}>
            Set how many emails you want to send per day for this campaign. Once
            the daily limit is reached, remaining emails will continue sending
            the next day.
          </Typography>
          <Typography color={'text.secondary'} variant={'body2'}>
            <Typography component={'span'} fontSize={14} fontWeight={600}>
              Tip:
            </Typography>
            Start low (20–50/day) if your mailbox is new. Increase gradually for
            better deliverability.
          </Typography>
        </Stack>
        <Slider
          marks={[
            { label: '10', value: 10 },
            ...Array.from({ length: 50 }, (_, i) => {
              const value = (i + 1) * 50;
              return {
                value,
                label: value === 500 ? value.toString() : '',
              };
            }),
          ]}
          max={500}
          min={10}
          onChange={(_, v) => {
            setFormData({
              ...formData,
              dailyLimit: v as number,
            });
          }}
          step={10}
          sx={{
            mt: 3,
            maxWidth: 1200,
            height: 4,
            '& .MuiSlider-markLabel': {
              top: -24,
              color: 'text.primary',
              '&[data-index="0"]': {
                left: '8px',
              },
              '&[data-index="10"]': {
                left: 'calc(100% - 10px) !important',
              },
            },
            '& .MuiSlider-thumb': {
              height: 20,
              width: 20,
              bgcolor: '#6E4EFB',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&::before': {
                display: 'none',
              },
            },
            '& .MuiSlider-rail': {
              bgcolor: '#6E4EFB',
              opacity: 0.32,
            },
            '& .MuiSlider-track': {
              bgcolor: '#6E4EFB',
            },
            '.MuiSlider-mark': {
              width: 4,
              height: 4,
              borderRadius: '50%',
              transform: 'translateY(-50%)',
            },
          }}
          value={formData.dailyLimit || 100}
          valueLabelDisplay={'auto'}
        />
      </Stack>

      <Stack gap={1.5} sx={DEFAULT_CARD_STYLE}>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
          <Typography fontSize={18} variant={'h6'}>
            Autopilot
          </Typography>
          <StyledSwitch
            checked={formData.autopilot}
            onChange={(_, checked) => {
              setFormData({ ...formData, autopilot: checked });
            }}
          />
        </Stack>
        <Typography color={'text.secondary'} variant={'body2'}>
          Save manual effort by eliminating the need to review or confirm emails
          one by one.
        </Typography>
      </Stack>
      <Stack gap={1.5} sx={DEFAULT_CARD_STYLE}>
        <Typography fontSize={18} variant={'h6'}>
          Send schedule
        </Typography>
        <Stack gap={1}>
          <StyledRadioGroup
            onChange={(_, value) => {
              setOptionValue(value);
              setFormData({
                ...formData,
                sendNow: value === 'send',
              });
            }}
            options={INITIAL_OPTION}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: 14,
              },
              '& .MuiFormControlLabel-root': {
                alignItems: 'center',
              },
              gap: 1,
            }}
            value={optionValue}
          />
          <Fade
            in={formData.sendNow}
            style={{ display: formData.sendNow ? 'block' : 'none' }}
          >
            <Typography color={'text.secondary'} variant={'body2'}>
              Send your campaign now.
            </Typography>
          </Fade>
          <Fade
            in={!formData.sendNow}
            style={{ display: !formData.sendNow ? 'flex' : 'none' }}
          >
            <Stack gap={1}>
              <Typography color={'text.secondary'} variant={'body2'}>
                Schedule your campaign to send at a time of your choosing. The
                date and time below are in Pacific Standard Time (PST).
              </Typography>
              <Stack maxWidth={600}>
                <StyledDatePicker
                  disablePast
                  error={UNotUndefined(isValidate) ? !isValidate : false}
                  minDate={tomorrow}
                  onChange={(date) => {
                    setFormData({
                      ...formData,
                      scheduleTime: date,
                    });
                  }}
                  onError={(error) => {
                    setIsValidate(!error);
                  }}
                  value={
                    formData.scheduleTime
                      ? new Date(formData.scheduleTime)
                      : null
                  }
                />
              </Stack>
            </Stack>
          </Fade>
        </Stack>
      </Stack>
      {/* <Stack gap={2}>
        <Stack flexDirection={'row'} gap={3}>
          {INITIAL_OPTION.map((item) => (
            <Typography
              key={item.key}
              onClick={() => {
                setOptionValue(item.value);
                setFormData({
                  ...formData,
                  sendNow: item.value === 'send',
                });
              }}
              sx={{
                px: 1.5,
                py: 1,
                border:
                  optionValue === item.value
                    ? '1px solid #6E4EFB'
                    : '1px solid #DFDEE6',
                borderRadius: 2,
                color: optionValue === item.value ? '#6E4EFB' : '#6F6C7D',
                cursor: 'pointer',
                transition: 'all .3s',
                userSelect: 'none',
                outline:
                  optionValue === item.value
                    ? '1px solid #6E4EFB'
                    : '1px solid transparent',
              }}
              variant={'body2'}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>
        <Fade
          in={formData.sendNow}
          style={{ display: formData.sendNow ? 'block' : 'none' }}
        >
          <Typography color={'text.secondary'} variant={'body2'}>
            Send your campaign now.
          </Typography>
        </Fade>
        <Fade
          in={!formData.sendNow}
          style={{ display: !formData.sendNow ? 'block' : 'none' }}
        >
          <Stack>
            <Typography color={'text.secondary'} variant={'body2'}>
              Schedule your campaign to send at a time of your choosing. The
              date and time below are in Pacific Standard Time (PST).
            </Typography>
            <Stack maxWidth={600} mt={3}>
              <StyledDatePicker
                disablePast
                error={UNotUndefined(isValidate) ? !isValidate : false}
                minDate={tomorrow}
                onChange={(date) => {
                  setFormData({
                    ...formData,
                    scheduleTime: date,
                  });
                }}
                onError={(error) => {
                  setIsValidate(!error);
                }}
                value={
                  formData.scheduleTime ? new Date(formData.scheduleTime) : null
                }
              />
            </Stack>
          </Stack>
        </Fade>
      </Stack> */}

      {/* <Stack gap={3} maxWidth={600}>
        <Stack alignItems={'center'} flexDirection={'row'}>
          <Typography flexShrink={0} variant={'subtitle2'}>
            Email address
          </Typography>
          <StyledSelect
            options={[
              {
                label: formData.sender!,
                value: formData.sender!,
                key: formData.sender!,
              },
            ]}
            size={'small'}
            sx={{ width: 'fit-content', ml: 'auto' }}
            value={formData.sender}
          />
        </Stack>

        <Stack alignItems={'center'} flexDirection={'row'}>
          <Typography flexShrink={0} variant={'subtitle2'}>
            Name
          </Typography>
          <StyledSelect
            options={[
              {
                label: formData.senderName!,
                value: formData.senderName!,
                key: formData.senderName!,
              },
            ]}
            size={'small'}
            sx={{ width: 'fit-content', ml: 'auto' }}
            value={formData.senderName}
          />
        </Stack>
        <Stack alignItems={'center'} flexDirection={'row'}>
          <Typography flexShrink={0} variant={'subtitle2'}>
            Signature
          </Typography>
          <CommonSelectWithAction
            actionsNode={
              <>
                <Stack bgcolor={'#EAE9EF'} height={'1px'} mt={1.5} mx={3} />
                <Typography
                  color={'#6E4EFB'}
                  fontSize={14}
                  lineHeight={1}
                  ml={'auto'}
                  mr={3}
                  mt={1}
                  onClick={async () => {
                    await resetDialogState();
                    router.push('/settings');
                  }}
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  Manage signatures
                </Typography>
              </>
            }
            containerSx={{ width: 'fit-content', ml: 'auto' }}
            loading={isLoading}
            menuTips={'Signatures saved by you'}
            onSelect={(value) => {
              onClickToChangeSignature(value);
            }}
            options={signatureList}
            value={formData.signatureId}
          />
        </Stack>
      </Stack> */}
    </Stack>
  );
};
