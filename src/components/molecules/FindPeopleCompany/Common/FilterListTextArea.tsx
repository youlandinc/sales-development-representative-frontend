import { FC } from 'react';
import { Stack } from '@mui/material';

import { FilterTextField } from './index';

interface FilterListTextAreaProps {
  state: string[];
  onChange: (param: string[]) => void;
}

export const FilterListTextArea: FC<FilterListTextAreaProps> = ({
  state = [],
  onChange,
}) => {
  return (
    <Stack>
      <FilterTextField
        onChange={(e) => {
          onChange(e);
        }}
        placeholder={'e.g. Amazon'}
        //subTitle={'Company name'}
        title={'Companies'}
        value={state}
      />
    </Stack>
  );
};
