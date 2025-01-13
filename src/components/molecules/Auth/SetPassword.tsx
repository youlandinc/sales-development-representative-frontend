import { Stack, Typography } from '@mui/material';
import { StyledButton, StyledTextField } from '@/components/atoms';

export const SetPassword = () => {
  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#FBFCFD'}
      height={'100vh'}
      justifyContent={'center'}
      width={'100%'}
    >
      <Stack
        bgcolor={'#ffffff'}
        border={'1px solid #E5E5E5'}
        borderRadius={4}
        gap={6}
        maxWidth={600}
        px={5}
        py={7.5}
        width={'100%'}
      >
        <Typography textAlign={'center'} variant={'h5'}>
          Set password
        </Typography>
        <Stack gap={3}>
          <StyledTextField label={'New password'} />
          <StyledTextField label={'Confirm password'} />

          <StyledButton>Set password</StyledButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
