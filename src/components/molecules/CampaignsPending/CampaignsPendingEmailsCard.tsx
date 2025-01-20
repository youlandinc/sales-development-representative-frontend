import { FC, ReactNode, useRef } from 'react';
import { Box, Fade, Icon, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import { useSwitch } from '@/hooks';

import { StyledButton } from '@/components/atoms';
import {
  CommonEmailContent,
  CommonReceiptCardHeader,
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';

import ICON_CALENDAR from './assets/icon_calendar.svg';

type CampaignsPendingEmailsCardProps = {
  avatarName?: string;
  avatarBgcolor?: string;
  email: ReactNode;
  emailContent: string;
};

export const CampaignsPendingEmailsCard: FC<
  CampaignsPendingEmailsCardProps
> = ({ avatarBgcolor, avatarName, email, emailContent }) => {
  // const { setInboxContentType, setForwardContent, receiptType } = useInboxStore(
  //   (state) => state,
  // );

  const { visible, open, close } = useSwitch();
  const editorRef = useRef<InboxEditorForwardRefProps | null>(null);

  return (
    <Stack gap={1}>
      <CommonReceiptCardHeader
        avatarBgcolor={avatarBgcolor}
        avatarName={avatarName}
        email={email}
        prefix={
          <Typography
            color={'#6F6C7D'}
            component={'span'}
            variant={'subtitle3'}
          >
            TO
          </Typography>
        }
        time={
          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
            <Icon component={ICON_CALENDAR} sx={{ width: 16, height: 16 }} />
            <Typography color={'#637381'} component={'div'} variant={'body3'}>
              {format(new Date(), 'MM/dd/yyyy')}
            </Typography>
          </Stack>
        }
      />
      <Stack gap={1.5} p={1.5}>
        {visible ? (
          <Fade in={visible}>
            <Box>
              <InboxEditor ref={editorRef} />
            </Box>
          </Fade>
        ) : (
          <CommonEmailContent
            content={emailContent}
            style={'p {font-size:12px;margin:0;line-height:1.8;}'}
          />
        )}

        <Stack flexDirection={'row'} gap={1.5} justifyContent={'flex-end'}>
          <StyledButton
            onClick={open}
            size={'medium'}
            sx={{ px: '12px !important' }}
            variant={'outlined'}
          >
            Rewrite
          </StyledButton>
          {!visible ? (
            <>
              <StyledButton
                onClick={open}
                size={'medium'}
                sx={{ px: '12px !important' }}
                variant={'outlined'}
              >
                Edit
              </StyledButton>
              <StyledButton
                onClick={open}
                size={'medium'}
                sx={{ px: '12px !important' }}
              >
                Approve
              </StyledButton>
            </>
          ) : (
            <>
              <Box bgcolor={'#DFDEE6'} width={'1px'}></Box>
              <StyledButton
                color={'info'}
                onClick={close}
                size={'medium'}
                sx={{ px: '12px !important' }}
                variant={'outlined'}
              >
                Cancel
              </StyledButton>
              <StyledButton
                onClick={open}
                size={'medium'}
                sx={{ px: '12px !important' }}
              >
                Confirm & save
              </StyledButton>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
