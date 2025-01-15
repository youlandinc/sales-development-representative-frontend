import { Avatar, Box, CardHeader, Stack, Typography } from '@mui/material';
import { RefObject, useRef } from 'react';

import { useRenderDom } from '@/hooks';

import {
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';
import { StyledButton } from '@/components/atoms';

export const InboxContent = () => {
  const article_content = useRef<null>(null);
  const editorRef = useRef<InboxEditorForwardRefProps | null>(null);

  const { renderFile } = useRenderDom(
    article_content as unknown as RefObject<HTMLDivElement>,
  );

  return (
    <Stack flex={1} gap={3}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'red', height: 40, width: 40 }}>R</Avatar>
        }
        subheader={
          <Typography component={'span'} variant={'subtitle3'}>
            To: demo@minimal.kit
          </Typography>
        }
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'rgba(145, 158, 171, 0.24)',
        }}
        title={
          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
            <Typography variant={'subtitle2'}>Shawn Manning</Typography>
            <Typography variant={'subtitle3'}>
              {'<'}Shawnmanning@gmail.com{'>'}
            </Typography>
          </Stack>
        }
      />
      <Box
        ref={article_content}
        sx={{
          '& p': {
            m: 0,
          },
        }}
      ></Box>
      <InboxEditor ref={editorRef} />
      <StyledButton
        onClick={() => {
          if (editorRef.current?.editInstance) {
            renderFile(editorRef.current.editInstance.getData());
          }
        }}
      >
        Send email
      </StyledButton>
    </Stack>
  );
};
