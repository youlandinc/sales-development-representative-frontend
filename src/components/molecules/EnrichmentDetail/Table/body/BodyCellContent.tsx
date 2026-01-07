import { FC, memo, ReactNode, useLayoutEffect, useRef } from 'react';
import { Box, Stack } from '@mui/material';

import {
  TableCellConfidenceEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

import { BodyCellIcons } from './BodyCellIcons';

const CELL_CONSTANTS = {
  FONT_SIZE: 14,
  PADDING_X: 1.5,
} as const;

export interface BodyCellContentProps {
  children: ReactNode;
  isEditing?: boolean;
  imagePreview?: string;
  confidence?: TableCellConfidenceEnum | null;
  isValidate?: boolean;
  fieldType?: TableColumnTypeEnum;
  displayValue?: string;
  width?: number;
  onTruncatedChange?: (isTruncated: boolean) => void;
}

const BodyCellContentComponent: FC<BodyCellContentProps> = ({
  children,
  isEditing = false,
  imagePreview,
  confidence,
  isValidate = true,
  fieldType,
  displayValue = '',
  width,
  onTruncatedChange,
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  // Detect if text is truncated (has ellipsis) and notify parent
  useLayoutEffect(() => {
    if (textRef.current && !isEditing) {
      const el = textRef.current;
      const truncated = el.scrollWidth > el.clientWidth;
      onTruncatedChange?.(truncated);
    }
  }, [displayValue, width, isEditing, onTruncatedChange]);

  const shouldShowPrefixIcons =
    !isEditing &&
    (imagePreview || confidence || fieldType === TableColumnTypeEnum.url);
  const shouldShowSuffixIcons = !isEditing && !isValidate && fieldType;

  return (
    <Stack
      alignItems="center"
      flexDirection="row"
      fontSize={CELL_CONSTANTS.FONT_SIZE}
      gap={0.5}
      px={CELL_CONSTANTS.PADDING_X}
    >
      {/* Prefix icons: Image Preview & Confidence Indicator */}
      {shouldShowPrefixIcons && (
        <BodyCellIcons
          confidence={confidence}
          fieldType={fieldType}
          imagePreview={imagePreview}
          value={displayValue}
        />
      )}

      <Box
        ref={textRef}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
          flex: 1,
        }}
      >
        {children}
      </Box>

      {/* Suffix icon: Validation Warning */}
      {shouldShowSuffixIcons && (
        <BodyCellIcons fieldType={fieldType} isValidate={isValidate} />
      )}
    </Stack>
  );
};

export const BodyCellContent = memo(BodyCellContentComponent);
