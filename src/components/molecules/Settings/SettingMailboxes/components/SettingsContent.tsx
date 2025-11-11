import { CircularProgress, Divider, Stack, Typography } from '@mui/material';

import { Mailbox } from '@/types';
import { useSettingsStore } from '@/stores/useSettingsStore';

interface SettingsContentProps {
  loading: boolean;
  onRemove: (item: Mailbox) => void;
  onClickEdit: (item: Mailbox) => void;
}

export const SettingsContent = ({
  loading,
  onRemove,
  onClickEdit,
}: SettingsContentProps) => {
  const { mailboxes: data } = useSettingsStore((state) => state);
  if (loading) {
    return (
      <Stack alignItems={'center'} flex={1} justifyContent={'center'}>
        <CircularProgress size={24} sx={{ width: '100%', color: '#E3E3EE' }} />
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
          Mailbox
        </Typography>
        <Typography
          flex={2}
          flexShrink={0}
          fontSize={12}
          fontWeight={600}
          lineHeight={'18px'}
        >
          Domain
        </Typography>
        <Typography width={180} />
      </Stack>

      <Divider sx={{ borderColor: '#DFDEE6' }} />

      {data.map((item) => (
        <Stack flexDirection={'row'} gap={1.5} key={`pc_${item.id}`}>
          <Typography flex={3} flexShrink={0} fontSize={12}>
            {item.mailboxName}
          </Typography>

          <Stack
            alignItems={'center'}
            flex={2}
            flexDirection={'row'}
            flexShrink={0}
          >
            <Typography fontSize={12}>{item.domain}</Typography>
          </Stack>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'flex-end'}
            width={180}
          >
            <Typography
              color={'#6E4EFB'}
              fontWeight={400}
              mr={'10px'}
              onClick={() => {
                onClickEdit(item);
              }}
              sx={{ cursor: 'pointer' }}
              variant={'subtitle3'}
            >
              Edit
            </Typography>

            <Typography
              color={'#9095A3'}
              fontWeight={400}
              onClick={() => onRemove(item)}
              sx={{ cursor: 'pointer' }}
              variant={'subtitle3'}
            >
              Delete
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
