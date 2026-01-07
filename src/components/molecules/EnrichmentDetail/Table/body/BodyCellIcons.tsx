import { FC, memo } from 'react';
import { Box, Tooltip } from '@mui/material';

import { StyledImage } from '@/components/atoms';

import { CELL_AI_VALIDATE_HASH, COLUMN_TYPE_LABELS } from '../config';
import {
  TableCellMetaDataValidateStatusEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

interface BodyCellIconsProps {
  imagePreview?: string;
  validateStatus?: TableCellMetaDataValidateStatusEnum | null;
  isValidate?: boolean;
  fieldType?: TableColumnTypeEnum;
  value?: any;
}

const BodyCellIconsComponent: FC<BodyCellIconsProps> = ({
  imagePreview,
  validateStatus,
  isValidate,
  fieldType,
  value,
}) => {
  const urlHref =
    value?.startsWith('http://') || value?.startsWith('https://')
      ? value
      : `https://${value}`;

  return (
    <>
      {fieldType === TableColumnTypeEnum.url && value && (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.open(urlHref, '_blank');
          }}
        >
          <StyledImage
            sx={{
              position: 'relative',
              marginRight: 0.5,
              width: 16,
              height: 16,
              flexShrink: 0,
              borderRadius: 2,
              cursor: 'pointer',
            }}
            url="/images/table/icon-cell-url.svg"
          />
        </Box>
      )}
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
      {!imagePreview && validateStatus && (
        <Box
          alt="confidence logo"
          component="img"
          src={CELL_AI_VALIDATE_HASH[validateStatus] || ''}
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
            COLUMN_TYPE_LABELS[fieldType] || fieldType
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

export const BodyCellIcons = memo(BodyCellIconsComponent);
