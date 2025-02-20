import { Stack } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import { FC, useState } from 'react';

import {
  SDRToast,
  StyledButton,
  StyledTextField,
  StyledTextFieldProps,
} from '@/components/atoms';
import { CommonBackButton, StyledTextFieldLabel } from '@/components/molecules';
import { HttpError, HttpVariantEnum } from '@/types';
import { useAsyncFn, useSwitch } from '@/hooks';
import {
  _generateOffersInfo,
  _saveOffersInfo,
  SaveOffersInfoParam,
} from '@/request/library/offers';

const textareaStyle = {
  '& .MuiOutlinedInput-input': {
    p: 0,
  },
  '& .MuiInputBase-root': {
    py: 0.5,
  },
};

type StyledVerticalTextField = StyledTextFieldProps;

const StyledVerticalTextField: FC<StyledVerticalTextField> = ({
  label,
  value,
  onChange,
  required,
  ...rest
}) => {
  return (
    <StyledTextFieldLabel label={label} required={required}>
      <StyledTextField
        multiline
        onChange={onChange}
        required={required}
        value={value}
        {...rest}
      />
    </StyledTextFieldLabel>
  );
};

export const LibraryNewOffers = () => {
  const router = useRouter();
  const [painPoint, setPainPoint] = useState('');
  const [valueProposition, setValueProposition] = useState('');
  const [proofPoint, setProofPoint] = useState('');
  const { visible, open, close } = useSwitch();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleClick = async () => {
    open();
    try {
      const { data } = await _generateOffersInfo({
        productName: name,
        productPage: `https://${url}`,
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

  const [saveState, save] = useAsyncFn(async (params: SaveOffersInfoParam) => {
    try {
      await _saveOffersInfo(params);
      SDRToast({
        header: 'Save successfully!',
        variant: HttpVariantEnum.success,
        message: undefined,
      });
      router.push('/library');
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  return (
    <Stack gap={3}>
      <CommonBackButton backPath={'/library'} title={'offers'} />
      <Stack autoComplete={'off'} component={'form'} gap={1.5}>
        <StyledVerticalTextField
          label={'Product name'}
          onChange={(e) => setName(e.target.value)}
          required
          value={name}
        />
        <StyledTextFieldLabel label={'Product page'} required>
          <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
            <StyledTextField
              onChange={(e) => setUrl(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: 'https://',
                },
              }}
              value={url}
            />
            <StyledButton
              color={'info'}
              disabled={!name && !url}
              loading={visible}
              onClick={handleClick}
              sx={{ width: 128 }}
              variant={'outlined'}
            >
              Smart extract
            </StyledButton>
          </Stack>
        </StyledTextFieldLabel>
        <StyledVerticalTextField
          label={'Pain point #1'}
          multiline
          onChange={(e) => setPainPoint(e.target.value)}
          required
          rows={5}
          sx={{
            ...textareaStyle,
          }}
          value={painPoint}
        />
        <StyledVerticalTextField
          label={'Value proposition'}
          multiline
          onChange={(e) => setValueProposition(e.target.value)}
          required
          rows={5}
          sx={{
            ...textareaStyle,
          }}
          value={valueProposition}
        />
        <StyledVerticalTextField
          label={'Proof point'}
          multiline
          onChange={(e) => setProofPoint(e.target.value)}
          required
          rows={5}
          sx={{
            ...textareaStyle,
          }}
          value={proofPoint}
        />
      </Stack>
      <StyledButton
        loading={saveState.loading}
        onClick={async () => {
          await save({
            companyName: name,
            companyPage: `https://${url}`,
            propositionProfiles: [
              {
                painPoint: painPoint,
                valueProposition: valueProposition,
                proofPoint: proofPoint,
              },
            ],
          });
        }}
        sx={{ alignSelf: 'flex-start', width: 181 }}
      >
        Save and continue
      </StyledButton>
    </Stack>
  );
};
