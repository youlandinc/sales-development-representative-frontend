import { FC } from 'react';
import { Stack } from '@mui/material';

import { StyledTextFieldNumber } from '@/components/atoms';
import {
  FilterContainer,
  FilterSelect,
  FilterSwitch,
  FilterTextField,
} from './index';

import { FilterElementTypeEnum, FilterItem } from '@/types';

type CreateFilterElementProps = {
  type: FilterElementTypeEnum;
  params: FilterItem;
  onChange?: (value: any) => void;
  value?: any;
};

export const CreateFilterElement: FC<CreateFilterElementProps> = ({
  type,
  params,
  onChange,
  value,
}) => {
  if (type === FilterElementTypeEnum.select) {
    return (
      <FilterSelect
        onChange={(_, value) => {
          onChange?.(value);
        }}
        options={params.optionValues || []}
        placeholder={params.placeholder}
        title={params.formLabel}
        value={(value || []) as Option[]}
      />
    );
  }
  if (type === FilterElementTypeEnum.input && params.inputType === 'NUMBER') {
    return (
      <FilterContainer subTitle={params.description} title={params.formLabel}>
        <StyledTextFieldNumber
          decimalScale={0}
          isAllowed={({ floatValue }) => {
            return (floatValue || 0) <= 1000;
          }}
          onValueChange={({ floatValue }) => {
            onChange?.(floatValue);
          }}
          placeholder={params.placeholder}
          value={(value as number) || ''}
        />
      </FilterContainer>
    );
  }
  if (type === FilterElementTypeEnum.input && params.inputType === 'TEXT') {
    return (
      <FilterTextField
        onChange={(value) => onChange?.(value)}
        placeholder={params.placeholder}
        title={params.formLabel}
        value={(value || []) as Option[]}
      />
    );
  }
  if (type === FilterElementTypeEnum.switch) {
    return (
      <FilterSwitch
        checked={value as boolean}
        description={params.description}
        label={params.formLabel}
        onChange={(_, checked) => {
          onChange?.(checked);
        }}
      />
    );
  }
  if (type === FilterElementTypeEnum.checkbox) {
    return <FilterTextField title={params.formLabel} />;
  }
  if (type === FilterElementTypeEnum.radio) {
    return <FilterTextField title={params.formLabel} />;
  }
  if (type === FilterElementTypeEnum.between) {
    return <FilterTextField title={params.formLabel} />;
  }
  if (params.groups) {
    return (
      <Stack flexDirection={'row'} gap={1}>
        {params.groups.map((item) => (
          <CreateFilterElement
            key={item.formKey}
            onChange={onChange}
            params={item}
            type={item.formType}
            value={value}
          />
        ))}
      </Stack>
    );
  }
  return null;
};
