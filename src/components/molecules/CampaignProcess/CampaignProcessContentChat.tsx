import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { SDRToast, StyledTextField } from '@/components/atoms';
import { CampaignProcessContentChatServerCard } from '@/components/molecules';

import { HttpError, SourceEnum } from '@/types';
import { _sendChatMessage } from '@/request';

import ICON_SEND from './assets/icon_send.svg';

export const CampaignProcessContentChat: FC = () => {
  const {
    chatId,
    activeStep,
    setChatId,
    createChatSSE,
    messageList,
    returning,
    setReturning,
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
      addMessageItem({ message, source: SourceEnum.user, id: '', data: [] });
      const {
        data: { chatId: resChatId },
      } = await _sendChatMessage(postData);
      addMessageItem({
        isFake: true,
        source: SourceEnum.server,
        data: [],
        id: '-1',
        message: '',
      });
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

  return (
    <Stack
      alignItems={'center'}
      border={'1px solid'}
      borderColor={activeStep === 1 ? 'transparent' : '#DFDEE6'}
      gap={4}
      justifyContent={messageList.length > 0 ? 'unset' : 'center'}
      maxWidth={activeStep === 1 ? '100%' : 460}
      minWidth={460}
      mt={3}
      pb={activeStep === 1 ? 0 : 6}
      pt={activeStep === 1 ? 0 : 3}
      sx={{
        transition: 'all .3s',
        overflow: 'hidden',
        borderTopLeftRadius: activeStep === 1 ? '8px' : '16px',
        borderTopRightRadius: activeStep === 1 ? '8px' : '16px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
      }}
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
            <Typography textAlign={'center'} variant={'h5'}>
              Define your target audience
            </Typography>
            <Typography textAlign={'center'}>
              Describe your ideal customer (industry, demographics, interests)
            </Typography>
            {/*<Typography>or upload a CSV with your contact list.</Typography>*/}
          </>
        ) : (
          <Stack
            gap={3}
            height={'100%'}
            px={activeStep === 1 ? 0 : 3}
            ref={messageBoxRef}
            sx={{ overflow: 'auto' }}
            width={'100%'}
          >
            {messageList.map((item, index) => (
              <Stack
                key={`${index}`}
                maxWidth={activeStep === 1 ? '60%' : '80%'}
                ml={item.source === SourceEnum.user ? 'auto' : 'unset'}
                width={'fit-content'}
              >
                {item.source === SourceEnum.user ? (
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
                  <CampaignProcessContentChatServerCard
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
        alignSelf={'center'}
        bgcolor={'#F8F8FA'}
        borderRadius={4}
        component={'form'}
        flexShrink={0}
        height={150}
        maxWidth={messageList.length > 0 ? '100%' : 768}
        pb={1.5}
        px={1.5}
        sx={{ transition: 'all .3s' }}
        width={activeStep === 1 ? '100%' : 'calc(100% - 48px)'}
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
          bgcolor={
            sending || returning || !inputValue.trim()
              ? 'background.disabled'
              : 'primary.main'
          }
          borderRadius={'50%'}
          height={32}
          justifyContent={'center'}
          ml={'auto'}
          onClick={sendMessage}
          sx={{
            cursor:
              sending || returning || !inputValue.trim()
                ? 'default'
                : 'pointer',
            transition: 'all .3s',
          }}
          width={32}
        >
          <Icon component={ICON_SEND} sx={{ width: 24, height: 24 }} />
        </Stack>
      </Stack>
    </Stack>
  );
};
