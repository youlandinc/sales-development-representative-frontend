import {
  Box,
  Drawer,
  Icon,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import {
  SculptingPrompt,
  WebResearchConfigure,
  WebResearchGenerate,
} from '@/components/molecules';

import { useGeneratePrompt } from '@/hooks/useGeneratePrompt';

import { useProspectTableStore, useWebResearchStore } from '@/stores/Prospect';

import ICON_SPARK from './assets/icon_sparkle.svg';
import ICON_ARROW from './assets/icon_arrow.svg';

export const WebResearch = () => {
  const [tab, setTab] = useState<'generate' | 'configure'>('generate');
  const [text, setText] = useState('');
  const { setPrompt, open, setOpen } = useWebResearchStore((state) => state);
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
    <Drawer
      anchor={'right'}
      onClose={() => {
        setOpen(false);
        setTab('generate');
      }}
      open={open}
    >
      <Box maxWidth={500} p={3} width={500}>
        {isLoading ? (
          <SculptingPrompt isLoading={isThinking} prompt={text} />
        ) : (
          <Stack gap={3}>
            <Stack alignItems={'center'} flexDirection={'row'}>
              <Icon
                component={ICON_ARROW}
                onClick={() => {
                  setOpen(false);
                }}
                sx={{ width: 20, height: 20, mr: 3, cursor: 'pointer' }}
              />
              <Icon
                component={ICON_SPARK}
                sx={{ width: 20, height: 20, mr: 0.5 }}
              />
              <Typography>Al web researcher</Typography>
            </Stack>
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
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};
