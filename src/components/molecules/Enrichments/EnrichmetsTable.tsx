import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';

import { UseAiConfigure } from './UseAiConfigure';
import { UseAiGenerate } from './UseAiGenerate';

export const EnrichmetsTable = () => {
  const [tab, setTab] = useState<'generate' | 'configure'>('generate');
  return (
    <Stack gap={4}>
      <ToggleButtonGroup
        color={'primary'}
        exclusive
        onChange={(e, value) => {
          setTab(value);
        }}
        translate={'no'}
        value={tab}
      >
        <ToggleButton
          fullWidth
          sx={{
            fontSize: 14,
            textTransform: 'none',
            lineHeight: 1.2,
            py: 1,
            fontWeight: 600,
            borderRadius: '8px 0 0 8px',
          }}
          value={'generate'}
        >
          Generate
        </ToggleButton>
        <ToggleButton
          fullWidth
          sx={{
            fontSize: 14,
            textTransform: 'none',
            lineHeight: 1.2,
            py: 1,
            fontWeight: 600,
            borderRadius: '0 8px 8px 0',
          }}
          value={'configure'}
        >
          Configure
        </ToggleButton>
      </ToggleButtonGroup>
      {tab === 'generate' ? <UseAiGenerate /> : <UseAiConfigure />}
    </Stack>
  );
};
