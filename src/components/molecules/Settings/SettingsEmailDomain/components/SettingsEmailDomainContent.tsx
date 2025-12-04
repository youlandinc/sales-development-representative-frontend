import {
  CircularProgress,
  Divider,
  Icon,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { useSettingsStore } from '@/stores/useSettingsStore';
import { DomainSource, EmailDomainDetails, EmailDomainState } from '@/types';

import ICON_PENDING from '../../assets/icon_email_pending.svg';
import ICON_SUCCESS from '../../assets/icon_email_success.svg';

const DomainStateHash = {
  [EmailDomainState.ACTIVE]: 'Verified',
  [EmailDomainState.SUCCESS]: 'Verified',
  [EmailDomainState.PENDING]: 'Waiting for verification',
  [EmailDomainState.FAILED]: 'Waiting for verification',
};

const DomainStateActionHash = {
  [EmailDomainState.ACTIVE]: '',
  [EmailDomainState.SUCCESS]: '',
  [EmailDomainState.PENDING]: 'View',
  [EmailDomainState.FAILED]: 'View',
};

const DomainStateIconHash = {
  [EmailDomainState.ACTIVE]: ICON_SUCCESS,
  [EmailDomainState.SUCCESS]: ICON_SUCCESS,
  [EmailDomainState.PENDING]: ICON_PENDING,
  [EmailDomainState.FAILED]: ICON_PENDING,
};

interface SettingsEmailDomainContentProps {
  loading: boolean;
  viewLoading: boolean;
  domain: string;
  onRemove: (item: EmailDomainDetails) => void;
  onClickView: (domain: string) => void;
}

export const SettingsEmailDomainContent = ({
  loading,
  viewLoading,
  domain,
  onRemove,
  onClickView,
}: SettingsEmailDomainContentProps) => {
  const data = useSettingsStore((state) => state.emailDomainList);
  if (loading) {
    return (
      <Stack gap={1.5}>
        <Stack flex={1} flexDirection={'row'} gap={1.5}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} sx={{ flex: 1 }} variant="rounded" />
          ))}
        </Stack>
      </Stack>
    );
  }

  if (data.length === 0) {
    return null;
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
