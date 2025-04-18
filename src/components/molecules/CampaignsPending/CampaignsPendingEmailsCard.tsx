import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Box, Fade, Skeleton, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import { useAsyncFn, useSwitch } from '@/hooks';

import {
  SDRToast,
  StyledButton,
  StyledTextFilledField,
} from '@/components/atoms';
import {
  CommonCampaignUserInfo,
  CommonEmailContent,
  CommonReceiptCardHeader,
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';

import {
  _approveCampaignPendingEmail,
  _editCampaignPendingEmail,
  _rewriteCampaignPendingEmail,
} from '@/request';
import { HttpError } from '@/types';

import { usePendingApprovalStore } from '@/stores/usePendingApprovalStore';

type CampaignsPendingEmailsCardProps = {
  avatarName?: string;
  avatarBgcolor?: string;
  avatarUrl?: string;
  email: ReactNode;
  emailContent: string;
  time: string;
  emailId: number;
  subject: string;
  showStepNumber?: boolean;
  stepNumber: number;
  leadId: number;
};

export const CampaignsPendingEmailsCard: FC<
  CampaignsPendingEmailsCardProps
> = ({
  avatarBgcolor,
  avatarName,
  email,
  emailContent,
  time,
  emailId,
  subject,
  avatarUrl,
  showStepNumber,
  stepNumber,
  leadId,
}) => {
  const {
    updatePendingEmailById,
    deletePendingEmailById,
    setTotalEmails,
    totalEmails,
  } = usePendingApprovalStore((state) => state);

  const { visible, open, close } = useSwitch();
  const [clickType, setClickType] = useState<'approve' | 'delete'>('approve');
  const {
    visible: drawerShow,
    open: drawerOpen,
    close: drawerClose,
  } = useSwitch();
  const [subjectValue, setSubjectValue] = useState(subject);
  useEffect(() => {
    setSubjectValue(subject);
  }, [subject]);
  const editorRef = useRef<InboxEditorForwardRefProps | null>(null);

  const [rewriteState, rewrite] = useAsyncFn(async () => {
    try {
      const {
        data: { subject, content },
      } = await _rewriteCampaignPendingEmail(emailId);
      updatePendingEmailById(emailId, subject, content);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [emailId]);

  const [approveState, approve] = useAsyncFn(
    async (isApprove: boolean) => {
      try {
        await _approveCampaignPendingEmail(emailId, isApprove);
        deletePendingEmailById(emailId);
        setTotalEmails(totalEmails - 1);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [emailId, clickType],
  );

  const [editState, edit] = useAsyncFn(
    async (param: { emailId: number; subject: string; content: string }) => {
      try {
        await _editCampaignPendingEmail(param);
        updatePendingEmailById(param.emailId, param.subject, param.content);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [],
  );

  return (
    <>
      <Stack gap={1}>
        <CommonReceiptCardHeader
          avatarBgcolor={avatarBgcolor}
          avatarName={avatarName}
          avatarSrc={avatarUrl}
          avatarSx={{ cursor: 'pointer' }}
          email={email}
          handleAvatarClick={drawerOpen}
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
            time && (
              <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                {/*<Icon component={ICON_CALENDAR} sx={{ width: 16, height: 16 }} />*/}
                <Typography
                  color={'#637381'}
                  component={'div'}
                  variant={'body3'}
                >
                  Scheduled send time: {format(time, 'MM/dd/yyyy')}
                </Typography>
              </Stack>
            )
          }
        />
        <Stack gap={1.5} p={1.5}>
          <Stack gap={1.5}>
            {!visible ? (
              <Typography fontWeight={600} lineHeight={1.4} variant={'body3'}>
                <Box color={'text.secondary'} component={'span'}>
                  {showStepNumber ? `Step ${stepNumber}: ` : ' '}
                </Box>
                {rewriteState.loading ? <Skeleton /> : subject}
              </Typography>
            ) : (
              <StyledTextFilledField
                label={'Subject:'}
                onChange={(e) => {
                  setSubjectValue(e.target.value);
                }}
                value={subjectValue}
              />
            )}
            {!visible && (
              <Box position={'relative'}>
                {rewriteState.loading && (
                  <Box
                    bottom={0}
                    height={'100%'}
                    left={0}
                    position={'absolute'}
                    right={0}
                    sx={{
                      '& .MuiSkeleton-root': { height: '100%' },
                      bgcolor: 'background.white',
                    }}
                    top={0}
                  >
                    <Skeleton variant={'rectangular'} />
                  </Box>
                )}
                <CommonEmailContent
                  content={`${emailContent}`}
                  style={'* {font-size:12px;margin:0;line-height:1.8;}'}
                />
              </Box>
            )}
          </Stack>
          {visible && (
            <Fade in={true}>
              <Box height={visible ? 'auto' : 0} mb={visible ? 0 : '-12px'}>
                <InboxEditor initData={`${emailContent}`} ref={editorRef} />
              </Box>
            </Fade>
          )}

          <Stack
            flexDirection={'row'}
            gap={1.5}
            justifyContent={'space-between'}
          >
            <StyledButton
              color={'info'}
              loading={approveState.loading && clickType === 'delete'}
              onClick={async () => {
                setClickType('delete');
                await approve(false);
              }}
              size={'medium'}
              sx={{ px: '12px !important', width: 98 }}
              variant={'outlined'}
            >
              Don&#39;t send
            </StyledButton>
            <Stack flexDirection={'row'} gap={1.5}>
              <StyledButton
                loading={rewriteState.loading}
                onClick={rewrite}
                size={'medium'}
                sx={{ px: '12px !important', width: 76 }}
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
                    loading={approveState.loading && clickType === 'approve'}
                    onClick={async () => {
                      setClickType('approve');
                      await approve(true);
                    }}
                    size={'medium'}
                    sx={{ px: '12px !important', width: 79 }}
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
                    loading={editState.loading}
                    onClick={async () => {
                      await edit({
                        emailId,
                        subject: subjectValue,
                        content:
                          editorRef.current?.editInstance.getData() || '',
                      });

                      close();
                    }}
                    size={'medium'}
                    sx={{ px: '12px !important', width: 127 }}
                  >
                    Confirm & save
                  </StyledButton>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <CommonCampaignUserInfo
        leadId={leadId}
        onClose={drawerClose}
        open={drawerShow}
      />
    </>
  );
};
