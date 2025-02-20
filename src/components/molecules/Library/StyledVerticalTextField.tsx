import { FC, PropsWithChildren, ReactNode } from 'react';
import { Icon, Stack, Tooltip, Typography } from '@mui/material';

import { StyledTextField, StyledTextFieldProps } from '@/components/atoms';
import ICON_WARNING from '@/components/molecules/Library/assets/icon_warning.svg';

type StyledTextFieldLabelProps = {
  label: ReactNode | string;
  required?: boolean;
  toolTipTittle?: ReactNode;
};

export const StyledTextFieldLabel: FC<
  PropsWithChildren<StyledTextFieldLabelProps>
> = ({ children, label, required, toolTipTittle }) => {
  return (
    <Stack gap={1}>
      {typeof label === 'string' ? (
        <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
          <Stack alignItems={'center'} flexDirection={'row'} gap={'2px'}>
            <Typography fontWeight={600}>{label}</Typography>
            {required && <Typography color={'#E26E6E'}>*</Typography>}
          </Stack>
          <Tooltip title={toolTipTittle}>
            <Icon component={ICON_WARNING} sx={{ width: 18, height: 18 }} />
          </Tooltip>
        </Stack>
      ) : (
        label
      )}
      {children}
    </Stack>
  );
};

type StyledVerticalTextField = StyledTextFieldProps & {
  toolTipTittle?: ReactNode;
};

export const StyledVerticalTextField: FC<StyledVerticalTextField> = ({
  label,
  value,
  onChange,
  required,
  toolTipTittle,
  ...rest
}) => {
  return (
    <StyledTextFieldLabel
      label={label}
      required={required}
      toolTipTittle={toolTipTittle}
    >
      <StyledTextField
        onChange={onChange}
        required={required}
        value={value}
        {...rest}
      />
    </StyledTextFieldLabel>
  );
};
