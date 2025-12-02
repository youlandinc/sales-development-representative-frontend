import { useEffect, useMemo, useState } from 'react';
import { debounce, Fade, Slider, Stack, Typography } from '@mui/material';
import { addDays, isDate, isValid } from 'date-fns';
import { useRouter } from 'nextjs-toploader/app';
import useSWR from 'swr';

import { useDialogStore } from '@/stores/useDialogStore';

import { UNotUndefined } from '@/utils';

import {
  SDRToast,
  StyledDatePicker,
  StyledDateTimePicker,
  StyledRadioGroup,
  StyledSwitch,
} from '@/components/atoms';
import { CommonSelectWithAction } from '@/components/molecules';

import { _fetchEmailProfiles } from '@/request';
import {
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

export const ContentLaunch = () => {
  const router = useRouter();

  const launchInfo = useDialogStore((state) => state.launchInfo);
  const isValidate = useDialogStore((state) => state.isValidate);
  const campaignType = useDialogStore((state) => state.campaignType);

  const setLaunchInfo = useDialogStore((state) => state.setLaunchInfo);
  const setIsValidate = useDialogStore((state) => state.setIsValidate);
  const resetDialogState = useDialogStore((state) => state.resetDialogState);

  const [optionValue, setOptionValue] = useState('schedule');
  const [formData, setFormData] = useState<
    Omit<ResponseCampaignLaunchInfo, 'scheduleTime'> & {
      scheduleTime: Date | null;
      emilProfileId: number | null;
    }
  >(INITIAL_STATE);

  useEffect(
    () => {
      setFormData({
        dailyLimit: launchInfo.dailyLimit || INITIAL_STATE.dailyLimit,
        autopilot: launchInfo.autopilot || INITIAL_STATE.autopilot,
        sendNow: launchInfo.sendNow || INITIAL_STATE.sendNow,
        scheduleTime: launchInfo.scheduleTime
          ? new Date(launchInfo.scheduleTime)
          : INITIAL_STATE.scheduleTime,
        emilProfileId: launchInfo.emilProfileId || INITIAL_STATE.emilProfileId,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const updateLaunchInfo = useMemo(
    () =>
      debounce(() => {
        setLaunchInfo({
          ...formData,
          scheduleTime:
            formData.scheduleTime &&
            isDate(formData.scheduleTime) &&
            isValid(formData.scheduleTime)
              ? formData.scheduleTime.toISOString()
              : null,
        });
      }, 500),
    [formData, setLaunchInfo],
  );

  useEffect(() => {
    updateLaunchInfo();
  }, [formData, updateLaunchInfo]);

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
              <Stack bgcolor={'#F0F0F4'} height={'1px'} my={1.5} />
              <Typography
                color={'#363440'}
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
              bgcolor: '#363440',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
              '&::before': {
                display: 'none',
              },
            },
            '& .MuiSlider-rail': {
              bgcolor: '#363440',
              opacity: 0.32,
            },
            '& .MuiSlider-track': {
              bgcolor: '#363440',
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
                <StyledDateTimePicker
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
    </Stack>
  );
};
