import { ToggleButtonGroupProps } from '@mui/material';
type option = {
  label: string;
  value: string | number | boolean;
};
export interface StyledButtonGroupProps extends ToggleButtonGroupProps {
  options: option[];
}
