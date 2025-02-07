import { Stack } from '@mui/material';
import { useEffect, useRef } from 'react';

import { StyledButton, StyledTextFilledField } from '@/components/atoms';
import {
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';

import { InboxContentTypeEnum, useInboxStore } from '@/stores/useInboxStore';

export const InboxForward = () => {
  const { setInboxContentType, forwardContent } = useInboxStore(
    (state) => state,
  );

  const editorRef = useRef<InboxEditorForwardRefProps | null>(null);

  useEffect(() => {
    if (editorRef.current?.editInstance) {
      // editorRef.current.focus();
      editorRef.current?.editInstance.initData;
    }
  }, [forwardContent]);

  return (
    <Stack gap={1.5} p={1.5} width={'100%'}>
      <Stack flexDirection={'row'} gap={1.5} justifyContent={'flex-end'}>
        <StyledButton
          color={'info'}
          onClick={() => {
            setInboxContentType(InboxContentTypeEnum.receipt);
          }}
          size={'medium'}
          sx={{ px: '12px !important' }}
          variant={'outlined'}
        >
          Cancel
        </StyledButton>
        <StyledButton size={'medium'} sx={{ px: '12px !important' }}>
          Send
        </StyledButton>
      </Stack>
      <Stack gap={1.5}>
        <StyledTextFilledField label={'Receipt:'} />
        <StyledTextFilledField label={'Cc:'} />
        <StyledTextFilledField label={'Subject:'} />
      </Stack>
      <InboxEditor
        config={{ height: '400px' }}
        initData={forwardContent}
        ref={editorRef}
      />
    </Stack>
  );
};
