import { FC, ReactNode, useRef } from 'react';
import { Fade, Stack, Typography } from '@mui/material';

import { useSwitch } from '@/hooks';

import { StyledButton } from '@/components/atoms';
import {
  CommonEmailContent,
  CommonReceiptCardHeader,
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';

import { InboxContentTypeEnum, useInboxStore } from '@/stores/useInboxStore';

type InboxReceiptCardProps = {
  avatarName?: string;
  avatarBgcolor?: string;
  email: ReactNode;
  emailContent: string;
};

export const InboxReceiptCard: FC<InboxReceiptCardProps> = ({
  avatarBgcolor,
  avatarName,
  email,
  emailContent,
}) => {
  const { setInboxContentType, setForwardContent } = useInboxStore(
    (state) => state,
  );

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
            TO:
          </Typography>
        }
      />
      <Stack gap={1.5} p={1.5}>
        <CommonEmailContent
          content={emailContent}
          style={'p {font-size:12px;margin:0;line-height:1.8;}'}
        />
        <Fade in={!visible}>
          <Stack
            display={visible ? 'none' : 'flex'}
            flexDirection={'row'}
            gap={1.5}
          >
            <StyledButton
              onClick={open}
              size={'medium'}
              sx={{ px: '12px !important' }}
            >
              Reply
            </StyledButton>
            <StyledButton
              onClick={() => {
                setInboxContentType(InboxContentTypeEnum.forward);
                setForwardContent(
                  '<p><span style="font-size:12px"><span style="color:#866bfb">Here is the forwarded email:</span></span></p>' +
                    '<p><span style="font-size:12px"><span style="color:#866bfb">Sender: Richard Jia richard@Youland.com </span></span></p>' +
                    '<p><span style="font-size:12px"><span style="color:#866bfb">Subject: FW: 11x Demo </span></span></p>' +
                    '<p><span style="font-size:12px"><span style="color:#866bfb">Date: January 16, 2025, 02:31:27 GMT+8 </span></span></p>' +
                    '<p><span style="font-size:12px"><span style="color:#866bfb">Recipient: Stanley stanley@Youland.com </span></span></p>' +
                    '<p><span style="font-size:12px"><span style="color:#866bfb">Cc: Warren Jia warren@Youland.com, Rico Shen rico@Youland.com, Pran fan@Youland.com</span></span></p>' +
                    '<p>&nbsp;</p>' +
                    '<p><span style="font-size:12px"><strong>Elementum varius nisi vel tempus. Donec eleifend egestas viverra.</strong></span></p>' +
                    '<p>&nbsp;</p>' +
                    '<p><span style="font-size:12px">Hello </span></p>' +
                    '<p><span style="font-size:12px">Dear Sir Good Morning, </span></p>' +
                    '<p><span style="font-size:12px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non diam facilisis, commodo libero et, commodo sapien. Pellentesque sollicitudin massa sagittis dolor facilisis, sit amet vulputate nunc molestie. Pellentesque maximus nibh id luctus porta. Ut consectetur dui nec nulla mattis luctus. Donec nisi diam, congue vitae felis at, ullamcorper bibendum tortor. Vestibulum pellentesque felis felis. Etiam ac tortor felis. Ut elit arcu, rhoncus in laoreet vel, gravida sed tortor.</span></p>' +
                    '<p><span style="font-size:12px">In elementum varius nisi vel tempus. Donec eleifend egestas viverra. Donec dapibus sollicitudin blandit. Donec scelerisque purus sit amet feugiat efficitur. Quisque feugiat semper sapien vel hendrerit. Mauris lacus felis, consequat nec pellentesque viverra, venenatis a lorem. Sed urna lectus.Quisque feugiat semper sapien vel hendrerit</span></p>',
                );
              }}
              size={'medium'}
              sx={{ px: '12px !important' }}
              variant={'outlined'}
            >
              Forward
            </StyledButton>
          </Stack>
        </Fade>
        <Fade in={visible}>
          <Stack display={visible ? 'flex' : 'none'} gap={1.5}>
            <InboxEditor ref={editorRef} />
            <Stack flexDirection={'row'} gap={1.5} justifyContent={'flex-end'}>
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
                Send
              </StyledButton>
            </Stack>
          </Stack>
        </Fade>
      </Stack>
    </Stack>
  );
};
