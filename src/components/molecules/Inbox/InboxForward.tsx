import { Autocomplete, Box, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import {
  SDRToast,
  StyledButton,
  StyledTextFilledField,
} from '@/components/atoms';
import {
  InboxEditor,
  InboxEditorForwardRefProps,
} from '@/components/molecules';

import { InboxContentTypeEnum, useInboxStore } from '@/stores/useInboxStore';
import { useAsyncFn } from '@/hooks';
import { HttpError } from '@/types';
import { _forwardEmails, ForwardEmailsParam } from '@/request';

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const InboxForward = () => {
  const { setInboxContentType, forwardContent, forwardReceipt, selectedEmail } =
    useInboxStore((state) => state);

  const [receipt, setReceipt] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [emailChip, setEmailChip] = useState<string[]>([]);

  const editorRef = useRef<InboxEditorForwardRefProps | null>(null);

  const [state, sendEmail] = useAsyncFn(async (param: ForwardEmailsParam) => {
    try {
      await _forwardEmails(param);
      setInboxContentType(InboxContentTypeEnum.receipt);
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  useEffect(() => {
    if (editorRef.current?.editInstance) {
      // editorRef.current.focus();
      editorRef.current?.editInstance.initData;
    }
  }, [forwardContent]);

  useEffect(() => {
    setReceipt(forwardReceipt);
  }, [forwardReceipt]);

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
        <StyledButton
          disabled={receipt.trim() === ''}
          loading={state.loading}
          onClick={async () => {
            if (typeof selectedEmail?.emailId === 'number') {
              await sendEmail({
                parentEmailId: selectedEmail.emailId,
                recipient: receipt,
                cc: emailChip,
                subject: subject,
                content: editorRef.current?.editInstance.getData() || '',
              });
            }
          }}
          size={'medium'}
          sx={{ px: '12px !important', width: 56 }}
        >
          Send
        </StyledButton>
      </Stack>
      <Stack gap={1.5}>
        <StyledTextFilledField
          label={'Receipt:'}
          onChange={(e) => setReceipt(e.target.value)}
          value={receipt}
        />
        {/*<StyledTextFilledField*/}
        {/*  label={'Cc:'}*/}
        {/*  onChange={(e) => setCc(e.target.value)}*/}
        {/*  value={cc}*/}
        {/*/>*/}
        <Box position={'relative'}>
          <Typography
            color={'#6F6C7D'}
            lineHeight={1.4}
            position={'absolute'}
            top={4}
            variant={'subtitle3'}
          >
            Cc:
          </Typography>
          <Autocomplete
            freeSolo
            inputValue={cc}
            multiple
            onChange={(_e, newValue) => {
              setEmailChip(newValue);
            }}
            onInputChange={(_e, newValue) => {
              setCc(newValue);
            }}
            options={[]}
            renderInput={(params) => (
              <StyledTextFilledField
                onKeyDown={(event) => {
                  if (
                    event.key === 'Enter' ||
                    event.key === ',' ||
                    event.key === ' '
                  ) {
                    (event as any).defaultMuiPrevented = true;
                    const inputValue = (event.target as any).value.trim();
                    if (inputValue && validateEmail(inputValue)) {
                      if (!emailChip.includes(inputValue)) {
                        setEmailChip([...emailChip, inputValue]);
                        setCc('');
                      }
                    }
                    event.preventDefault(); // prevent default behavior
                  }
                }}
                placeholder={'adam@gmail.com, joe@outlook.com'}
                slotProps={{
                  input: params.InputProps,
                  htmlInput: params.inputProps,
                }}
                type={'email'}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                return (
                  <Chip
                    label={option}
                    variant="outlined"
                    {...getTagProps({ index })}
                    key={index}
                    onDelete={() => {
                      setEmailChip(emailChip.filter((item) => item !== option));
                    }}
                    sx={{
                      fontSize: '12px',
                      m: '0px 0px 8px 4px !important',
                      lineHeight: '1.5',
                      height: 'auto !important',
                      '& .MuiChip-deleteIcon': { fontSize: '15px' },
                      '&:first-child': { ml: '30px !important' },
                    }}
                  />
                );
              })
            }
            sx={{
              '& .MuiInput-root .MuiInput-input': {
                padding: emailChip.length ? '0 0 8px 4px' : '0 0 8px 30px',
              },
            }}
            value={emailChip}
          />
        </Box>
        <StyledTextFilledField
          label={'Subject:'}
          onChange={(e) => setSubject(e.target.value)}
          value={subject}
        />
      </Stack>
      <InboxEditor
        config={{ height: '400px' }}
        initData={forwardContent}
        ref={editorRef}
      />
    </Stack>
  );
};
