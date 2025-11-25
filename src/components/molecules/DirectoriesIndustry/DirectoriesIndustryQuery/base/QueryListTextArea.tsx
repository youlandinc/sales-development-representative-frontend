import { FC } from 'react';

import { QueryAutoComplete, QueryContainer } from './index';

interface QueryListTextAreaProps {
  value: string[];
  onInsideFormChange: (param: string[]) => void;
}

export const QueryListTextArea: FC<QueryListTextAreaProps> = ({
  value = [],
  onInsideFormChange,
}) => {
  return (
    <QueryContainer isAuth={true}>
      <QueryAutoComplete
        freeSolo={true}
        multiple
        onFormChange={(newValue: string[]) => {
          onInsideFormChange(newValue);
        }}
        placeholder={'e.g. Amazon'}
        value={value}
      />
    </QueryContainer>
  );
};
