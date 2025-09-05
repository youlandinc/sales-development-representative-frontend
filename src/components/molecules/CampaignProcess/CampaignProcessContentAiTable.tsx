import { FC, useEffect, useState } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import useSWR from 'swr';

import { SDRToast, StyledSelect } from '@/components/atoms';

import { useDialogStore } from '@/stores/useDialogStore';

import {
  _fetchEnrichmentTableMapping,
  _fetchEnrichmentTableOptions,
  _updateMappingField,
} from '@/request';
import { HttpError } from '@/types';
import { useAsyncFn } from '@/hooks';

export const CampaignProcessContentAiTable: FC = () => {
  const {
    fetchSavedListLoading,
    enrichmentTableOptions,
    fetchEnrichmentTableData,
    selectedEnrichmentTableId,
    setSelectedEnrichmentTableId,
  } = useDialogStore();

  const [matchFields, setMatchFields] = useState<
    {
      fieldId: string | null;
      fieldName: string;
      campaignRequiredColumnEnum: string;
    }[]
  >([]);

  useSWR('fetchSavedListOptions', fetchEnrichmentTableData, {
    revalidateOnFocus: false,
  });

  const { data: mappings, isValidating: mappingsLoading } = useSWR(
    selectedEnrichmentTableId
      ? [selectedEnrichmentTableId, 'fetchEnrichmentTableMapping']
      : null,
    async ([id]) => {
      try {
        const { data } = await _fetchEnrichmentTableMapping(id);
        setMatchFields(data.mappings);
        return data.mappings;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  const { data: tableOptions } = useSWR(
    mappings
      ? [selectedEnrichmentTableId, 'fetchEnrichmentTableOptions']
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
    },
  );

  const [, updateMappingField] = useAsyncFn(
    async (param: { fieldId: string; requiredColumn: string }) => {
      try {
        await _updateMappingField(param);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
  );

  useEffect(() => {
    return () => {
      setSelectedEnrichmentTableId('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Fade in>
        <Stack height={'100%'} width={'100%'}>
          <Typography fontWeight={700} variant={'body2'}>
            Saved table
          </Typography>
          <Typography variant={'body2'}>
            The list must include name, full name, and email address, otherwise
            we cannot generate accurate email content for you.
          </Typography>
          <Stack gap={3} mt={3} px={1.5}>
            <Stack gap={1}>
              <Typography
                color={
                  fetchSavedListLoading ? 'text.secondary' : 'text.primary'
                }
                fontWeight={700}
                variant={'body2'}
              >
                Table
              </Typography>
              <StyledSelect
                loading={fetchSavedListLoading}
                onChange={(e) => {
                  setSelectedEnrichmentTableId(e.target.value as string);
                }}
                options={enrichmentTableOptions}
                placeholder={'Select a table'}
                value={selectedEnrichmentTableId}
              />
            </Stack>
            {!mappingsLoading && mappings && (
              <Fade in>
                <Stack gap={1}>
                  <Typography fontWeight={700} variant={'body2'}>
                    Match corresponding fields
                  </Typography>
                  <Stack>
                    <Stack
                      bgcolor={'#F7F4FD'}
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
                      {matchFields.map((item, index) => (
                        <Stack
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
                            variant={'body2'}
                          >
                            {item.fieldName}
                          </Typography>
                          <Box flex={1}>
                            <StyledSelect
                              loading={fetchSavedListLoading}
                              onChange={async (e) => {
                                setMatchFields(
                                  matchFields.map((i) => {
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
                                  }),
                                );
                                await updateMappingField({
                                  fieldId: e.target.value as string,
                                  requiredColumn:
                                    item.campaignRequiredColumnEnum,
                                });
                              }}
                              options={tableOptions || []}
                              placeholder={'Select a table'}
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
          </Stack>
        </Stack>
      </Fade>
    </>
  );
};
