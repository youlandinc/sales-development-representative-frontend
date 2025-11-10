import { Stack, Typography } from '@mui/material';

interface SettingsBoxProps {
  title: string;
  subtitle: string;
  button: React.ReactNode;
  children: React.ReactNode;
}

export const SettingsBox = ({
  title,
  subtitle,
  button,
  children,
}: SettingsBoxProps) => {
  return (
    <Stack border={'1px solid #DFDEE6'} borderRadius={4} gap={1.5} p={3}>
      <Stack component={'form'} gap={'12px'} maxWidth={'900px'}>
        <Stack
          alignItems="center"
          direction="row"
          gap={6}
          justifyContent="space-between"
        >
          <Stack gap={'4px'}>
            <Typography
              color={'#363440'}
              component={'div'}
              fontSize={'18px'}
              fontWeight={600}
              lineHeight={1.2}
              variant={'h6'}
            >
              {title}
            </Typography>
            <Typography
              color={'#6F6C7D'}
              component={'div'}
              fontSize={'14px'}
              fontWeight={400}
              lineHeight={1.2}
              variant={'h6'}
            >
              {subtitle}
            </Typography>
          </Stack>
          {button}
        </Stack>
        {children}
      </Stack>
    </Stack>
  );
};
