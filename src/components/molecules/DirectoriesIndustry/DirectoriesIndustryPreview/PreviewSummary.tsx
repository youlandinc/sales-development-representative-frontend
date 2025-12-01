import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface PreviewSummaryProps {
  totalCount: number;
  importCount: number;
  loading: boolean;
  isShowResult: boolean;
}

export const PreviewSummary: FC<PreviewSummaryProps> = ({
  totalCount,
  importCount,
  loading,
  isShowResult,
}) => {
  return (
    <Stack sx={{ flexDirection: 'row', alignItems: 'flex-end', px: 1.5 }}>
      <Typography
        sx={{
          color: 'text.focus',
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        Preview records
      </Typography>

      {isShowResult && (
        <Typography
          sx={{
            ml: 'auto',
            fontSize: 14,
            color: 'text.secondary',
            bgcolor: 'background.paper',
          }}
        >
          Previewing {Math.min(totalCount, 25)} of{' '}
          <Box
            component="span"
            sx={{
              filter: loading ? 'blur(4px)' : 'none',
              transition: 'filter 0.2s ease',
            }}
          >
            {totalCount.toLocaleString()}
          </Box>{' '}
          {totalCount === 1 ? 'record' : 'records'}.{' '}
          <Box
            component="span"
            sx={{
              filter: loading ? 'blur(4px)' : 'none',
              transition: 'filter 0.2s ease',
            }}
          >
            {importCount.toLocaleString()}
          </Box>{' '}
          will be imported.
        </Typography>
      )}
    </Stack>
  );
};
