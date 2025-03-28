import { FC, useEffect, useRef } from 'react';
import { Stack, Typography } from '@mui/material';

import { useDebounceFn } from '@/hooks';

import { StyledTextFieldSearch } from '@/components/atoms';
import { useGridStore } from '@/stores/ContactsStores';

type GridToolBarProps = {
  totalContacts: number;
};

export const GridToolBar: FC<GridToolBarProps> = ({ totalContacts }) => {
  const { setKeyword, keyword } = useGridStore((state) => state);

  const ref = useRef<HTMLInputElement | null>(null);

  const [, , updateQueryDebounce] = useDebounceFn(setKeyword, 500);

  useEffect(() => {
    if (ref.current && typeof keyword === 'string') {
      ref.current!.value = keyword;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Typography variant={'subtitle1'}>
          {totalContacts.toLocaleString()} Contacts
        </Typography>
        <Stack alignItems={'center'} flexDirection={'row'} gap={3}>
          <StyledTextFieldSearch
            handleClear={() => {
              ref.current!.value = '';
              updateQueryDebounce('');
            }}
            inputRef={ref}
            onChange={(e) => {
              updateQueryDebounce(e.target.value);
            }}
            variant={'outlined'}
          />
        </Stack>
      </Stack>
    </>
  );
};
