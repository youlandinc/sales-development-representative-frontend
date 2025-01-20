import { FC, useReducer } from 'react';
import { Stack } from '@mui/material';

import { CampaignsHeader, CampaignsTable } from '@/components/molecules';

const reducer = (
  state: { searchWord: string },
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case 'change': {
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    }
    default:
      return state;
  }
};

const initialState: { searchWord: string } = {
  searchWord: '',
};

export const Campaigns: FC = () => {
  const [store, dispatch] = useReducer(reducer, initialState);

  return (
    <Stack gap={3} height={'100%'} width={'100%'}>
      <CampaignsHeader dispatch={dispatch} store={store} />
      <CampaignsTable store={store} />
    </Stack>
  );
};
