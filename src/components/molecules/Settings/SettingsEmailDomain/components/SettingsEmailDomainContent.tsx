import {
  CircularProgress,
  Divider,
  Icon,
  Stack,
  Typography,
} from '@mui/material';

import { DomainSource, EmailDomainDetails, EmailDomainState } from '@/types';

import ICON_PENDING from '../../assets/icon_email_pending.svg';
import ICON_SUCCESS from '../../assets/icon_email_success.svg';

const DomainStateHash = {
  [EmailDomainState.ACTIVE]: 'Verified',
  [EmailDomainState.SUCCESS]: 'Waiting for sender setup',
  [EmailDomainState.PENDING]: 'Waiting for verification',
  [EmailDomainState.FAILED]: 'Waiting for verification',
};

const DomainStateActionHash = {
  [EmailDomainState.ACTIVE]: '',
  [EmailDomainState.SUCCESS]: 'View',
  [EmailDomainState.PENDING]: 'View',
  [EmailDomainState.FAILED]: 'View',
};

const DomainStateIconHash = {
  [EmailDomainState.SUCCESS]: ICON_PENDING,
  [EmailDomainState.PENDING]: ICON_PENDING,
  [EmailDomainState.ACTIVE]: ICON_SUCCESS,
  [EmailDomainState.FAILED]: ICON_PENDING,
};

interface SettingsEmailDomainContentProps {
  loading: boolean;
  viewLoading: boolean;
  data: EmailDomainDetails[];
  domain: string;
  onRemove: (item: EmailDomainDetails) => void;
  onClickView: (domain: string) => void;
}

export const SettingsEmailDomainContent = ({
  loading,
  viewLoading,
  data,
  domain,
  onRemove,
  onClickView,
}: SettingsEmailDomainContentProps) => {
  if (loading) {
    return (
      <Stack alignItems={'center'} flex={1} justifyContent={'center'}>
        <CircularProgress size={24} sx={{ width: '100%', color: '#E3E3EE' }} />
      </Stack>
    );
  }

  return (
    <Stack color={'#202939'} gap={'12px'}>
      <Stack color="#6F6C7D" flexDirection={'row'} gap={1.5}>
        <Typography
          flex={3}
          flexShrink={0}
          fontSize={12}
          fontWeight={600}
          lineHeight={'18px'}
        >
          Domain
        </Typography>
        <Typography
          flex={2}
          flexShrink={0}
          fontSize={12}
          fontWeight={600}
          lineHeight={'18px'}
        >
          State
        </Typography>
        <Typography width={180} />
      </Stack>

      <Divider sx={{ borderColor: '#DFDEE6' }} />

      {data.map((item) => (
        <Stack flexDirection={'row'} gap={1.5} key={`pc_${item.id}`}>
          <Typography flex={3} flexShrink={0} fontSize={12}>
            {item.emailDomain}
          </Typography>

          <Stack
            alignItems={'center'}
            flex={2}
            flexDirection={'row'}
            flexShrink={0}
          >
            <Icon
              component={DomainStateIconHash[item.validStatus]}
              sx={{
                mr: '4px',
                width: 20,
                height: 20,
              }}
            />
            <Typography fontSize={12}>
              {DomainStateHash[item.validStatus]}
            </Typography>
          </Stack>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'flex-end'}
            width={180}
          >
            {item.source === DomainSource.CUSTOM && (
              <>
                {viewLoading && item.emailDomain === domain ? (
                  <CircularProgress
                    size={12}
                    sx={{ marginRight: '10px', color: '#6E4EFB' }}
                  />
                ) : (
                  <Typography
                    color={'#6E4EFB'}
                    fontWeight={400}
                    mr={'10px'}
                    onClick={() => {
                      onClickView(item.emailDomain);
                    }}
                    sx={{ cursor: 'pointer' }}
                    variant={'subtitle3'}
                  >
                    {DomainStateActionHash[item.validStatus]}
                  </Typography>
                )}
                <Typography
                  color={'#9095A3'}
                  fontWeight={400}
                  onClick={() => onRemove(item)}
                  sx={{ cursor: 'pointer' }}
                  variant={'subtitle3'}
                >
                  Delete
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
