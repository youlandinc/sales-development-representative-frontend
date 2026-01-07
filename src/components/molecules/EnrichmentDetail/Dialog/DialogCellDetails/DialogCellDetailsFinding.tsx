import { Stack, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import Image from 'next/image';

import { useEnrichmentTableStore } from '@/stores/enrichment/useEnrichmentTableStore';
import { ActiveCellParams } from '@/types/enrichment/base';
import { DialogCellDetailsContainer, ValidationStatus } from './base';

import { TableCellDetailValidateStatusEnum } from '@/types/enum';

interface DialogCellDetailsFindingProps {
  cellDetails: ActiveCellParams;
}

const DEFAULT_STYLE = {
  title: {
    fontSize: 14,
    lineHeight: 1.2,
    fontWeight: 600,
    color: 'text.secondary',
  },
  value: {
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 400,
    color: 'text.secondary',
  },
};

export const DialogCellDetailsFinding: FC<DialogCellDetailsFindingProps> = ({
  cellDetails,
}) => {
  const { rowData, columnId } = cellDetails;
  const { getMetaColumnById } = useEnrichmentTableStore(
    useShallow((store) => ({
      getMetaColumnById: store.getMetaColumnById,
    })),
  );

  const metaColumn = getMetaColumnById(columnId);

  const cellValue = useMemo(() => {
    return rowData[columnId];
  }, [rowData, columnId]);
  /* 
  const actionDefinition = metaColumn?.actionDefinition;

  const inputBinding = useMemo(
    () => metaColumn?.typeSettings?.inputBinding || [],
    [metaColumn?.typeSettings?.inputBinding],
  );

  const actionName = metaColumn?.fieldName || 'Find';
  const integrationName = actionDefinition?.integrationName || '';
  const integrationLogoUrl = actionDefinition?.logoUrl || '';

  const status = cellValue?.status || 'unknown';
  const statusVisual =
    statusIconMap[status.toLowerCase()] || statusIconMap.unknown;

  const inputFields = useMemo(
    () =>
      inputBinding.map((input: any) => ({
        name: input.name,
        value: rowData[input.formulaText] || '',
      })),
    [inputBinding, rowData],
  );

  const outputFields = useMemo(() => {
    if (!cellValue || typeof cellValue !== 'object') {
      return [];
    }
    const excludeKeys = new Set(['status', 'statusReason']);
    return Object.entries(cellValue)
      .filter(([key]) => !excludeKeys.has(key))
      .map(([key, value]) => ({
        name: key,
        value: String(value ?? ''),
      }));
  }, [cellValue]);
 */
  return (
    <DialogCellDetailsContainer>
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
        {/* Basic Info Section */}
        <Stack gap={1}>
          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Action:</Typography>
            <Typography sx={DEFAULT_STYLE.value}>Find work email</Typography>
          </Stack>

          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Provider:</Typography>
            <Stack alignItems={'center'} direction={'row'} gap={0.5}>
              <Image
                alt={''}
                height={20}
                src={
                  'https://public-storage-hub.s3.us-west-1.amazonaws.com/LeadMagic.svg'
                }
                width={20}
              />
              <Typography sx={DEFAULT_STYLE.value}>Findymail</Typography>
            </Stack>
          </Stack>

          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Result:</Typography>
            <Typography sx={DEFAULT_STYLE.value}>
              123456@132.com / Run condition not met / Missing input
            </Typography>
          </Stack>

          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Status:</Typography>
            <ValidationStatus
              status={TableCellDetailValidateStatusEnum.verified}
            />
          </Stack>
        </Stack>

        {/* Input Section */}

        <Stack gap={1}>
          <Typography sx={DEFAULT_STYLE.title}>Input</Typography>
          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>First name:</Typography>
            <Typography sx={DEFAULT_STYLE.title}>name</Typography>
          </Stack>
          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Last name:</Typography>
            <Typography sx={DEFAULT_STYLE.value}>456</Typography>
          </Stack>
          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>LinkedIn profile:</Typography>
            <Typography sx={DEFAULT_STYLE.value}>
              123456@linkedin.com
            </Typography>
          </Stack>
        </Stack>

        {/* Output Section */}

        <Stack gap={1}>
          <Typography sx={DEFAULT_STYLE.title}>Output</Typography>

          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Field name:</Typography>
            <Typography sx={DEFAULT_STYLE.value}>xxxxx</Typography>
          </Stack>
        </Stack>
        <Stack gap={1}>
          <Typography sx={DEFAULT_STYLE.title}>Other details</Typography>

          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Field name:</Typography>
            <Typography sx={DEFAULT_STYLE.value}>xxxxx</Typography>
          </Stack>
        </Stack>
      </Stack>
    </DialogCellDetailsContainer>
  );
};
