import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { debounce, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import {
  CampaignsStatusBadge,
  CommonRenameTextField,
} from '@/components/molecules';
import { SDRToast, StyledButton, StyledDialog } from '@/components/atoms';

import { CampaignStatusEnum, HttpError } from '@/types';

import {
  _approveAllCampaignPendingEmail,
  _renameCampaign,
  _suspendCampaignPendingEmail,
} from '@/request';

import ICON_ARROW from './assets/icon_arrow.svg';
import { useAsyncFn, useSwitch } from '@/hooks';
import { usePendingApprovalStore } from '@/stores/usePendingApprovalStore';

type CampaignsPendingHeaderProps = {
  campaignName: string;
  campaignStatus: CampaignStatusEnum;
  campaignId: number;
  cb?: () => Promise<any>;
  loading?: boolean;
};

export const CampaignsPendingHeader: FC<CampaignsPendingHeaderProps> = ({
  campaignName,
  campaignStatus,
  campaignId,
  cb,
  loading,
}) => {
  const { setIsNoData } = usePendingApprovalStore((state) => state);

  const router = useRouter();
  const [title, setTitle] = useState('');
  const { visible, open, close } = useSwitch();
  const {
    visible: suspendShow,
    open: suspendOpen,
    close: suspendClose,
  } = useSwitch();

  const [approveState, approve] = useAsyncFn(async () => {
    try {
      await _approveAllCampaignPendingEmail(campaignId);
      setIsNoData(true);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [campaignId]);

  const [suspendState, suspend] = useAsyncFn(
    async (active: boolean) => {
      try {
        await _suspendCampaignPendingEmail(campaignId, active);
        await cb?.();
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [campaignId],
  );

  const [, renameCampaign] = useAsyncFn(
    async (campaignName: string) => {
      if (!campaignId) {
        return;
      }
      try {
        await _renameCampaign({
          campaignId,
          campaignName: campaignName || 'Untitled Campaign',
        });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({
          message,
          header,
          variant,
        });
      }
    },
    [campaignId],
  );

  const debounceRename = useMemo(
    () =>
      debounce(async (value) => {
        await renameCampaign(value);
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    await debounceRename(value);
  };

  useEffect(() => {
    setTitle(campaignName);
  }, [campaignName]);

  return (
    <Stack
      borderBottom={'1px solid #DFDEE6'}
      flexDirection={'row'}
      height={93}
      justifyContent={'space-between'}
      pb={1.5}
      pt={4}
      px={6}
    >
      <Stack alignItems={'center'} flexDirection={'row'} gap={3} lineHeight={0}>
        <Stack
          height={'100%'}
          justifyContent={'center'}
          onClick={() => {
            router.push('/campaigns');
          }}
          sx={{ cursor: 'pointer' }}
        >
          <Icon component={ICON_ARROW} sx={{ width: 20, height: 20 }} />
        </Stack>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
          <CommonRenameTextField
            // defaultValue={campaignName}
            onChange={onChange}
            slotProps={{
              input: {
                onBlur: (e) => {
                  if (e.target.value === '') {
                    setTitle('Untitled campaign');
                  }
                },
              },
            }}
            value={title}
          />
          {!loading && (
            <CampaignsStatusBadge status={campaignStatus} sx={{ py: 0.5 }} />
          )}
        </Stack>
      </Stack>
      {!loading && (
        <Stack flexDirection={'row'} gap={3}>
          {campaignStatus !== CampaignStatusEnum.suspended &&
            campaignStatus !== CampaignStatusEnum.done && (
              <>
                <StyledButton
                  color={'error'}
                  // loading={suspendState.loading}
                  onClick={suspendOpen}
                  sx={{ width: 108 }}
                  variant={'outlined'}
                >
                  Suspend
                </StyledButton>
                <StyledButton
                  // loading={approveState.loading}
                  onClick={open}
                  sx={{ width: 125 }}
                >
                  Approve all
                </StyledButton>
              </>
            )}
          {campaignStatus === CampaignStatusEnum.suspended && (
            <StyledButton
              loading={suspendState.loading}
              onClick={async () => {
                await suspend(true);
              }}
              sx={{ width: 125 }}
            >
              Activate
            </StyledButton>
          )}
        </Stack>
      )}
      <StyledDialog
        content={
          <Typography py={2.25} variant={'body2'}>
            This action cannot be undone, and all selected emails will be
            permanently approved.
          </Typography>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5}>
            <StyledButton
              color={'info'}
              onClick={close}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              loading={approveState.loading}
              onClick={async () => {
                // noinspection JSIgnoredPromiseFromCall
                await approve();
                close();
              }}
              size={'medium'}
              sx={{ width: 90 }}
            >
              Approve all
            </StyledButton>
          </Stack>
        }
        header={'Do you want to approve all emails?'}
        open={visible}
      />
      <StyledDialog
        content={
          <Typography py={2.25} variant={'body2'}>
            This action cannot be undone, and you will no longer be able to edit
            this campaign.
          </Typography>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5}>
            <StyledButton
              color={'info'}
              onClick={suspendClose}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              color={'error'}
              loading={suspendState.loading}
              onClick={async () => {
                // noinspection JSIgnoredPromiseFromCall
                await suspend(false);
                suspendClose();
              }}
              size={'medium'}
              sx={{ width: 80 }}
            >
              Suspend
            </StyledButton>
          </Stack>
        }
        header={'Do you want to cancel sending all emails?'}
        open={suspendShow}
      />
    </Stack>
  );
};
