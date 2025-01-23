import { Stack } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';
import { CommonBackButton, StyledTextFieldLabel } from '@/components/molecules';
import { HttpError, HttpVariantEnum } from '@/types';
import { useSwitch } from '@/hooks';
import { _generateOffersInfo } from '@/request/library/offers';
import { useState } from 'react';

const textareaStyle = {
  '& .MuiOutlinedInput-input': {
    p: 0,
  },
};

export const LibraryNewOffers = () => {
  const router = useRouter();
  const [painPoint, setPainPoint] = useState('');
  const [valueProposition, setValueProposition] = useState('');
  const [proofPoint, setProofPoint] = useState('');
  const { visible, open, close } = useSwitch();

  const handleClick = async () => {
    open();
    try {
      const { data } = await _generateOffersInfo({
        productName: 'Youland',
        productPage: 'https://los.youland.com',
      });
      setPainPoint(data.painPoint);
      setProofPoint(data.proofPoint);
      setValueProposition(data.valueProposition);
      close();
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  };

  return (
    <Stack gap={3}>
      <CommonBackButton backPath={'/library'} title={'offers'} />
      <Stack autoComplete={'off'} component={'form'} gap={1.5}>
        <StyledTextFieldLabel label={'Product name'} required>
          <StyledTextField defaultValue={'Youland'} required />
        </StyledTextFieldLabel>
        <StyledTextFieldLabel label={'Product page'} required>
          <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
            <StyledTextField
              defaultValue={'los.youland.com'}
              required
              slotProps={{
                input: {
                  startAdornment: 'https://',
                },
              }}
            />
            <StyledButton
              color={'info'}
              loading={visible}
              onClick={handleClick}
              variant={'outlined'}
            >
              Smart extract
            </StyledButton>
          </Stack>
        </StyledTextFieldLabel>
        <StyledTextFieldLabel label={'Pain point #1'} required>
          <StyledTextField
            multiline
            onChange={(e) => setPainPoint(e.target.value)}
            required
            rows={5}
            sx={{
              ...textareaStyle,
            }}
            value={painPoint}
          />
        </StyledTextFieldLabel>
        <StyledTextFieldLabel label={'Value proposition'} required>
          <StyledTextField
            multiline
            onChange={(e) => setValueProposition(e.target.value)}
            required
            rows={5}
            sx={{
              ...textareaStyle,
            }}
            value={valueProposition}
          />
        </StyledTextFieldLabel>
        <StyledTextFieldLabel label={'Proof point'} required>
          <StyledTextField
            multiline
            onChange={(e) => setProofPoint(e.target.value)}
            required
            rows={5}
            sx={{
              ...textareaStyle,
            }}
            value={proofPoint}
          />
        </StyledTextFieldLabel>
        {/*        <Divider sx={{ my: 1.5 }} />
        <StyledTextFieldLabel label={'Pain point #2'} required>
          <StyledTextField
            multiline
            required
            rows={5}
            sx={{
              ...textareaStyle,
            }}
          />
        </StyledTextFieldLabel>
        <StyledTextFieldLabel label={'Value proposition'} required>
          <StyledTextField
            multiline
            required
            rows={5}
            sx={{
              ...textareaStyle,
            }}
          />
        </StyledTextFieldLabel>
        <StyledTextFieldLabel label={'Proof point'} required>
          <StyledTextField
            multiline
            required
            rows={5}
            sx={{
              ...textareaStyle,
            }}
          />
        </StyledTextFieldLabel>
        <StyledButton
          color={'info'}
          loading={visible}
          onClick={handleClick}
          sx={{ alignSelf: 'flex-start' }}
          variant={'outlined'}
        >
          Smart extract
        </StyledButton>
        <Divider sx={{ mt: 1.5 }} />*/}
      </Stack>
      <StyledButton
        onClick={() => {
          SDRToast({
            header: 'Save successfully!',
            variant: HttpVariantEnum.success,
            message: undefined,
          });
          router.push('/library');
        }}
        sx={{ alignSelf: 'flex-start' }}
      >
        Save and continue
      </StyledButton>
    </Stack>
  );
};
