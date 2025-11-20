import { FC } from 'react';

import { StyledCheckbox } from '@/components/atoms';

interface QueryCheckboxProps {
  label?: string;
  description?: string;
  value?: boolean;
  onFormChange: (checked: boolean) => void;
  subLabel?: string | null;
}

export const QueryCheckbox: FC<QueryCheckboxProps> = ({
  subLabel,
  value = false,
  onFormChange,
}) => {
  return (
    <StyledCheckbox
      checked={value}
      label={subLabel ?? ''}
      onChange={(_, checked) => onFormChange(checked)}
    />
  );
};
