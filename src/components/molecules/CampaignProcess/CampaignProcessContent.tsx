import { useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { StyledTextField } from '@/components/atoms';

import ICON_SEND from './assets/icon_send.svg';
import { useDialogStore } from '@/stores/useDialogStore';

export const CampaignProcessContent = () => {
  const { activeStep } = useDialogStore();

  const [showLeads, setShowLeads] = useState(false);

  const [content, setContent] = useState('');
  const [showContent, setShowContent] = useState(false);

  const onClickToSendMessage = () => {
    setShowContent(!showContent);
    setShowLeads(!showLeads);
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
        border={'1px solid'}
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
          maxWidth={showContent ? '100%' : 768}
          minHeight={100}
          pb={1.5}
          px={1.5}
          sx={{ transition: 'all .3s' }}
          width={'100%'}
        >
          <StyledTextField
            multiline
            onChange={(e) => setContent(e.target.value)}
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
            value={content}
          />

          <Stack
            alignItems={'center'}
            bgcolor={'#BABCBE'}
            borderRadius={'50%'}
            height={32}
            justifyContent={'center'}
            ml={'auto'}
            onClick={onClickToSendMessage}
            sx={{ cursor: 'pointer' }}
            width={32}
          >
            <Icon component={ICON_SEND} sx={{ width: 24, height: 24 }} />
          </Stack>
        </Stack>
      </Stack>

      {activeStep === 1 ? (
        <Stack
          border={'1px solid'}
          height={'100%'}
          sx={{
            transition: 'all .3s',
            visibility: showLeads ? 'visible' : 'hidden',
          }}
          width={showLeads ? 360 : 0}
        ></Stack>
      ) : (
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
