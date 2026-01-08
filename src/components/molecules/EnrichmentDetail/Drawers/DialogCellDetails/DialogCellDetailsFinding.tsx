import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useMemo } from 'react';

import { ActiveCellParams } from '@/types/enrichment';
import { DialogCellDetailsContainer } from './base';

import { UTypeOf } from '@/utils';

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

  const metaData = useMemo(() => {
    return rowData[columnId]?.metaData || {};
  }, [rowData, columnId]);

  const inputFields = useMemo(() => {
    if (!metaData.input || typeof metaData.input !== 'object') {
      return [];
    }
    return Object.entries(metaData.input).map(([key, value]) => ({
      name: key,
      value: String(value ?? ''),
    }));
  }, [metaData]);

  const outputFields = useMemo(() => {
    if (!metaData.output || typeof metaData.output !== 'object') {
      return [];
    }
    return Object.entries(metaData.output).map(([key, value]) => ({
      name: key,
      value: String(value ?? ''),
    }));
  }, [metaData]);

  const otherDetails = useMemo(() => {
    if (!metaData.otherDetails || typeof metaData.otherDetails !== 'object') {
      return [];
    }
    return Object.entries(metaData.otherDetails).map(([key, value]) => ({
      name: key,
      value: String(value ?? ''),
    }));
  }, [metaData]);

  const actionName = metaData.action || '';
  const integrationName = metaData.provider || '';
  const status = metaData.status || '';
  // const statusVisual =
  //   statusIconMap[status.toLowerCase()] || statusIconMap.unknown;
  return (
    <DialogCellDetailsContainer isEmpty={UTypeOf.isEmptyObject(metaData)}>
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
            <Typography sx={DEFAULT_STYLE.value}>{actionName}</Typography>
          </Stack>

          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Provider:</Typography>
            <Stack alignItems={'center'} direction={'row'} gap={0.5}>
              {metaData.imagePreview && (
                <Image
                  alt={''}
                  height={20}
                  src={metaData.imagePreview || ''}
                  width={20}
                />
              )}
              <Typography sx={DEFAULT_STYLE.value}>
                {integrationName}
              </Typography>
            </Stack>
          </Stack>

          <Stack alignItems={'center'} direction={'row'} gap={1}>
            <Typography sx={DEFAULT_STYLE.title}>Result:</Typography>
            <Typography sx={DEFAULT_STYLE.value}>{metaData.result}</Typography>
          </Stack>

          {status && (
            <Stack alignItems={'center'} direction={'row'} gap={1}>
              <Typography sx={DEFAULT_STYLE.title}>Status:</Typography>
              <Typography sx={DEFAULT_STYLE.value}>{status}</Typography>
            </Stack>
          )}
        </Stack>

        {/* Input Section */}
        {inputFields.length > 0 && (
          <Stack gap={1}>
            <Typography color={'text.secondary'} variant={'h7'}>
              Input
            </Typography>
            {inputFields.map((field) => (
              <Stack
                alignItems={'center'}
                direction={'row'}
                gap={1}
                key={field.name}
              >
                <Typography sx={DEFAULT_STYLE.title}>{field.name}:</Typography>
                <Typography sx={DEFAULT_STYLE.value}>
                  {field.value || 'N/A'}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

        {/* Output Section */}
        {outputFields.length > 0 && (
          <Stack gap={1}>
            <Typography color={'text.secondary'} variant={'h7'}>
              Output
            </Typography>
            {outputFields.map((field) => (
              <Stack
                alignItems={'center'}
                direction={'row'}
                gap={1}
                key={field.name}
              >
                <Typography sx={DEFAULT_STYLE.title}>{field.name}:</Typography>
                <Typography sx={DEFAULT_STYLE.value}>
                  {field.value || 'N/A'}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

        {/* Other Details Section */}
        {otherDetails.length > 0 && (
          <Stack gap={1}>
            <Typography color={'text.secondary'} variant={'h7'}>
              Other details
            </Typography>
            {otherDetails.map((field) => (
              <Stack
                alignItems={'center'}
                direction={'row'}
                gap={1}
                key={field.name}
              >
                <Typography sx={DEFAULT_STYLE.title}>{field.name}:</Typography>
                <Typography sx={DEFAULT_STYLE.value}>
                  {field.value || 'N/A'}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </DialogCellDetailsContainer>
  );
};
