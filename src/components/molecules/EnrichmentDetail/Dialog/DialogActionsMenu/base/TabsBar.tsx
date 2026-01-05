import { Icon, Stack } from '@mui/material';
import { FC, memo } from 'react';

import { StyledTabButton } from './StyledTabButton';

import ICON_LIGHTING from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_lighting.svg';
import ICON_SHARE from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_share.svg';
import ICON_TARGET from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_target.svg';
import { TabTypeEnum } from '@/stores/enrichment/useActionsStore';

export interface TabsBarProps {
  activeTab: TabTypeEnum;
  onTabClick: (tab: TabTypeEnum) => void;
}

export const TabsBar: FC<TabsBarProps> = memo(({ activeTab, onTabClick }) => (
  <Stack flexDirection={'row'} gap={1.25}>
    <StyledTabButton
      icon={<Icon component={ICON_TARGET} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === TabTypeEnum.suggestions}
      label={'Suggestions'}
      onClick={() => onTabClick(TabTypeEnum.suggestions)}
    />
    <StyledTabButton
      icon={<Icon component={ICON_LIGHTING} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === TabTypeEnum.enrichments}
      label={'Enrichments'}
      onClick={() => onTabClick(TabTypeEnum.enrichments)}
    />
    <StyledTabButton
      icon={<Icon component={ICON_SHARE} sx={{ width: 20, height: 20 }} />}
      isActive={activeTab === TabTypeEnum.exports}
      label={'Exports'}
      onClick={() => onTabClick(TabTypeEnum.exports)}
    />
  </Stack>
));
