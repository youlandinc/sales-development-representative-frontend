import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import { SDRToast } from '@/components/atoms';

import { useAsyncFn } from '@/hooks';
import { useEnrichmentTableStore } from '@/stores/enrichment';

import { DialogCellDetailsContainer, ValidationStatus } from './base';

import { _fetchTableCellDetails } from '@/request/enrichment';

import { ActiveCellParams } from '@/types/enrichment/base';
import {
  TableCellAIPhaseEnum,
  TableCellMetaDataValidateStatusEnum,
  TableColumnMenuActionEnum,
} from '@/types/enrichment/table';

import ICON_FORK from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_fork.svg';
import ICON_CHECK from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_list_checks.svg';
import ICON_SEARCH from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_search.svg';
import ICON_THINKING from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_thinking.svg';
import ICON_TRAY from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogCellDetailsThinking/icon_tray_arrow_down.svg';

interface DialogCellDetailsThinkingProps {
  cellDetails: ActiveCellParams;
}

const phaseVisualMap: Record<
  TableCellAIPhaseEnum,
  { label: string; icon: typeof ICON_THINKING }
> = {
  [TableCellAIPhaseEnum.thinking]: {
    label: 'Thinking',
    icon: ICON_THINKING,
  },
  [TableCellAIPhaseEnum.searching]: {
    label: 'Searching',
    icon: ICON_SEARCH,
  },
  [TableCellAIPhaseEnum.verifying]: {
    label: 'Verifying',
    icon: ICON_CHECK,
  },
  [TableCellAIPhaseEnum.re_searching]: {
    label: 'Re-Searching',
    icon: ICON_SEARCH,
  },
  [TableCellAIPhaseEnum.standardizing]: {
    label: 'Standardizing',
    icon: ICON_FORK,
  },
  [TableCellAIPhaseEnum.populating]: {
    label: 'Populating',
    icon: ICON_TRAY,
  },
};

/* const formatAttemptOrdinal = (attemptNo?: number) => {
  if (!attemptNo) {
    return '';
  }
  if (attemptNo === 1) {
    return '1st time';
  }
  if (attemptNo === 2) {
    return '2nd time';
  }
  if (attemptNo === 3) {
    return '3rd time';
  }
  return `${attemptNo}th time`;
}; */

export const DialogCellDetailsThinking: FC<DialogCellDetailsThinkingProps> = ({
  cellDetails,
}) => {
  const { dialogType, dialogVisible } = useEnrichmentTableStore(
    useShallow((store) => ({
      dialogType: store.dialogType,
      dialogVisible: store.dialogVisible,
    })),
  );

  const [state, fetchCellDetails] = useAsyncFn(async () => {
    try {
      return await _fetchTableCellDetails(
        cellDetails.columnId,
        cellDetails.rowId,
      );
    } catch (error) {
      const { header, message, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [cellDetails]);

  const status =
    (state?.value?.data?.status as TableCellMetaDataValidateStatusEnum) ||
    TableCellMetaDataValidateStatusEnum.not_validated;

  useEffect(() => {
    if (
      (!cellDetails.columnId || !cellDetails.rowId) &&
      dialogVisible &&
      dialogType === TableColumnMenuActionEnum.cell_detail
    ) {
      return;
    }
    fetchCellDetails();
  }, [cellDetails, dialogType, dialogVisible, fetchCellDetails]);

  return (
    <DialogCellDetailsContainer
      isEmpty={!state?.value?.data?.status}
      loading={state.loading}
    >
      <Stack
        sx={{
          flex: 1,
          gap: 3,
          minHeight: 0,
          overflow: 'auto',
          p: 3,
          pb: 6,
          pt: 0,
        }}
      >
        <Stack gap={1}>
          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography color={'text.secondary'} variant={'h7'}>
              Status:
            </Typography>
            <ValidationStatus status={status} />
          </Stack>

          <Typography color={'text.secondary'} lineHeight={1.2} variant={'h7'}>
            <Box component={'span'} fontWeight={600}>
              Cell content:{' '}
            </Box>
            <Box
              component={'span'}
              fontWeight={400}
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {state?.value?.data?.content}
            </Box>
          </Typography>

          <Typography
            color={'text.secondary'}
            lineHeight={1.4}
            variant={'body2'}
          >
            {state?.value?.data?.validateSummary}
          </Typography>
        </Stack>

        {state?.value?.data?.logs?.length && (
          <Timeline
            sx={{
              p: 0,
              m: 0,
              '& .MuiTimelineItem-root:before': { display: 'none' },
              gap: 3,
            }}
          >
            {state?.value?.data?.logs?.map((log, index) => {
              const phase =
                (log.phase as TableCellAIPhaseEnum) ||
                TableCellAIPhaseEnum.thinking;
              const phaseVisual =
                phaseVisualMap[phase] ||
                phaseVisualMap[TableCellAIPhaseEnum.thinking];
              // const ordinal = formatAttemptOrdinal(log.attemptNo);
              // const showLine =
              //   index < (state?.value?.data?.logs?.length || 0) - 1;

              return (
                <TimelineItem key={`${log.phase}-${index}`}>
                  <TimelineSeparator sx={{ gap: '5px' }}>
                    <TimelineDot
                      sx={{ m: 0, border: 'none', p: 0 }}
                      variant={'outlined'}
                    >
                      <Icon
                        component={phaseVisual.icon}
                        sx={{ width: 20, height: 20 }}
                      />
                    </TimelineDot>

                    <TimelineConnector
                      sx={{ bgcolor: '#D0CEDA', width: '1px' }}
                    />
                  </TimelineSeparator>
                  <TimelineContent sx={{ p: 0, ml: 1, overflow: 'hidden' }}>
                    <Stack gap={1}>
                      <Typography
                        color={'text.secondary'}
                        lineHeight={1.2}
                        variant={'h7'}
                      >
                        {phaseVisual.label}
                        {/*  {ordinal &&
                          log.phase !== TableCellAIPhaseEnum.thinking
                            ? ` (${ordinal})`
                            : ''} */}
                      </Typography>
                      <Typography
                        color={'text.secondary'}
                        lineHeight={1.4}
                        sx={{
                          whiteSpace: 'pre-wrap',
                        }}
                        variant={'body2'}
                      >
                        {log.content}
                      </Typography>
                      {log.sources && log.sources.length > 0 && (
                        <Stack
                          sx={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}
                        >
                          <Typography
                            color={'text.secondary'}
                            lineHeight={1.4}
                            variant={'body2'}
                          >
                            Source:
                          </Typography>
                          {log.sources.map((source, sourceIndex) => (
                            <Stack
                              key={`${source.sourceUrl}-${sourceIndex}`}
                              onClick={() => {
                                window.open(source.sourceUrl, '_blank');
                              }}
                              sx={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '2px',
                                p: '2px 8px',
                                borderRadius: 2,
                                bgcolor: '#E9E9EF',
                                cursor: 'pointer',
                                maxWidth: '100%',
                                '&:hover': {
                                  bgcolor: '#DFDEE6',
                                },
                              }}
                            >
                              <Typography
                                color={'text.secondary'}
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                variant={'body3'}
                              >
                                {source.sourceName}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        )}
      </Stack>
    </DialogCellDetailsContainer>
  );
};
