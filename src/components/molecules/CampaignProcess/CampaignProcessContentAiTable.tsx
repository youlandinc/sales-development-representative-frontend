import { FC } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import useSWR from 'swr';

import { useDialogStore } from '@/stores/useDialogStore';

import { StyledSelect } from '@/components/atoms';
import {
  _fetchEnrichmentTableMapping,
  _fetchEnrichmentTableOptions,
} from '@/request';

const mockData = [
  { fieldName: 'email', fieldId: 'xxxx', campaignRequiredColumnEnum: 'EMAIL' },
  {
    fieldName: 'email1',
    fieldId: 'xxxx',
    campaignRequiredColumnEnum: 'EMAIL1',
  },
  {
    fieldName: 'email2',
    fieldId: 'xxxx',
    campaignRequiredColumnEnum: 'EMAIL2',
  },
];

export const CampaignProcessContentAiTable: FC = () => {
  const {
    fetchSavedListLoading,
    enrichmentTableOptions,
    fetchEnrichmentTableData,
    enrichmentTableId,
    setEnrichmentTableId,
  } = useDialogStore();

  useSWR('fetchSavedListOptions', fetchEnrichmentTableData);
  useSWR(
    enrichmentTableId ? 'fetchEnrichmentTableOptions' : '',
    _fetchEnrichmentTableOptions,
  );
  useSWR(
    enrichmentTableId ? 'fetchEnrichmentTableMapping' : '',
    _fetchEnrichmentTableMapping,
  );

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
                  setEnrichmentTableId(e.target.value as string);
                }}
                options={enrichmentTableOptions}
                placeholder={'Select a table'}
                value={enrichmentTableId}
              />
            </Stack>
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
                  {mockData.map((item, index) => (
                    <Stack
                      flexDirection={'row'}
                      px={4}
                      sx={{
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Typography flex={1} fontWeight={700} variant={'body2'}>
                        {item.fieldName}
                      </Typography>
                      <Box flex={1}>
                        <StyledSelect
                          loading={fetchSavedListLoading}
                          onChange={(e) => {
                            setEnrichmentTableId(e.target.value as string);
                          }}
                          options={enrichmentTableOptions}
                          placeholder={'Select a table'}
                          sx={{ flex: 1, maxWidth: 320 }}
                          value={enrichmentTableId}
                        />
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Fade>
    </>
  );
};
