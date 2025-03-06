import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

import { SDRToast } from '@/components/atoms';

import { HttpVariantEnum } from '@/types';

type VerifyEmailProps = {
  domains: {
    domainType: string;
    recordName: string;
    recordValue: string;
  }[];
};

export const SettingsEmailVerify: FC<VerifyEmailProps> = ({ domains }) => {
  return (
    <Stack spacing={1.5}>
      <Typography
        bgcolor={'rgba(17, 52, 227, 0.10)'}
        borderRadius={2}
        color={'text.menu_selected'}
        p={1.5}
        variant={'body2'}
      >
        Please complete the verification process for DKIM authentication by
        copying the CNAME record generated below and publishing it with your
        domain&apos;s DNS provider. Detection of these records may take up to 72
        hours.
      </Typography>
      <Stack
        borderBottom={'1px solid'}
        borderColor={'border.primary'}
        color={'info.main'}
        direction={'row'}
        py={1.5}
        spacing={1.5}
      >
        <Typography flex={1} variant={'subtitle1'}>
          Type
        </Typography>
        <Typography flex={2.5} variant={'subtitle1'}>
          Name
        </Typography>
        <Typography flex={3} variant={'subtitle1'}>
          Data
        </Typography>
      </Stack>
      {domains.map((item, index) => (
        <Stack direction={'row'} key={index} py={3} spacing={1.5}>
          <Typography flex={0.5} variant={'body2'}>
            {item.domainType}
          </Typography>
          <Stack
            alignItems={'center'}
            direction={'row'}
            flex={2.5}
            justifyContent={'space-between'}
          >
            <Typography variant={'body2'}>{item.recordName}</Typography>
            <ContentCopy
              onClick={async () => {
                await navigator.clipboard.writeText(item.recordName);
                SDRToast({
                  header: 'Copied name to clipboard',
                  variant: HttpVariantEnum.success,
                  message: undefined,
                });
              }}
              sx={{ fontSize: 20, cursor: 'pointer' }}
            />
          </Stack>
          <Stack
            alignItems={'center'}
            direction={'row'}
            flex={3}
            justifyContent={'space-between'}
          >
            <Typography variant={'body2'}>{item.recordValue}</Typography>
            <ContentCopy
              onClick={async () => {
                await navigator.clipboard.writeText(item.recordValue);
                SDRToast({
                  header: 'Copied name to clipboard',
                  variant: HttpVariantEnum.success,
                  message: undefined,
                });
              }}
              sx={{ fontSize: 20, cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
