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
        multiple={true}
        onFormChange={(newValue: string[]) => {
          onInsideFormChange(newValue);
        }}
        options={[]}
        placeholder={'e.g. Amazon'}
        url={''}
        value={value}
      />
    </QueryContainer>
  );
};
