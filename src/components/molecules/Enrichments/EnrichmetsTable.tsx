import {
  Collapse,
  Fade,
  FormControlLabel,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import ICON_ARROW from './assets/icon_collapse.svg';

import { useSwitch } from '@/hooks';
import { StyledSelect, StyledTextField } from '@/components/atoms';
import { MoreHoriz } from '@mui/icons-material';
import { TiptapEditor } from '@/components/molecules/Enrichments/TiptapEditor';

export const EnrichmetsTable = () => {
  const { visible, open, close } = useSwitch(true);
  return (
    <Stack gap={4}>
      <ToggleButtonGroup color={'primary'} exclusive>
        <ToggleButton value="left">Generate</ToggleButton>
        <ToggleButton value="center">Configure</ToggleButton>
      </ToggleButtonGroup>
      {/* promot */}
      <Stack>
        <Typography fontWeight={700} variant={'subtitle1'}>
          Promot
        </Typography>
        <TiptapEditor />
      </Stack>
      {/*outputs*/}
      <Stack border={'1px solid #ccc'} borderRadius={1} gap={1.5} p={1.5}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          onClick={() => {
            visible ? close() : open();
          }}
          sx={{
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <Typography fontWeight={600} variant={'subtitle1'}>
            Define outputs
          </Typography>
          <Icon
            component={ICON_ARROW}
            sx={{
              width: 16,
              height: 16,
              transform: visible ? 'none' : 'rotate(180deg)',
              transition: 'transform 0.2s',
            }}
          />
        </Stack>
        {visible && (
          <Stack gap={1.5}>
            <RadioGroup defaultValue="female">
              <FormControlLabel
                control={<Radio />}
                label="Fields"
                value="female"
              />
              <FormControlLabel
                control={<Radio />}
                label="JSON Schema"
                value="other"
              />
            </RadioGroup>
            <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
              <StyledTextField />
              <StyledSelect
                options={[
                  {
                    label: 'text',
                    value: 'text',
                    key: 'text',
                  },
                ]}
              />
              <MoreHoriz
                sx={{
                  fontSize: 20,
                  color: 'text.primary',
                  cursor: 'pointer',
                }}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
