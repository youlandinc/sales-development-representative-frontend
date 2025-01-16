import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  gridPageCountSelector,
  gridPageSelector,
  gridPageSizeSelector,
  gridPaginationRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';

import { StyledButton } from '@/components/atoms';

export const CommonPagination: FC = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const total = useGridSelector(apiRef, gridPaginationRowCountSelector);

  const { setPaginationModel } = apiRef.current;

  const current = (page + 1) * pageSize > total ? total : (page + 1) * pageSize;

  return (
    <Stack alignItems={'center'} flex={1} flexDirection={'row'} px={3.75}>
      <Typography color={'text.secondary'} fontSize={13}>
        Viewing <b>{current}</b> of <b>{total}</b> results
      </Typography>
      <Stack flexDirection={'row'} gap={1.5} ml={'auto'}>
        <StyledButton
          color={'info'}
          disabled={page === 0}
          onClick={() =>
            setPaginationModel({ page: page - 1, pageSize: pageSize })
          }
          size={'medium'}
          variant={'outlined'}
        >
          Previous
        </StyledButton>
        <StyledButton
          color={'info'}
          disabled={page === pageCount - 1}
          onClick={() => {
            setPaginationModel({ page: page + 1, pageSize: pageSize });
          }}
          size={'medium'}
          variant={'outlined'}
        >
          Next
        </StyledButton>
      </Stack>
    </Stack>
  );
};
