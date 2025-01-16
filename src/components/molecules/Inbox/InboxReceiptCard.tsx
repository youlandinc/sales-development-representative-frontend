import { FC, useRef } from 'react';
import { Avatar, Fade, Stack, Typography } from '@mui/material';

import { useSwitch } from '@/hooks';

import { StyledButton } from '@/components/atoms';
import {
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';

import { InboxContentTypeEnum, useInboxStore } from '@/stores/useInboxStore';

export const InboxReceiptCard: FC = () => {
  const { setInboxContentType, setForwardContent } = useInboxStore(
    (state) => state,
  );

  const { visible, open, close } = useSwitch();
  const editorRef = useRef<InboxEditorForwardRefProps | null>(null);

  return (
    <Stack>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Typography color={'#6F6C7D'} component={'span'} variant={'subtitle3'}>
          TO:
        </Typography>
        <Avatar sx={{ bgcolor: 'red', height: 24, width: 24, fontSize: 12 }}>
          R
        </Avatar>
        <Typography component={'span'} variant={'subtitle2'}>
          Shawnmanning@gmail.com
        </Typography>
      </Stack>
      <Stack gap={3} p={1.5}>
        <Typography color={'#6F6C7D'} component={'p'} variant={'subtitle3'}>
          Elementum varius nisi vel tempus. Donec eleifend egestas viverra.
        </Typography>
        <Typography variant={'body3'}>
          Hello Dear Sir Good Morning, Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Curabitur non diam facilisis, commodo libero et,
          commodo sapien. Pellentesque sollicitudin massa sagittis dolor
          facilisis, sit amet vulputate nunc molestie. Pellentesque maximus nibh
          id luctus porta. Ut consectetur dui nec nulla mattis luctus. Donec
          nisi diam, congue vitae felis at, ullamcorper bibendum tortor.
          Vestibulum pellentesque felis felis. Etiam ac tortor felis. Ut elit
          arcu, rhoncus in laoreet vel, gravida sed tortor. In elementum varius
          nisi vel tempus. Donec eleifend egestas viverra. Donec dapibus
          sollicitudin blandit. Donec scelerisque purus sit amet feugiat
          efficitur. Quisque feugiat semper sapien vel hendrerit. Mauris lacus
          felis, consequat nec pellentesque viverra, venenatis a lorem. Sed urna
          lectus.Quisque feugiat semper sapien vel hendrerit
        </Typography>
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
                  '<p><span style="color:#866bfb">Here is the forwarded email:</span></p>' +
                    '<p><span style="color:#866bfb">Sender: Richard Jia richard@Youland.com </span></p>' +
                    '<p><span style="color:#866bfb">Subject: FW: 11x Demo </span></p>' +
                    '<p><span style="color:#866bfb">Date: January 16, 2025, 02:31:27 GMT+8 </span></p>' +
                    '<p><span style="color:#866bfb">Recipient: Stanley stanley@Youland.com </span></p>' +
                    '<p><span style="color:#866bfb">Cc: Warren Jia warren@Youland.com, Rico Shen rico@Youland.com, Pran fan@Youland.com</span></p>' +
                    '<p>&nbsp;</p><p><span style="font-size:12px"><strong>Elementum varius nisi vel tempus. Donec eleifend egestas viverra.</strong></span></p>' +
                    '<p>&nbsp;</p>' +
                    '<p><span style="font-size:12px">Hello Dear Sir Good Morning, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non diam facilisis, commodo libero et, commodo sapien. Pellentesque sollicitudin massa sagittis dolor facilisis, sit amet vulputate nunc molestie. Pellentesque maximus nibh id luctus porta. Ut consectetur dui nec nulla mattis luctus. Donec nisi diam, congue vitae felis at, ullamcorper bibendum tortor. Vestibulum pellentesque felis felis. Etiam ac tortor felis. Ut elit arcu, rhoncus in laoreet vel, gravida sed tortor. In elementum varius nisi vel tempus. Donec eleifend egestas viverra. Donec dapibus sollicitudin blandit. Donec scelerisque purus sit amet feugiat efficitur. Quisque feugiat semper sapien vel hendrerit. Mauris lacus felis, consequat nec pellentesque viverra, venenatis a lorem. Sed urna lectus.Quisque feugiat semper sapien vel hendrerit</span></p>',
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
