import { Icon, MenuItem, Stack, SxProps, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { StyledSelect } from '@/components/atoms';

import { useWebResearchStore } from '@/stores/enrichment';

import ICON_COINS from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_coins.svg';

export interface ModelSelectProps {
  // value: string;
  // onChange: (value: string) => void;
  // groups: ModelGroupItem[];
  placeholder?: string;
  sx?: SxProps;
  disabled?: boolean;
}

interface FlatOption extends TOption {
  isGroupHeader?: boolean;
  description?: string;
  inputCredits?: number | string;
  outputCredits?: number | string;
  logoUrl?: string;
}

const MENU_PAPER_SX: SxProps = {
  boxShadow:
    '0px 0px 2px 0px rgba(17, 52, 227, 0.1), 0px 10px 10px 0px rgba(17, 52, 227, 0.1)',
  maxWidth: 400,
  minWidth: 0,
  p: 0,
};

const MENU_LIST_SX: SxProps = {
  py: 1.5,
  '& .MuiMenuItem-root': {
    px: 1.5,
    py: 0,
    '&:hover': {
      bgcolor: 'transparent',
    },
    '&.Mui-selected': {
      bgcolor: 'transparent',
    },
  },
};

export const ModelSelect: FC<ModelSelectProps> = ({
  // value,
  // onChange,
  // groups,
  placeholder = 'Select model',
  sx,
  disabled,
}) => {
  const { aiModelList, setSuggestedModelType, suggestedModelType } =
    useWebResearchStore(
      useShallow((store) => ({
        aiModelList: store.aiModelList,
        suggestedModelType: store.suggestedModelType,
        setSuggestedModelType: store.setSuggestedModelType,
      })),
    );
  // 将分组数据扁平化为 options 数组
  const flatOptions = useMemo<FlatOption[]>(() => {
    const result: FlatOption[] = [];

    aiModelList.forEach((group) => {
      // 添加分组标题
      result.push({
        key: `header_${group.groupLabel}`,
        value: `header_${group.groupLabel}`,
        label: group.groupLabel,
        isGroupHeader: true,
        disabled: true,
      });

      // 添加分组选项
      group.options.forEach((opt) => {
        result.push({
          key: opt.value,
          value: opt.label,
          label: opt.label,
          logoUrl: opt.logoUrl,
          description: opt.description,
          inputCredits: opt.inputCredits,
          outputCredits: opt.outputCredits,
        });
      });
    });

    return result;
  }, [aiModelList]);

  // 渲染选中值（带 logo）
  const renderValue = useCallback(
    (selected: unknown) => {
      const selectedOption = flatOptions.find(
        (opt) => opt.value === selected && !opt.isGroupHeader,
      );
      if (!selectedOption) {
        return null;
      }
      return (
        <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
          {selectedOption.logoUrl && (
            <Image
              alt={''}
              height={16}
              src={selectedOption.logoUrl}
              width={16}
            />
          )}
          <Typography color={'#363440'} fontSize={14} lineHeight={1.4}>
            {selectedOption.label}
          </Typography>
        </Stack>
      );
    },
    [flatOptions],
  );

  const renderCredits = useCallback((option: FlatOption) => {
    if (
      option.inputCredits === undefined &&
      option.outputCredits === undefined
    ) {
      return null;
    }

    return (
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={0.5}
        sx={{
          '& svg path': {
            fill: '#6F6C7D',
          },
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            gap: 0.5,
            px: 1,
            py: '2px',
            borderRadius: 2,
            border: '1px solid #F4F5F9',
            alignItems: 'center',
          }}
        >
          <Icon component={ICON_COINS} sx={{ width: 16, height: 16 }} />
          <Typography color={'text.secondary'} fontSize={12} lineHeight={1}>
            {option.inputCredits ?? '-'}
          </Typography>
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            gap: 0.5,
            px: 1,
            py: '2px',
            borderRadius: 2,
            border: '1px solid #F4F5F9',
            alignItems: 'center',
          }}
        >
          <Typography color={'text.secondary'} fontSize={12} lineHeight={1}>
            Web
          </Typography>
          <Icon component={ICON_COINS} sx={{ width: 16, height: 16 }} />
          <Typography color={'text.secondary'} fontSize={12} lineHeight={1}>
            {option.outputCredits ?? '-'}
          </Typography>
        </Stack>
      </Stack>
    );
  }, []);

  const renderOption = useCallback(
    (opt: TOption) => {
      const option = opt as FlatOption;

      // 渲染分组标题
      if (option.isGroupHeader) {
        return (
          <MenuItem
            disabled
            key={option.key}
            sx={{
              bgcolor: 'transparent !important',
              cursor: 'default !important',
              opacity: '1 !important',
              py: '0 !important',
            }}
            value={option.value}
          >
            <Typography color={'#9095A3'} fontSize={12} lineHeight={1.5}>
              {option.label}
            </Typography>
          </MenuItem>
        );
      }

      // 渲染普通选项
      const hasCredits =
        option.inputCredits !== undefined || option.outputCredits !== undefined;
      const hasDescription = !!option.description;

      return (
        <MenuItem key={option.key} value={option.value}>
          <Stack
            gap={0.5}
            px={1.5}
            py={1}
            sx={{
              borderRadius: 1,
              width: '100%',
              '&:hover': {
                bgcolor: '#F4F5F9',
              },
            }}
            width={'100%'}
          >
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={0.5}
              justifyContent={'space-between'}
              width={'100%'}
            >
              <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                {option.logoUrl && (
                  <Image alt="" height={16} src={option.logoUrl} width={16} />
                )}
                <Typography color={'#363440'} fontSize={14} lineHeight={1.4}>
                  {option.label}
                </Typography>
              </Stack>
              {hasCredits && renderCredits(option)}
            </Stack>
            {hasDescription && (
              <Typography
                color={'#B0ADBD'}
                fontSize={12}
                lineHeight={1.5}
                sx={{
                  whiteSpace: 'normal',
                }}
              >
                {option.description}
              </Typography>
            )}
          </Stack>
        </MenuItem>
      );
    },
    [renderCredits],
  );

  return (
    <StyledSelect
      disabled={disabled}
      menuPaperSx={MENU_PAPER_SX}
      onChange={(e) => setSuggestedModelType(e.target.value as string)}
      options={flatOptions}
      placeholder={placeholder}
      renderOption={renderOption}
      renderValue={renderValue}
      sx={sx}
      sxList={MENU_LIST_SX}
      value={suggestedModelType}
    />
  );
};
