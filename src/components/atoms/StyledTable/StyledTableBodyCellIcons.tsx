import { FC } from 'react';
import { Box, Tooltip } from '@mui/material';

import { COLUMN_TYPE_LABELS } from '@/constants/table';
import {
  TableCellConfidenceEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

const CONFIDENCE_URL = {
  [TableCellConfidenceEnum.low]: '/images/icon-confidence-low.svg',
  [TableCellConfidenceEnum.medium]: '/images/icon-confidence-medium.svg',
  [TableCellConfidenceEnum.high]: '/images/icon-confidence-high.svg',
} as const;

interface StyledTableBodyCellIconsProps {
  imagePreview?: string;
  confidence?: TableCellConfidenceEnum;
  isValidate?: boolean;
  fieldType?: string;
}

export const StyledTableBodyCellIcons: FC<StyledTableBodyCellIconsProps> = ({
  imagePreview,
  confidence,
  isValidate,
  fieldType,
}) => {
  return (
    <>
      {/* Image Preview - Prefix (left of text) */}
      {imagePreview && (
        <Box
          alt="integration logo"
          component="img"
          src={imagePreview}
          sx={{
            mr: 0.5,
            width: 16,
            height: 16,
            flexShrink: 0,
            borderRadius: '2px',
            objectFit: 'contain',
          }}
        />
      )}

      {/* Confidence Indicator - Prefix (left of text) */}
      {!imagePreview && confidence && (
        <Box
          alt="confidence logo"
          component="img"
          src={CONFIDENCE_URL[confidence as TableCellConfidenceEnum] || ''}
          sx={{
            mr: 0.5,
            width: 16,
            height: 16,
            flexShrink: 0,
            borderRadius: '2px',
            objectFit: 'contain',
          }}
        />
      )}

      {/* Validation Warning - Suffix (right of text) */}
      {isValidate === false && fieldType && (
        <Tooltip
          arrow
          placement="top"
          title={`Whoops! This value could not be converted to this column's data type (${
            COLUMN_TYPE_LABELS[fieldType as TableColumnTypeEnum] || fieldType
          })`}
        >
          <Box
            alt="validation warning"
            component="img"
            src={'/images/icon-cell-warning.svg'}
            sx={{
              ml: 0.5,
              width: 12,
              height: 12,
              flexShrink: 0,
            }}
          />
        </Tooltip>
      )}
    </>
  );
};
