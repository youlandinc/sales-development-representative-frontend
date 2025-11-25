import { FC } from 'react';

import { StyledCheckbox } from '@/components/atoms';

interface QueryCheckboxProps {
  label?: string;
  description?: string;
  value?: boolean;
  onFormChange: (checked: boolean) => void;
  subLabel?: string | null;
  disabled?: boolean;
}

export const QueryCheckbox: FC<QueryCheckboxProps> = ({
  subLabel,
  value = false,
  onFormChange,
  disabled = false,
}) => {
  return (
    <StyledCheckbox
      checked={value}
      disabled={disabled}
      label={subLabel ?? ''}
      onChange={(_, checked) => onFormChange(checked)}
    />
  );
};
