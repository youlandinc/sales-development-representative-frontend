import { FC, useMemo, useState } from 'react';
import { Icon, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import useSWR from 'swr';

import { useSwitch } from '@/hooks';

import { useDirectoriesStore } from '@/stores/directories';
import { buildSearchRequestParams } from '@/utils/directories';
import {
  _fetchPlanCredits,
  _importDirectoriesDataToTable,
} from '@/request/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';
import { CreditTypeEnum } from '@/types/pricingPlan';
import { HttpError } from '@/types';

import { SDRToast, StyledButton, StyledDialog } from '@/components/atoms';

import ICON_CLOSE from './assets/icon-close.svg';

const DIALOG_TEXT_SX = {
  fontSize: 14,
  color: 'text.secondary',
} as const;

export const DirectoriesIndustryQueryFooter: FC = () => {
  const router = useRouter();
  const { open, visible, close } = useSwitch(false);

  const {
    bizId,
    isLoadingConfig,
    isLoadingPreview,
    hasSubmittedSearch,
    previewBody,
    lastSearchParams,
  } = useDirectoriesStore(
    useShallow((state) => ({
      bizId: state.bizId,
      isLoadingConfig: state.isLoadingConfig,
      isLoadingPreview: state.isLoadingPreview,
      hasSubmittedSearch: state.hasSubmittedSearch,
      previewBody: state.previewBody,
      lastSearchParams: state.lastSearchParams,
    })),
  );

  const [isImporting, setIsImporting] = useState(false);

  const { isLoading: isLoadingCredits, data: creditsResponse } = useSWR(
    bizId ? ['plan-credits', bizId] : null,
    () => _fetchPlanCredits(bizId as DirectoriesBizIdEnum),
  );
  const {
    remainingCredits = 0,
    totalCredits = 0,
    planLimitRecordCount = 0,
    creditType = CreditTypeEnum.full_access,
  } = creditsResponse?.data ?? {};

  const isDisabled =
    !bizId ||
    isImporting ||
    isLoadingConfig ||
    isLoadingPreview ||
    !hasSubmittedSearch ||
    isLoadingCredits ||
    previewBody.findCount === 0;

  const requestParams = useMemo(
    () =>
      lastSearchParams ? buildSearchRequestParams(lastSearchParams) : null,
    [lastSearchParams],
  );

  const accessRecordCount = Math.min(
    requestParams?.limit ?? planLimitRecordCount ?? 0,
    planLimitRecordCount ?? 0,
  );

  const [dialogState, setDialogState] = useState({
    remainingCredit: 0,
    requestAmount: 0,
    type: 'insufficient' as 'insufficient' | 'empty',
  });

  const onContinueToImport = async () => {
    if (isImporting || !requestParams) {
      return;
    }

    try {
      setIsImporting(true);

      const { data } = await _importDirectoriesDataToTable(requestParams);

      if (data.tableId) {
        router.push(`/enrichment/${data.tableId}`);
      } else {
        const remaining = data?.remainingCredit || 0;
        setDialogState({
          remainingCredit: remaining,
          requestAmount: data?.actualNeedCredit || 0,
          type: remaining === 0 ? 'empty' : 'insufficient',
        });
        open();
      }
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setIsImporting(false);
    }
  };

  const [isConfirming, setIsConfirming] = useState(false);

  const onClickToCloseDialog = () => {
    if (isConfirming) {
      return;
    }
    close();
  };

  const onClickToConfirmContinue = async () => {
    if (isImporting || !requestParams || isConfirming) {
      return;
    }
    if (dialogState.type === 'insufficient') {
      setIsConfirming(true);
      try {
        const { data } = await _importDirectoriesDataToTable({
          ...requestParams,
          userRemainingImport: true,
        });
        router.push(`/enrichment/${data.tableId}`);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setIsImporting(false);
        setIsConfirming(false);
      }
    } else {
      router.push(`/plans?bizId=${bizId}`);
    }
  };

  return (
    <>
      <Stack
        sx={{
          px: 3,
          py: 1.5,
          borderTop: '1px solid #DFDEE6',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        {creditType === CreditTypeEnum.record && (
          <Stack sx={{ fontSize: 14, color: 'primary.main', gap: 0.25 }}>
            {remainingCredits} / {totalCredits}{' '}
            {remainingCredits === 1 ? 'record' : 'records'} left
            <LinearProgress
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: '#EAE9EF',
                width: 120,
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#363440',
                  borderRadius: 1,
                },
              }}
              value={
                totalCredits && totalCredits > 0 && remainingCredits !== null
                  ? ((remainingCredits ?? 0) / totalCredits) * 100
                  : 0
              }
              variant="determinate"
            />
          </Stack>
        )}

        <StyledButton
          disabled={isDisabled}
          loading={isImporting || isLoadingCredits}
          onClick={onContinueToImport}
          size={'medium'}
          sx={{
            ml: 'auto',
            flexShrink: 0,
          }}
        >
          {creditType === CreditTypeEnum.full_access
            ? 'Continue'
            : `Access ${accessRecordCount} ${accessRecordCount === 1 ? 'record' : 'records'}`}
        </StyledButton>
      </Stack>
      <StyledDialog
        content={
          <Stack sx={{ py: 2.25, gap: 1.5 }}>
            {dialogState.type === 'insufficient' ? (
              <>
                <Typography sx={DIALOG_TEXT_SX}>
                  Only {dialogState.remainingCredit} of the{' '}
                  {dialogState.requestAmount} requested records can be retrieved
                  with your current balance.
                </Typography>
                <Typography sx={DIALOG_TEXT_SX}>
                  Are you sure you want to proceed?
                </Typography>
              </>
            ) : (
              <>
                <Typography sx={DIALOG_TEXT_SX}>
                  You&#39;ve used all your available records.
                </Typography>
                <Typography sx={DIALOG_TEXT_SX}>
                  Upgrade your plan to continue accessing full details.
                </Typography>
              </>
            )}
          </Stack>
        }
        footer={
          <Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
            <StyledButton
              onClick={onClickToCloseDialog}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={isConfirming}
              loading={isConfirming}
              onClick={onClickToConfirmContinue}
              size={'medium'}
            >
              {dialogState.type === 'insufficient'
                ? 'Continue'
                : 'Upgrade plan'}
            </StyledButton>
          </Stack>
        }
        header={
          <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {dialogState.type === 'insufficient'
                ? 'Access limited by available tokens'
                : 'No records remaining'}
            </Typography>
            <Icon
              component={ICON_CLOSE}
              onClick={onClickToCloseDialog}
              sx={{
                width: 24,
                height: 24,
                cursor: 'pointer',
                ml: 'auto',
                flexShrink: 0,
              }}
            />
          </Stack>
        }
        onClose={onClickToCloseDialog}
        open={visible}
      />
    </>
  );
};
