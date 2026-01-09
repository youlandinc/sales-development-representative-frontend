import { Stack } from '@mui/material';
import { FC, memo } from 'react';

import { StyledTabButton } from './StyledTabButton';

import { DrawersIconConfig } from '../../DrawersIconConfig';
import { TabTypeEnum } from '@/stores/enrichment/useActionsStore';

export interface TabsBarProps {
  activeTab: TabTypeEnum;
  onTabClick: (tab: TabTypeEnum) => void;
}

export const TabsBar: FC<TabsBarProps> = memo(({ activeTab, onTabClick }) => (
  <Stack flexDirection={'row'} gap={1.25}>
    <StyledTabButton
      icon={<DrawersIconConfig.ActionMenuTarget size={20} />}
      isActive={activeTab === TabTypeEnum.suggestions}
      label={'Suggestions'}
      onClick={() => onTabClick(TabTypeEnum.suggestions)}
    />
    <StyledTabButton
      icon={<DrawersIconConfig.ActionMenuLighting size={20} />}
      isActive={activeTab === TabTypeEnum.enrichments}
      label={'Enrichments'}
      onClick={() => onTabClick(TabTypeEnum.enrichments)}
    />
    <StyledTabButton
      icon={<DrawersIconConfig.ActionMenuShare size={20} />}
      isActive={activeTab === TabTypeEnum.exports}
      label={'Exports'}
      onClick={() => onTabClick(TabTypeEnum.exports)}
    />
  </Stack>
));
