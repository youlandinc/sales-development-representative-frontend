import { Icon, Stack } from '@mui/material';
import { FC, memo } from 'react';

import { useExport } from '../hooks';

import { StyledActionItem } from '../../Common';

export const ExportsContent: FC = memo(() => {
  const { EXPORTS_MENUS } = useExport();
  return (
    <Stack gap={1.5}>
      {EXPORTS_MENUS.map((item, index) => (
        <StyledActionItem
          description={item.description}
          icon={<Icon component={item.icon} sx={{ width: 16, height: 16 }} />}
          key={`export-${index}`}
          onClick={item.onClick}
          title={item.title}
        />
      ))}
    </Stack>
  );
});
