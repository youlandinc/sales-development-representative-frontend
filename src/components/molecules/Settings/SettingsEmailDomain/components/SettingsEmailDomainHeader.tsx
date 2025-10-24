import { Stack, Typography } from '@mui/material';

import { SettingsEmailDomainButton } from './SettingsEmailDomainButton';

interface SettingsEmailDomainHeaderProps {
  onAddEmailDomain: () => void;
}

export const SettingsEmailDomainHeader = ({
  onAddEmailDomain,
}: SettingsEmailDomainHeaderProps) => {
  return (
    <Stack
      alignItems={'flex-start'}
      flexDirection={'row'}
      gap={6}
      justifyContent={'space-between'}
    >
      <Typography color={'#2A292E'} component={'div'} fontSize={'16px'}>
        <Stack lineHeight={1.5}>Set email domain</Stack>
        <Typography
          color={'#9095A3'}
          component={'p'}
          fontSize={'12px'}
          mt={'4px'}
        >
          Send notification emails using your custom domain. The email prefix is
          the part before “@”, and the email domain is the part after it (e.g.
          admin@example-domain.com).
        </Typography>
      </Typography>
      <SettingsEmailDomainButton onAddEmailDomain={onAddEmailDomain} />
    </Stack>
  );
};
