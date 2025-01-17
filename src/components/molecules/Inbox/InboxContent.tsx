import { Stack } from '@mui/material';

import { InboxForward, InboxReceipt } from '@/components/molecules';

import { InboxContentTypeEnum, useInboxStore } from '@/stores/useInboxStore';

export const InboxContent = () => {
  const { inboxContentType } = useInboxStore((state) => state);

  return (
    <Stack flex={1}>
      {inboxContentType === InboxContentTypeEnum.receipt ? (
        <InboxReceipt />
      ) : (
        <InboxForward />
      )}
    </Stack>
  );
};
