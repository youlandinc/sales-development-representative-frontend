import { useRef, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { SDRToast, StyledTextField } from '@/components/atoms';

import { CampaignLeadsCard } from './index';

import ICON_SEND from './assets/icon_send.svg';
import { _sendChatMessage } from '@/request/campaign/createCampagin';
import { HttpError } from '@/types';

const mockLeads = [
  {
    id: '1',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'CEO',
    company: 'Google',
    backgroundColor: '#dedede',
  },
  {
    id: '2',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'CEO',
    company: 'Tesla',
    backgroundColor: '#dedede',
  },
];

export const CampaignProcessContent = () => {
  const { activeStep } = useDialogStore();

  const [showLeads, setShowLeads] = useState(false);

  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showContent, setShowContent] = useState(false);

  const onClickToSendMessage = () => {
    setShowContent(!showContent);
    setShowLeads(!showLeads);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift + Enter: Add newline
        event.preventDefault(); // 防止默认的换行行为
        setInputValue((prev) => prev + '\n');
        event.preventDefault(); // Prevent default Enter behavior
      } else {
        // Enter: Send message
        if (inputValue.trim()) {
          setInputValue(''); // Clear the input box
        } else {
          await sendMessage();
        }
        event.preventDefault(); // Prevent default Enter behavior
      }
    }
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) {
      return;
    }
    // Send message
    const postData = {
      message,
    };
    setSending(true);
    try {
      const { data } = await _sendChatMessage(postData);
      console.log(data);
      setInputValue('');
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setSending(false);
    }
  };

  return (
    <Stack
      flexDirection={'row'}
      gap={showLeads ? 3 : 0}
      height={activeStep === 1 ? '60vh' : '100%'}
      justifyContent={'center'}
      minHeight={480}
      pt={3}
    >
      <Stack
        alignItems={'center'}
        flex={1}
        flexShrink={0}
        gap={4}
        height={'100%'}
        justifyContent={'center'}
        maxWidth={activeStep === 1 ? '100%' : 460}
        minWidth={460}
        sx={{ transition: 'all .3s' }}
        width={activeStep === 1 ? '100%' : 460}
      >
        <Stack
          alignItems={'center'}
          flex={showContent ? 1 : 'unset'}
          sx={{ transition: 'all .3s' }}
          width={showContent ? '100%' : 'auto'}
        >
          {!showContent ? (
            <>
              <Typography variant={'h5'}>
                Define your target audience
              </Typography>
              <Typography>
                Describe your ideal customer (industry, demographics, interests)
                or
              </Typography>
              <Typography>upload a CSV with your contact list.</Typography>
            </>
          ) : (
            <Stack></Stack>
          )}
        </Stack>

        <Stack
          bgcolor={'#F8F8FA'}
          borderRadius={4}
          component={'form'}
          maxWidth={showContent ? '100%' : 768}
          minHeight={100}
          pb={1.5}
          px={1.5}
          sx={{ transition: 'all .3s' }}
          width={'100%'}
        >
          <StyledTextField
            disabled={sending}
            multiline
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={'Message...'}
            rows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 'auto !important',
                padding: 0,
                fontSize: 14,
              },
              '& fieldset': {
                border: 'none',
              },
              '& .Mui-focused': {
                fieldset: {
                  border: 'none !important',
                },
              },
            }}
            value={inputValue}
          />

          <Stack
            alignItems={'center'}
            bgcolor={sending ? '#DEDEDE' : '#BABCBE'}
            borderRadius={'50%'}
            height={32}
            justifyContent={'center'}
            ml={'auto'}
            onClick={sendMessage}
            sx={{ cursor: sending ? 'default' : 'pointer' }}
            width={32}
          >
            <Icon component={ICON_SEND} sx={{ width: 24, height: 24 }} />
          </Stack>
        </Stack>
      </Stack>

      {activeStep === 1 ? (
        // step 1
        <Stack
          border={'1px solid #DFDEE6'}
          borderRadius={4}
          height={'100%'}
          p={3}
          sx={{
            transition: 'all .3s',
            visibility: showLeads ? 'visible' : 'hidden',
          }}
          width={showLeads ? 360 : 0}
        >
          <Stack
            borderBottom={'1px solid #E5E5E5'}
            flexDirection={'row'}
            pb={1.5}
          >
            <Typography variant={'subtitle1'}>Preview leads</Typography>
            <Typography color={'text.secondary'} ml={'auto'} variant={'body2'}>
              Estimated <b>{271}</b> leads
            </Typography>
          </Stack>
          {mockLeads.map((lead, index) => (
            <CampaignLeadsCard
              key={`${lead.firstName}-${lead.lastName}-${index}`}
              {...lead}
            />
          ))}
        </Stack>
      ) : (
        // step 2 or step 3
        <Stack
          border={'1px solid'}
          flex={1}
          sx={{
            transition: 'all .3s',
          }}
        ></Stack>
      )}
    </Stack>
  );
};
