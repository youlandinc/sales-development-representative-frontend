import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { SDRToast, StyledTextField } from '@/components/atoms';

import { CampaignLeadsCard, CampaignProcessChatServer } from './index';

import { HttpError } from '@/types';
import { _fetchChatLeads, _sendChatMessage } from '@/request/campaign';

import ICON_SEND from './assets/icon_send.svg';

export const CampaignProcessContent = () => {
  const {
    chatId,
    activeStep,
    setChatId,
    createChatSSE,
    messageList,
    returning,
    setReturning,
    isFirst,
    setLeadsList,
    setLeadsCount,
    setLeadsVisible,
    leadsVisible,
    leadsList,
    leadsCount,
    addMessageItem,
  } = useDialogStore();

  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = async (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (isComposing) {
        return;
      }
      if (event.shiftKey) {
        event.preventDefault();
        setInputValue((prev) => prev + '\n');
        event.preventDefault();
      } else {
        if (inputValue && inputValue.trim()) {
          await sendMessage();
          setInputValue('');
        }
        event.preventDefault();
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
    if (chatId) {
      Object.assign(postData, { chatId });
    }
    setSending(true);
    try {
      addMessageItem({ message, source: 'user' });
      const {
        data: { chatId: resChatId },
      } = await _sendChatMessage(postData);
      addMessageItem({ isFake: true, source: 'server', data: [], id: '-1' });
      if (!chatId) {
        await createChatSSE(resChatId);
      }
      setChatId(resChatId);
      setInputValue('');
      setReturning(true);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setSending(false);
    }
  };

  const messageBoxRef = useRef<HTMLDivElement | null>(null);

  const deps = JSON.stringify(messageList);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [deps]);

  const fetchLeads = async () => {
    try {
      const {
        data: { leads, counts },
      } = await _fetchChatLeads(chatId);
      setLeadsList(leads);
      setLeadsCount(counts);
      !leadsVisible && setLeadsVisible(true);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  useEffect(
    () => {
      if (isFirst) {
        return;
      }
      if (!returning) {
        fetchLeads();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFirst, returning],
  );

  return (
    <Stack
      flexDirection={'row'}
      gap={leadsVisible ? 3 : 0}
      height={activeStep === 1 ? '60vh' : '100%'}
      justifyContent={'center'}
      minHeight={480}
      mt={3}
      width={'100%'}
    >
      <Stack
        alignItems={'center'}
        gap={4}
        justifyContent={messageList.length > 0 ? 'unset' : 'center'}
        maxWidth={activeStep === 1 ? '100%' : 460}
        minWidth={460}
        sx={{ transition: 'all .3s', overflow: 'hidden' }}
        width={activeStep === 1 ? '100%' : 460}
      >
        <Stack
          alignItems={'center'}
          height={messageList.length > 0 ? 'calc(100% - 174px)' : 'auto'}
          sx={{ transition: 'all .3s' }}
          width={messageList.length > 0 ? '100%' : 'auto'}
        >
          {messageList.length <= 0 ? (
            <>
              <Typography variant={'h5'}>
                Define your target audience
              </Typography>
              <Typography>
                Describe your ideal customer (industry, demographics, interests)
              </Typography>
              {/*<Typography>or upload a CSV with your contact list.</Typography>*/}
            </>
          ) : (
            <Stack
              gap={3}
              height={'100%'}
              ref={messageBoxRef}
              sx={{ overflow: 'auto' }}
              width={'100%'}
            >
              {messageList.map((item, index) => (
                <Stack
                  key={`${index}`}
                  maxWidth={'60%'}
                  ml={item.source === 'user' ? 'auto' : 'unset'}
                  width={'fit-content'}
                >
                  {item.source === 'user' ? (
                    <Typography
                      bgcolor={'#EAE9EF'}
                      borderRadius={2}
                      color={'#6F6C7D'}
                      px={2}
                      py={1}
                    >
                      {item.message}
                    </Typography>
                  ) : (
                    <CampaignProcessChatServer
                      data={item.data!}
                      id={item.id!}
                      isFake={item.isFake}
                      source={item.source}
                    />
                  )}
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>

        <Stack
          bgcolor={'#F8F8FA'}
          borderRadius={4}
          component={'form'}
          flexShrink={0}
          height={150}
          maxWidth={messageList.length > 0 ? '100%' : 768}
          pb={1.5}
          px={1.5}
          sx={{ transition: 'all .3s' }}
          width={'100%'}
        >
          <StyledTextField
            disabled={sending || returning}
            multiline
            onChange={(e) => setInputValue(e.target.value)}
            onCompositionEnd={() => setIsComposing(false)}
            onCompositionStart={() => setIsComposing(true)}
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
            bgcolor={sending || returning ? '#DEDEDE' : '#BABCBE'}
            borderRadius={'50%'}
            height={32}
            justifyContent={'center'}
            ml={'auto'}
            onClick={sendMessage}
            sx={{ cursor: sending || returning ? 'default' : 'pointer' }}
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
          flexShrink={0}
          height={'100%'}
          overflow={'auto'}
          px={leadsVisible ? 3 : 0}
          sx={{
            transition: 'all .3s',
            visibility: leadsVisible ? 'visible' : 'hidden',
          }}
          width={leadsVisible ? 360 : 0}
        >
          <Stack
            bgcolor={'#ffffff'}
            borderBottom={'1px solid #E5E5E5'}
            flexDirection={'row'}
            pb={1.5}
            position={'sticky'}
            pt={3}
            sx={{
              zIndex: 999,
            }}
            top={0}
          >
            <Typography variant={'subtitle1'}>Preview leads</Typography>
            <Typography color={'text.secondary'} ml={'auto'} variant={'body2'}>
              Estimated <b>{leadsCount}</b> leads
            </Typography>
          </Stack>

          <Stack pb={3}>
            {leadsList.map((lead, index) => (
              <CampaignLeadsCard
                key={`${lead.firstName}-${lead.lastName}-${index}`}
                {...lead}
              />
            ))}
          </Stack>
        </Stack>
      ) : (
        // step 2 or step 3
        <Stack
          border={'1px solid'}
          flex={1}
          sx={{
            transition: 'all .3s',
            visibility: leadsVisible ? 'visible' : 'hidden',
            display: 'none',
          }}
        ></Stack>
      )}
    </Stack>
  );
};
