import { FC } from 'react';

import { QueryAutoComplete, QueryContainer } from './index';

interface QueryListTextAreaProps {
  value: string[];
  onInsideFormChange: (param: string[]) => void;
  title: string;
  placeholder: string;
}

export const QueryListTextArea: FC<QueryListTextAreaProps> = ({
  value = [],
  onInsideFormChange,
  title,
  placeholder,
}) => {
  return (
    <QueryContainer isAuth={true} label={title}>
      <QueryAutoComplete
        freeSolo={true}
        multiple={true}
        onFormChange={(newValue: string[]) => {
          onInsideFormChange(newValue);
        }}
        options={[]}
        placeholder={placeholder}
        url={''}
        value={value}
      />
    </QueryContainer>
  );
};
