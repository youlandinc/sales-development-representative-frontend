import Image from 'next/image';
import { FC } from 'react';

import { StyledActionItem } from '@/components/molecules/EnrichmentDetail/Dialog/Common';

import { EnrichmentCategoryEnum, IntegrationAction } from '@/types';

export interface ConfigItem extends IntegrationAction {
  sourceCategory?: EnrichmentCategoryEnum;
}

interface ConfigActionsListProps {
  configs: ConfigItem[];
  onItemClick: (config: ConfigItem) => void;
}

/**
 * 配置操作列表组件
 * 渲染右侧选中供应商的配置列表
 */
export const ConfigActionsList: FC<ConfigActionsListProps> = ({
  configs,
  onItemClick,
}) => {
  if (!configs || configs.length === 0) {
    return null;
  }
  return (
    <>
      {configs.map((config, configIndex) => {
        return (
          <StyledActionItem
            description={config?.description ?? ''}
            icon={
              config?.logoUrl ? (
                <Image
                  alt={'Provider'}
                  height={16}
                  src={config?.logoUrl}
                  width={16}
                />
              ) : undefined
            }
            key={`config${config?.name}-${configIndex}`}
            onClick={() => onItemClick(config)}
            title={config?.name ?? ''}
          />
        );
      })}
    </>
  );
};
