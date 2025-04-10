import { useEffect, useMemo, useState } from 'react';
import { debounce, Fade, Slider, Stack, Typography } from '@mui/material';
import { addDays, isDate, isValid } from 'date-fns';

import { useDialogStore } from '@/stores/useDialogStore';

import { WORD_COUNT_OPTIONS } from '@/constant';

import { ProcessCreateTypeEnum, ResponseCampaignLaunchInfo } from '@/types';
import {
  StyledDatePicker,
  StyledSelect,
  StyledSwitch,
} from '@/components/atoms';
import { UNotUndefined } from '@/utils';

const tomorrow = addDays(new Date(), 1);

const INITIAL_STATE: Omit<ResponseCampaignLaunchInfo, 'scheduleTime'> & {
  scheduleTime: Date | null;
} = {
  dailyLimit: 100,
  autopilot: false,
  sendNow: false,
  scheduleTime: null,
  sender: 'example@site.com',
  replyTo: 'example@site.com',
  senderName: 'example',
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

export const CampaignProcessContentLunch = () => {
  const { lunchInfo, setLunchInfo, setIsValidate, isValidate, campaignType } =
    useDialogStore();

  const [formData, setFormData] = useState<
    Omit<ResponseCampaignLaunchInfo, 'scheduleTime'> & {
      scheduleTime: Date | null;
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
        sender: lunchInfo.sender || INITIAL_STATE.sender,
        replyTo: lunchInfo.replyTo || INITIAL_STATE.replyTo,
        senderName: lunchInfo.senderName || INITIAL_STATE.senderName,
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
            isValid(formData.scheduleTime) && isDate(formData.scheduleTime)
              ? formData.scheduleTime.toISOString()
              : null,
        });
      }, 500),
    [formData, setLunchInfo],
  );

  useEffect(() => {
    updateLunchInfo();
  }, [formData, updateLunchInfo]);

  return (
    <Stack
      borderLeft={
        campaignType === ProcessCreateTypeEnum.agent
          ? '1px solid #DFDEE6'
          : 'unset'
      }
      flex={1}
      gap={6}
      p={3}
      sx={{
        transition: 'all .3s',
      }}
    >
      <Stack gap={1}>
        <Typography variant={'h7'}>Daily leads quota</Typography>
        <Typography color={'text.secondary'} variant={'body2'}>
          When the daily limit is reached, the remaining emails will be sent
          each following day until the total is completed.
        </Typography>
        <Slider
          marks={WORD_COUNT_OPTIONS}
          max={400}
          min={100}
          onChange={(_, v) => {
            setFormData({
              ...formData,
              dailyLimit: v as number,
            });
          }}
          step={1}
          sx={{
            maxWidth: 1200,
            height: 4,
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

      <Stack>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
          <Typography variant={'h7'}>Autopilot</Typography>
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
        <Typography color={'text.secondary'} variant={'body2'}>
          Ensure marketing campaigns or notifications can quickly respond to
          customer needs.
        </Typography>
      </Stack>

      <Stack gap={2}>
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
      </Stack>
      <Stack gap={3} maxWidth={600}>
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
            Reply-to email address
          </Typography>
          <StyledSelect
            options={[
              {
                label: formData.replyTo!,
                value: formData.replyTo!,
                key: formData.replyTo!,
              },
            ]}
            size={'small'}
            sx={{ width: 'fit-content', ml: 'auto' }}
            value={formData.replyTo}
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
      </Stack>
    </Stack>
  );
};
