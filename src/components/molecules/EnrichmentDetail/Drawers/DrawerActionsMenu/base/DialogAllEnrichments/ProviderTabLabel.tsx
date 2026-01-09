import { Stack, Typography } from '@mui/material';
import Image from 'next/image';

/**
 * 类型定义，用于Provider标签组件
 */
export interface Provider {
  name?: string | null;
  key?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  waterfallConfigs?: Array<any> | null;
  [key: string]: any;
}

interface ProviderTabLabelProps {
  provider: Provider;
  isActive?: boolean;
}

/**
 * Provider标签内容组件
 * 显示供应商标签的图标和文本
 */
export const ProviderTabLabel = ({ provider }: ProviderTabLabelProps) => {
  return (
    <Stack
      sx={{
        gap: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {provider?.logoUrl && (
        <Image
          alt={'Provider'}
          height={20}
          src={provider?.logoUrl}
          width={20}
        />
      )}
      <Typography lineHeight={1.4} variant={'body2'}>
        {provider?.name}
      </Typography>
    </Stack>
  );
};
