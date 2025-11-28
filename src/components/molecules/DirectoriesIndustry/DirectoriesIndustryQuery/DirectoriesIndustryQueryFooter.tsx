import { FC, useMemo, useState } from 'react';
import { Icon, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import useSWR from 'swr';

import { useSwitch } from '@/hooks';

import { useDirectoriesStore } from '@/stores/directories';
import { buildSearchRequestParams } from '@/utils/directories';
import { DirectoriesBizIdEnum } from '@/types/directories';
import {
  _fetchPlanCredits,
  _importDirectoriesDataToTable,
} from '@/request/directories';

import { HttpError } from '@/types';
import { CreditTypeEnum } from '@/types/pricingPlan';

import { SDRToast, StyledButton, StyledDialog } from '@/components/atoms';

import ICON_CLOSE from './assets/icon-close.svg';

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

  const onContinueToImport = async () => {
    if (isImporting || !requestParams) {
      return;
    }

    try {
      setIsImporting(true);

      const { data } = await _importDirectoriesDataToTable(requestParams);

      console.log(data);

      //if (data.tableId) {
      //  router.push(`/prospect-enrich/${data.tableId}`);
      //}

      // TODO: access not enough show dialog
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setIsImporting(false);
    }
  };

  const onClickToConfirmContinue = () => {};

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
            <Typography
              sx={{
                fontSize: 14,
                color: 'text.secondary',
              }}
            >
              Only {remainingCredits} of the {accessRecordCount} requested
              records can be retrieved with your current balance.{' '}
              {remainingCredits} tokens will be deducted.
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: 'text.secondary',
              }}
            >
              Are you sure you want to proceed?
            </Typography>
          </Stack>
        }
        footer={
          <Stack sx={{ flexDirection: 'row', gap: 1.5 }}>
            <StyledButton
              onClick={() => close()}
              size={'medium'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              onClick={() => onClickToConfirmContinue()}
              size={'medium'}
            >
              Continue
            </StyledButton>
          </Stack>
        }
        header={
          <Stack sx={{ flexDirection: 'row', alignItem: 'center' }}>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              Access limited by available tokens
            </Typography>
            <Icon
              component={ICON_CLOSE}
              onClick={() => close()}
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
        onClose={() => close()}
        open={visible}
      />
    </>
  );
};
