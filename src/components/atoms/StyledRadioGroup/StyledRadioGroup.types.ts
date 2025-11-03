import { RadioGroupProps, RadioProps } from '@mui/material';
type option = {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
};
export interface StyledStyledRadioProps extends RadioGroupProps {
  options: option[];
  label?: string;
}
export interface StyledRadioProps extends RadioProps {
  label?: string;
}
