import { FC } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import useSWR from 'swr';
import { useShallow } from 'zustand/shallow';

import { SDRToast, StyledLoading, StyledSelect } from '@/components/atoms';

import { useDialogStore } from '@/stores/useDialogStore';

import {
  _fetchEnrichmentTableMapping,
  _fetchEnrichmentTableOptions,
  _updateMappingField,
} from '@/request';
import { HttpError } from '@/types';

export const DataSourceAiTable: FC = () => {
  const {
    enrichmentTableOptions,
    fetchEnrichmentTableData,
    createCampaignErrorMessage,
    aiTableFormData,
    setAiTableInfo,
  } = useDialogStore(
    useShallow((state) => ({
      enrichmentTableOptions: state.enrichmentTableOptions,
      fetchEnrichmentTableData: state.fetchEnrichmentTableData,
      createCampaignErrorMessage: state.createCampaignErrorMessage,
      aiTableFormData: state.aiTableFormData,
      setAiTableInfo: state.setAiTableInfo,
    })),
  );

  const { isValidating } = useSWR(
    'fetchSavedListOptions',
    fetchEnrichmentTableData,
    {
      revalidateOnFocus: false,
      keepPreviousData: false,
    },
  );

  const { isValidating: mappingsLoading } = useSWR(
    aiTableFormData.tableId
      ? [aiTableFormData.tableId, 'fetchEnrichmentTableMapping']
      : null,
    async ([id]) => {
      try {
        const { data } = await _fetchEnrichmentTableMapping(id);
        setAiTableInfo({
          ...aiTableFormData,
          mappings: data.mappings,
        });
        return data.mappings;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: false,
    },
  );

  const { data: tableOptions } = useSWR(
    aiTableFormData.tableId && aiTableFormData.mappings?.length
      ? [aiTableFormData.tableId, 'fetchEnrichmentTableOptions']
      : null,
    async ([id]) => {
      try {
        const { data } = await _fetchEnrichmentTableOptions(id);
        return data.map((item) => ({
          label: item.fieldName,
          value: item.fieldId,
          key: item.fieldId,
        }));
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: false,
    },
  );

  const updateMappingField = async (param: {
    fieldId: string;
    requiredColumn: string;
  }) => {
    try {
      await _updateMappingField(param);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  return (
    <Stack flex={1} maxWidth={'100%'} overflow={'auto'}>
      <Stack flex={1} gap={3} mt={3} px={1.5}>
        <Stack gap={1}>
          <Typography fontWeight={700} variant={'body2'}>
            Saved table
          </Typography>
          <Typography variant={'body2'}>
            The table must include at least a column for email address.
          </Typography>
          <StyledSelect
            disabled={isValidating}
            loading={isValidating}
            onChange={(e) => {
              setAiTableInfo({
                tableId: e.target.value as string,
                mappings: [],
              });
            }}
            options={enrichmentTableOptions}
            placeholder={'Select a table'}
            value={aiTableFormData?.tableId || ''}
          />
        </Stack>
        {mappingsLoading && (
          <Stack flex={1} justifyContent={'center'}>
            <StyledLoading size={'large'} />
          </Stack>
        )}
        {!mappingsLoading && aiTableFormData.mappings?.length > 0 && (
          <Fade in>
            <Stack gap={1}>
              <Typography fontWeight={700} variant={'body2'}>
                Match corresponding fields
              </Typography>
              <Stack>
                <Stack
                  bgcolor={'#F8F8FA'}
                  border={'1px solid #D2D6E1'}
                  flexDirection={'row'}
                  px={4}
                  py={1.25}
                  sx={{
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                >
                  <Typography flex={1} fontWeight={700} variant={'body2'}>
                    Required fields
                  </Typography>
                  <Typography flex={1} fontWeight={700} variant={'body2'}>
                    Data field
                  </Typography>
                </Stack>
                <Stack
                  border={'1px solid #D2D6E1'}
                  borderTop={'none'}
                  gap={1.5}
                  py={1.5}
                  sx={{
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                >
                  {aiTableFormData.mappings.map((item, index) => (
                    <Stack
                      alignItems={'center'}
                      flexDirection={'row'}
                      key={index}
                      px={4}
                      sx={{
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Typography
                        flex={1}
                        fontWeight={700}
                        lineHeight={1.2}
                        sx={{
                          '&::before': {
                            content: "'*'",
                            color:
                              item.campaignRequiredColumnEnum === 'EMAIL' ||
                              item.campaignRequiredColumnEnum === 'FULL_NAME'
                                ? '#E26E6E'
                                : 'transparent',
                            pr: '4px',
                          },
                        }}
                        variant={'body2'}
                      >
                        {item.fieldName}
                      </Typography>
                      <Box flex={1}>
                        <StyledSelect
                          onChange={async (e) => {
                            const updatedMappings =
                              aiTableFormData.mappings.map((i) => {
                                if (
                                  i.campaignRequiredColumnEnum ===
                                  item.campaignRequiredColumnEnum
                                ) {
                                  return {
                                    ...i,
                                    fieldId: e.target.value as string,
                                  };
                                }
                                return i;
                              });
                            setAiTableInfo({
                              ...aiTableFormData,
                              mappings: updatedMappings,
                            });
                            await updateMappingField({
                              fieldId: e.target.value as string,
                              requiredColumn: item.campaignRequiredColumnEnum,
                            });
                          }}
                          options={tableOptions || []}
                          placeholder={'Select a column'}
                          sx={{ flex: 1, maxWidth: 320 }}
                          value={item.fieldId || ''}
                        />
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Fade>
        )}
        {createCampaignErrorMessage && (
          <Typography color={'#E26E6E'} variant={'body3'}>
            {createCampaignErrorMessage}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
