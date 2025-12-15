import { Icon, Stack } from '@mui/material';
import { FC, memo } from 'react';

import { StyledTabButton } from './StyledTabButton';

import ICON_LIGHTING from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_lighting.svg';
import ICON_SHARE from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_share.svg';
import ICON_TARGET from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_target.svg';

export type TabType = 'suggestions' | 'enrichments' | 'exports';

export interface TabsBarProps {
  activeTab: TabType;
  onTabClick: (tab: TabType) => void;
}

export const TabsBar: FC<TabsBarProps> = memo(({ activeTab, onTabClick }) => (
  <Stack flexDirection={'row'} gap={1.25}>
    <StyledTabButton
      icon={<Icon component={ICON_TARGET} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === 'suggestions'}
      label={'Suggestions'}
      onClick={() => onTabClick('suggestions')}
    />
    <StyledTabButton
      icon={<Icon component={ICON_LIGHTING} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === 'enrichments'}
      label={'Enrichments'}
      onClick={() => onTabClick('enrichments')}
    />
    <StyledTabButton
      icon={<Icon component={ICON_SHARE} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === 'exports'}
      label={'Exports'}
      onClick={() => onTabClick('exports')}
    />
  </Stack>
));
