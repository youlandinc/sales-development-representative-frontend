import { FC, useRef } from 'react';
import { Fade, Stack } from '@mui/material';
import { format } from 'date-fns';

import { useAsyncFn, useSwitch } from '@/hooks';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  CommonEmailContent,
  CommonReceiptCardHeader,
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';

import {
  InboxContentTypeEnum,
  ReceiptTypeEnum,
  useInboxStore,
} from '@/stores/useInboxStore';
import { _replyEmails, ForwardEmailsParam } from '@/request';
import { HttpError } from '@/types';

type InboxReceiptCardProps = {
  avatarName?: string;
  avatarBgcolor?: string;
  email: string;
  emailContent: string;
  emailType: ReceiptTypeEnum;
  emailId: number;
  avatarSrc: string;
};

export const InboxReceiptCard: FC<InboxReceiptCardProps> = ({
  avatarBgcolor,
  avatarName,
  email,
  emailContent,
  emailId,
  avatarSrc,
}) => {
  const {
    setInboxContentType,
    setForwardContent,
    selectedEmail,
    setForwardReceipt,
    setForwardEmailId,
  } = useInboxStore((state) => state);

  const { visible, open, close } = useSwitch();
  const editorRef = useRef<InboxEditorForwardRefProps | null>(null);

  const [state, replyEmail] = useAsyncFn(async (param: ForwardEmailsParam) => {
    try {
      await _replyEmails(param);
      close();
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  return (
    <Stack
      border={'1px solid'}
      borderColor={'border.default'}
      borderRadius={4}
      gap={1}
      p={1.5}
    >
      <CommonReceiptCardHeader
        avatarBgcolor={avatarBgcolor}
        avatarName={avatarName}
        avatarSrc={avatarSrc?.length > 0 ? avatarSrc : undefined}
        email={email}
      />
      <Stack gap={1.5} p={1.5}>
        <CommonEmailContent
          content={emailContent}
          style={'* {font-size:12px;margin:0;line-height:1.8;}'}
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
                    `<p><span style="font-size:12px"><span style="color:#866bfb">Sender: ${selectedEmail?.email}</span></span></p>` +
                    `<p><span style="font-size:12px"><span style="color:#866bfb">Subject: ${selectedEmail?.subject}</span></span></p>` +
                    `<p><span style="font-size:12px"><span style="color:#866bfb">Date: ${typeof selectedEmail?.sentOn === 'string' ? format(new Date(selectedEmail.sentOn), 'MMMM dd, yyyy, HH:mm:ss') : ''}</span></span></p>` +
                    `<p><span style="font-size:12px"><span style="color:#866bfb">Recipient: ${email || ''}</span></span></p>` +
                    '<p>&nbsp;</p>' +
                    emailContent,
                );
                setForwardReceipt(email || '');
                setForwardEmailId(emailId);
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
                loading={state.loading}
                onClick={async () => {
                  await replyEmail({
                    emailId: emailId,
                    recipient: email,
                    cc: [],
                    subject: '',
                    content: editorRef.current?.editInstance.getData() || '',
                  });
                }}
                size={'medium'}
                sx={{ px: '12px !important', width: 56 }}
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
