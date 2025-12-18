import { FC, MouseEvent, ReactNode } from 'react';
import { Box, Icon, Stack } from '@mui/material';

import { CommonAiIcon } from '../common';

import { COLUMN_TYPE_ICONS } from '../config';
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
          <Icon
            component={
              COLUMN_TYPE_ICONS[columnMeta?.fieldType as TableColumnTypeEnum] ||
              COLUMN_TYPE_ICONS[TableColumnTypeEnum.text]
            }
            sx={{ width: 16, height: 16 }}
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
