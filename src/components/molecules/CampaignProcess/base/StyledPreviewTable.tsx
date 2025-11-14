import { Stack, Typography } from '@mui/material';
import { StyledLoading } from '@/components/atoms';

interface CSVPreviewTableProps {
  data: Record<string, string>[];
  hasHeader: boolean;
  counts?: number;
  validCounts?: number;
  invalidCounts?: number;
  fetching?: boolean;
  showSummary?: boolean;
}

export const StyledPreviewTable = ({
  data,
  hasHeader,
  counts,
  validCounts,
  invalidCounts,
  fetching = false,
  showSummary = true,
}: CSVPreviewTableProps) => {
  if (fetching) {
    return <StyledLoading size={24} sx={{ m: 0 }} />;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      {showSummary && counts !== undefined && validCounts !== undefined && (
        <Stack gap={1.5}>
          <Stack>
            <Typography fontWeight={600} lineHeight={1.2}>
              Found {counts} valid and {validCounts} invalid email addresses.
            </Typography>
            <Typography color={'text.secondary'}>
              You can now review the results or continue to the next step.
            </Typography>
          </Stack>
        </Stack>
      )}
      <Stack
        border={'1px solid #E5E7EB'}
        borderRadius={1}
        maxHeight={400}
        overflow={'auto'}
      >
        {hasHeader && data.length > 0 ? (
          <>
            <Stack
              flexDirection={'row'}
              minWidth={'100%'}
              position={'sticky'}
              sx={{
                top: 0,
                zIndex: 10,
              }}
            >
              {Object.entries(data[0]).map(([key, value], index, array) => (
                <Stack
                  alignItems={'center'}
                  bgcolor={'#F7F4FD'}
                  borderBottom={'1px solid #E5E7EB'}
                  borderRight={
                    index < array.length - 1 ? '1px solid #E5E7EB' : 'none'
                  }
                  flex={1}
                  height={'100%'}
                  justifyContent={'center'}
                  key={`header-${key}`}
                  minWidth={300}
                  px={2}
                  py={1}
                >
                  <Typography
                    fontWeight={600}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                    width={'100%'}
                  >
                    {value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            {data.slice(1, 11).map((row, rowIndex) => (
              <Stack
                flexDirection={'row'}
                key={`row-${rowIndex}`}
                minWidth={'100%'}
              >
                {Object.entries(row).map(([key, value], index, array) => (
                  <Stack
                    alignItems={'center'}
                    borderBottom={'1px solid #E5E7EB'}
                    borderRight={
                      index < array.length - 1 ? '1px solid #E5E7EB' : 'none'
                    }
                    flex={1}
                    height={'100%'}
                    justifyContent={'center'}
                    key={`cell-${rowIndex}-${key}`}
                    minWidth={300}
                    px={2}
                    py={1}
                  >
                    <Typography
                      overflow={'hidden'}
                      textOverflow={'ellipsis'}
                      whiteSpace={'nowrap'}
                      width={'100%'}
                    >
                      {value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ))}
          </>
        ) : (
          <>
            <Stack
              flexDirection={'row'}
              minWidth={'100%'}
              position={'sticky'}
              sx={{
                top: 0,
                zIndex: 10,
                left: 0,
                right: 0,
                bgcolor: '#F7F4FD',
                borderBottom: '1px solid #E5E7EB',
              }}
            >
              {data.length > 0 &&
                Object.keys(data[0]).map((key, index, array) => (
                  <Stack
                    alignItems={'center'}
                    borderRight={
                      index < array.length - 1 ? '1px solid #E5E7EB' : 'none'
                    }
                    flex={1}
                    height={'100%'}
                    justifyContent={'center'}
                    key={`header-col-${key}`}
                    minWidth={300}
                    px={2}
                    py={1}
                  >
                    <Typography
                      fontWeight={600}
                      overflow={'hidden'}
                      textOverflow={'ellipsis'}
                      whiteSpace={'nowrap'}
                      width={'100%'}
                    >
                      Column {parseInt(key) + 1}
                    </Typography>
                  </Stack>
                ))}
            </Stack>
            {data.slice(0, 10).map((row, rowIndex) => (
              <Stack
                borderBottom={'1px solid #E5E7EB'}
                flexDirection={'row'}
                key={`row-${rowIndex}`}
                minWidth={'100%'}
                sx={{
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                {Object.entries(row).map(([key, value], index, array) => (
                  <Stack
                    alignItems={'center'}
                    borderRight={
                      index < array.length - 1 ? '1px solid #E5E7EB' : 'none'
                    }
                    flex={1}
                    height={'100%'}
                    justifyContent={'center'}
                    key={`cell-${rowIndex}-${key}`}
                    minWidth={300}
                    px={2}
                    py={1}
                  >
                    <Typography
                      overflow={'hidden'}
                      textOverflow={'ellipsis'}
                      whiteSpace={'nowrap'}
                      width={'100%'}
                    >
                      {value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ))}
          </>
        )}
      </Stack>
    </>
  );
};
