import { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { Icon, Stack, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';
import { CommonBackButton } from '@/components/molecules';
import { useSwitch } from '@/hooks';

import { HttpError, HttpVariantEnum } from '@/types';

import ICON_WARNING from './assets/icon_warning.svg';

type StyledTextFieldLabelProps = {
  label?: ReactNode;
  required?: boolean;
  toolTipTittle?: ReactNode;
};

export const StyledTextFieldLabel: FC<
  PropsWithChildren<StyledTextFieldLabelProps>
> = ({ children, label, required, toolTipTittle }) => {
  return (
    <Stack gap={1}>
      <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
        <Stack alignItems={'center'} flexDirection={'row'} gap={'2px'}>
          <Typography fontWeight={600}>{label}</Typography>
          {required && <Typography color={'#E26E6E'}>*</Typography>}
        </Stack>
        <Tooltip title={toolTipTittle}>
          <Icon component={ICON_WARNING} sx={{ width: 18, height: 18 }} />
        </Tooltip>
      </Stack>
      {children}
    </Stack>
  );
};

export const LibraryCompanyEdit = () => {
  const router = useRouter();
  const [sellingInfo, setSellingInfo] = useState('');
  const { visible, open, close } = useSwitch();

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
          companyName: 'Youland',
          companyPage: 'https://youland.com/',
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
              setSellingInfo(str);

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
    /*await _generateSellingInfo().then((res) => {
      const dataStream = res.data;
       // 处理数据流
      const lines: string[] = dataStream.split('\n');
      let str = '';
      lines.forEach((line) => {
        if (line.startsWith('data:')) {
          const data = line.replace('data:', '');
          str = str + data;
          setSellingInfo(str);
        }
      });
    });*/
  };

  return (
    <Stack gap={3} maxWidth={1200}>
      <CommonBackButton backPath={'/library'} title={'Company overview'} />
      <Stack autoComplete={'off'} component={'form'} gap={1.5}>
        <StyledTextFieldLabel
          label={'Company name'}
          required
          toolTipTittle={
            'Enter the full name of your company as it should appear in emails sent to target users.'
          }
        >
          <StyledTextField defaultValue={'Youland'} required />
        </StyledTextFieldLabel>
        <StyledTextFieldLabel
          label={'Company page'}
          required
          toolTipTittle={
            "Provide your company's website URL. This link will be included in emails to direct users to learn more about your business."
          }
        >
          <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
            <StyledTextField
              defaultValue={'youland.com'}
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
              onClick={handleExtract}
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
              setSellingInfo(e.target.value);
            }}
            required
            rows={10}
            sx={{
              '& .MuiOutlinedInput-input': {
                p: 0,
                height: 'auto !important',
              },
            }}
            value={sellingInfo}
          />
        </StyledTextFieldLabel>
      </Stack>
      <StyledButton
        onClick={() => {
          SDRToast({
            header: '',
            message: 'Save successfully!',
            variant: HttpVariantEnum.success,
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
