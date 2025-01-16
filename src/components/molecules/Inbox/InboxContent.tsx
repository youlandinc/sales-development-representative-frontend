import { useRef } from 'react';
import { Stack } from '@mui/material';

import { InboxForward, InboxReceipt } from '@/components/molecules';

import { InboxContentTypeEnum, useInboxStore } from '@/stores/useInboxStore';

export const InboxContent = () => {
  const { inboxContentType } = useInboxStore((state) => state);
  const article_content = useRef<null>(null);
  // const editorRef = useRef<InboxEditorForwardRefProps | null>(null);
  //
  // const { renderFile } = useRenderDom(
  //   article_content as unknown as RefObject<HTMLDivElement>,
  // );

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
