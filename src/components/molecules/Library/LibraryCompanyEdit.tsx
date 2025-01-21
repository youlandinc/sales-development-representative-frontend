import { FC, PropsWithChildren, ReactNode } from 'react';
import { Icon, Stack, Tooltip, Typography } from '@mui/material';

import { StyledButton, StyledTextField } from '@/components/atoms';
import { CommonBackButton } from '@/components/molecules';

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
          <StyledTextField required />
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
              required
              slotProps={{
                input: {
                  startAdornment: 'https://',
                },
              }}
            />
            <StyledButton color={'info'} variant={'outlined'}>
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
            required
            rows={10}
            sx={{
              '& .MuiOutlinedInput-input': {
                p: 0,
                height: 'auto !important',
              },
            }}
          />
        </StyledTextFieldLabel>
      </Stack>
      <StyledButton sx={{ alignSelf: 'flex-start' }}>
        Save and continue
      </StyledButton>
    </Stack>
  );
};
