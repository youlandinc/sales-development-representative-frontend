import { Box, Stack } from '@mui/material';
import {
  FindPeopleFilterPanel,
  FindPeopleGrid,
  FindPeopleHeader,
} from '@/components/molecules';

export const FindPeople = () => {
  console.log('parent');
  return (
    <Stack height={'100vh'}>
      <FindPeopleHeader />
      <Stack flex={1} flexDirection={'row'} minHeight={0}>
        <FindPeopleFilterPanel />
        <FindPeopleGrid />
      </Stack>
    </Stack>
  );
};
