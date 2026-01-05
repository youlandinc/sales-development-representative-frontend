import { FC, MouseEvent, ReactNode } from 'react';
import { Box, Stack } from '@mui/material';

import { CommonAiIcon } from '../common';

import { TypeIcon } from '../TableIcon';
import { TableColumnMeta, TableColumnTypeEnum } from '@/types/enrichment/table';

interface HeadCellContentProps {
  content: ReactNode;
  columnMeta?: TableColumnMeta;
  isAiColumn: boolean;
  backgroundColor: string;
  onAiIconClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export const HeadCellContent: FC<HeadCellContentProps> = ({
  content,
  columnMeta,
  isAiColumn,
  backgroundColor,
  onAiIconClick,
}) => {
  const actionDefinition = columnMeta?.actionDefinition;

  return (
    <>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        {actionDefinition?.logoUrl ? (
          <Box
            alt={actionDefinition.integrationName || 'integration logo'}
            component="img"
            src={actionDefinition.logoUrl}
            sx={{
              width: 16,
              height: 16,
              flexShrink: 0,
              borderRadius: '2px',
              objectFit: 'contain',
            }}
          />
        ) : (
          <TypeIcon
            type={
              (columnMeta?.fieldType as TableColumnTypeEnum) ||
              TableColumnTypeEnum.text
            }
          />
        )}
        {content}
      </Stack>
      {isAiColumn && (
        <CommonAiIcon
          backgroundColor={backgroundColor}
          onClick={onAiIconClick}
        />
      )}
    </>
  );
};
