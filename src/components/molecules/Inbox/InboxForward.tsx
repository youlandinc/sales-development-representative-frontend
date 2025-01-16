import {
  Box,
  InputAdornment,
  Stack,
  SxProps,
  TextFieldProps,
  Typography,
} from '@mui/material';

import { FC, useEffect, useRef } from 'react';

import { StyledButton, StyledTextField } from '@/components/atoms';
import {
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';

import { InboxContentTypeEnum, useInboxStore } from '@/stores/useInboxStore';

const StyledTextFilledField: FC<TextFieldProps> = ({ label, sx, ...rest }) => {
  return (
    <Stack alignItems={'flex-start'} flexDirection={'row'} gap={1.25}>
      <StyledTextField
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  color={'#6F6C7D'}
                  lineHeight={1.4}
                  variant={'subtitle3'}
                >
                  {label}
                </Typography>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiInputBase-input': {
            p: '0 0 8px',
            fontSize: 12,
          },
          '& .MuiInputAdornment-root': {
            alignItems: 'flex-start',
            mr: 1.25,
          },
          ...(sx as SxProps),
        }}
        variant={'standard'}
        {...rest}
      />
    </Stack>
  );
};

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
