import { Stack } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';
import {
  CommonBackButton,
  StyledTextFieldLabel,
  StyledVerticalTextField,
} from '@/components/molecules';
import { useAsyncFn, useSwitch } from '@/hooks';

import { HttpError, HttpVariantEnum } from '@/types';
import { _saveCompanyInfo } from '@/request/library/offers';

import { useLibraryStore } from '@/stores/useLibraryStore';

export const LibraryCompanyEdit = () => {
  const { companyName, companyPage, sellIntroduction, updateCompanyInfo } =
    useLibraryStore((state) => state);

  const router = useRouter();
  const { visible, open, close } = useSwitch();

  const [saveState, save] = useAsyncFn(
    async (param: {
      companyName: string;
      companyPage: string;
      sellIntroduction: string;
    }) => {
      try {
        await _saveCompanyInfo(param);
        SDRToast({
          header: '',
          message: 'Save successfully!',
          variant: HttpVariantEnum.success,
        });
        router.push('/library');
      } catch (e) {
        const { message, header, variant } = e as HttpError;
        SDRToast({ message, header, variant });
      }
    },
  );

  const handleExtract = async () => {
    let str = '';
    open();
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        module: 'PRODUCT_INTRODUCTION',
        params: {
          companyName: companyName,
          companyPage: `https://${companyPage}`,
        },
      }),
    })
      .then((response) => {
        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');

          const readStream = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                close();
                return;
              }
              // decode
              const data = decoder
                .decode(value)
                .replace(/data:/g, '')
                .replace(/\n/g, '');

              str = str + data;
              updateCompanyInfo('sellIntroduction', str);

              // continue read stream
              readStream();
            });
          };

          readStream();
        }
      })
      .catch((error) => {
        const { message, header, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      });
  };

  return (
    <Stack gap={3} maxWidth={1200}>
      <CommonBackButton backPath={'/library'} title={'Company overview'} />
      <Stack autoComplete={'off'} component={'form'} gap={1.5}>
        <StyledVerticalTextField
          label={'Company name'}
          onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
          required
          toolTipTittle={
            'Enter the full name of your company as it should appear in emails sent to target users.'
          }
          value={companyName}
        />
        <StyledTextFieldLabel
          label={'Company page'}
          required
          toolTipTittle={
            "Provide your company's website URL. This link will be included in emails to direct users to learn more about your business."
          }
        >
          <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
            <StyledTextField
              onChange={(e) => updateCompanyInfo('companyPage', e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: 'https://',
                },
              }}
              value={companyPage}
            />
            <StyledButton
              color={'info'}
              disabled={companyPage.trim() === ''}
              loading={visible}
              onClick={handleExtract}
              sx={{ width: 128 }}
              variant={'outlined'}
            >
              Smart extract
            </StyledButton>
          </Stack>
        </StyledTextFieldLabel>
        <StyledTextFieldLabel
          label={'What you are selling'}
          required
          toolTipTittle={
            'Describe what your company does and the value it delivers. Highlight your specialization, the industries you serve, and the unique benefits you bring to customers.'
          }
        >
          <StyledTextField
            multiline
            onChange={(e) => {
              updateCompanyInfo('sellIntroduction', e.target.value);
            }}
            required
            rows={10}
            sx={{
              '& .MuiOutlinedInput-input': {
                p: 0,
                height: 'auto !important',
              },
            }}
            value={sellIntroduction}
          />
        </StyledTextFieldLabel>
      </Stack>
      <StyledButton
        disabled={
          companyPage.trim() === '' &&
          companyName.trim() === '' &&
          sellIntroduction.trim() === ''
        }
        loading={saveState.loading}
        onClick={async () => {
          await save({
            companyName,
            companyPage,
            sellIntroduction,
          });
        }}
        sx={{ alignSelf: 'flex-start', width: 181 }}
      >
        Save and continue
      </StyledButton>
    </Stack>
  );
};
