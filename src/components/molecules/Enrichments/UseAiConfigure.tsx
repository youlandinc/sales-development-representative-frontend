import {
  FormControlLabel,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { TiptapEditor } from './TiptapEditor';
import { CollapseCard } from './CollapseCard';
import { StyledSelect, StyledTextField } from '@/components/atoms';

import { MoreHoriz } from '@mui/icons-material';
import ICON_WARNING from './assets/icon_warning.svg';
export const UseAiConfigure = () => {
  return (
    <Stack gap={4}>
      <Stack>
        <Typography fontWeight={700} variant={'subtitle1'}>
          Promot
        </Typography>
        <TiptapEditor />
      </Stack>
      {/*outputs*/}
      <CollapseCard title={'Define outputs'}>
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
      </CollapseCard>
      {/*Run settings*/}
      <CollapseCard title={'Run settings'}>
        <Stack gap={1.5}>
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Typography variant={'subtitle1'}>Auto-update</Typography>
              <Tooltip
                title={
                  'Disable or enable automatic runs of this column on table updates.'
                }
              >
                <Icon component={ICON_WARNING} sx={{ width: 12, height: 12 }} />
              </Tooltip>
            </Stack>
            <Switch checked={true} />
          </Stack>
          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
            <Typography variant={'subtitle1'}>Only run if</Typography>
            <Tooltip title={'Only run if this formula resolves to true.'}>
              <Icon component={ICON_WARNING} sx={{ width: 12, height: 12 }} />
            </Tooltip>
          </Stack>
        </Stack>
      </CollapseCard>
    </Stack>
  );
};
