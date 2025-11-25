import { RadioGroupProps, RadioProps } from '@mui/material';

export type Option<T = string | number | boolean> = {
  label: string;
  value: T;
  disabled?: boolean;
  selected?: boolean | null;
  [key: string]: any;
};

export interface StyledStyledRadioProps<T = string | number | boolean>
  extends RadioGroupProps {
  options: Option<T>[];
  label?: string;
}
export interface StyledRadioProps extends RadioProps {
  label?: string;
}
