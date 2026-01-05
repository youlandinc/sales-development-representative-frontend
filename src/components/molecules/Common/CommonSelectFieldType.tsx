import { FC } from 'react';

import { StyledSelect, StyledSelectProps } from '@/components/atoms';

import { getAddColumnMenuActions } from '@/components/molecules/EnrichmentDetail/Table/config';

import { TableColumnTypeEnum } from '@/types/enrichment/table';
import { Stack, Typography } from '@mui/material';

export const CommonSelectFieldType: FC<Omit<StyledSelectProps, 'options'>> = ({
  value = TableColumnTypeEnum.text,
  ...rest
}) => {
  const options = getAddColumnMenuActions()
    .filter((opt) =>
      Object.values(TableColumnTypeEnum).includes(opt.value as any),
    )
    .map((opt) => ({
      icon: opt.icon,
      key: opt.value,
      value: opt.value,
      label: opt.label,
    }));

  return (
    <StyledSelect
      {...rest}
      options={options as any}
      renderValue={(selected) => {
        const option = options.find((opt) => opt.value === selected);
        return (
          <Stack alignItems={'center'} direction={'row'} gap={1}>
            {option?.icon}
            <Typography fontSize={14} lineHeight={1.5}>
              {option?.label || 'Text'}
            </Typography>
          </Stack>
        );
      }}
      value={value}
    />
  );
};
