import {
  Box,
  Drawer,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';

import {
  SculptingPrompt,
  WebResearchConfigure,
  WebResearchGenerate,
} from '@/components/molecules';

import { useGeneratePrompt } from '@/hooks/useGeneratePrompt';

import { useProspectTableStore, useWebResearchStore } from '@/stores/Prospect';

export const WebResearch = () => {
  const [tab, setTab] = useState<'generate' | 'configure'>('generate');
  const [text, setText] = useState('');
  const { setPrompt } = useWebResearchStore((state) => state);
  const { headers, rowIds } = useProspectTableStore((store) => store);
  const { generatePrompt, isLoading, done, isThinking } = useGeneratePrompt(
    '/sdr/ai/generate',
    {
      module: 'COLUMN_ENRICHMENT_PROMPT',
      params: {
        useInput: "help me to find user's email and phone number",
        columns:
          'First Name,Last Name,Full Name,Job Title, Location,Company Name,LinkedIn Profile,University',
      },
    },
    setText,
    setPrompt,
  );
  console.log(headers);
  useEffect(() => {
    if (done) {
      setTab('configure');
    }
  }, [done]);

  return (
    <Drawer anchor={'right'}>
      <Box maxWidth={500} p={3} width={500}>
        {isLoading ? (
          <SculptingPrompt isLoading={isThinking} prompt={text} />
        ) : (
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

            <Box
              display={tab === 'generate' ? 'block' : 'none'}
              sx={{
                transition: 'all .3s',
              }}
            >
              <WebResearchGenerate
                handleGeneratePrompt={generatePrompt}
                isLoading={isLoading}
              />
            </Box>

            <Box
              display={tab === 'configure' ? 'block' : 'none'}
              sx={{
                transition: 'all .3s',
              }}
            >
              <WebResearchConfigure />
            </Box>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};
