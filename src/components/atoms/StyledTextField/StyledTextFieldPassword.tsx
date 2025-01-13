import { FC, useCallback, useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { VisibilityOff, VisibilityOutlined } from '@mui/icons-material';

import { StyledTextField, StyledTextFieldProps } from './StyledTextField';

export interface StyledTextFieldPasswordProps extends StyledTextFieldProps {
  value: string;
}

export const StyledTextFieldPassword: FC<StyledTextFieldPasswordProps> = ({
  value,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  const onToggleVisibleClick = useCallback(() => {
    setVisible((old) => !old);
  }, []);

  return (
    <>
      <StyledTextField
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disableRipple
                  edge="end"
                  onClick={onToggleVisibleClick}
                  tabIndex={-1}
                >
                  {visible ? <VisibilityOutlined /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        type={visible ? 'text' : 'password'}
        value={value}
        {...rest}
      />
    </>
  );
};
