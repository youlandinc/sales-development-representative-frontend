import {
  debounce,
  Drawer,
  DrawerProps,
  Icon,
  Stack,
  Typography,
} from '@mui/material';
import Fuse from 'fuse.js';
import { FC, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';
import {
  StyledCellDetailsArray,
  StyledCellItemContainer,
} from '@/components/molecules';
import { StyledCellDetailsObj } from './StyledCellDetailsObj';

import { useProspectTableStore } from '@/stores/enrichment';

import { HttpVariantEnum } from '@/types';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

import { UTypeOf } from '@/utils';

import ICON_SPARK from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_sparkle.svg';
import { ContentCopy } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

type CellDetailsProps = {
  data: Record<string, any>;
} & DrawerProps;
export const DialogCellDetails: FC<CellDetailsProps> = ({ data, ...rest }) => {
  const { dialogType, closeDialog, dialogVisible } = useProspectTableStore(
    useShallow((state) => ({
      dialogType: state.dialogType,
      closeDialog: state.closeDialog,
      dialogVisible: state.dialogVisible,
    })),
  );

  const [searchText, setSearchText] = useState('');

  // 将 data 转换为扁平化的可搜索数组（包含嵌套对象的每个字段）
  const flattenedEntries = useMemo(() => {
    const result: Array<{
      key: string;
      value: any;
      searchableValue: string;
      parentKey?: string;
    }> = [];

    const flatten = (obj: Record<string, any>, parentKey?: string) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (
          !UTypeOf.isNull(value) &&
          UTypeOf.isObject(value) &&
          !Array.isArray(value)
        ) {
          // 添加父对象条目（用于显示）
          result.push({
            key,
            value,
            searchableValue: '', // 父对象本身不参与搜索
            parentKey,
          });
          // 递归扁平化嵌套对象
          flatten(value, key);
        } else {
          result.push({
            key,
            value,
            searchableValue: Array.isArray(value)
              ? value.join(' ')
              : String(value ?? ''),
            parentKey,
          });
        }
      });
    };

    flatten(data);
    return result;
  }, [data]);

  // 创建 Fuse 实例（只搜索非嵌套对象的条目）
  const fuse = useMemo(() => {
    const searchableEntries = flattenedEntries.filter(
      (entry) => entry.searchableValue !== '',
    );
    return new Fuse(searchableEntries, {
      keys: ['key', 'searchableValue'],
      threshold: 0.1,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [flattenedEntries]);

  // 原始顶层数据（用于无搜索时显示）
  const topLevelEntries = useMemo(() => {
    return Object.entries(data).map(([key, value]) => ({
      key,
      value,
      searchableValue: '',
    }));
  }, [data]);

  // 过滤后的数据
  const filteredEntries = useMemo(() => {
    if (!searchText.trim()) {
      return topLevelEntries;
    }
    const searchResults = fuse.search(searchText).map((result) => result.item);
    // 去重：如果有嵌套字段匹配，只显示该字段，不显示父对象
    const matchedKeys = new Set(searchResults.map((r) => r.key));
    return searchResults.filter(
      (entry) => !entry.parentKey || !matchedKeys.has(entry.parentKey),
    );
  }, [searchText, fuse, topLevelEntries]);

  const debouncedSetSearch = useMemo(() => {
    return debounce((value: string) => {
      setSearchText(value);
    }, 300);
  }, []);

  const handleClose = () => {
    closeDialog();
  };

  return (
    <Drawer
      anchor={'right'}
      hideBackdrop
      open={
        dialogVisible && dialogType === TableColumnMenuActionEnum.cell_detail
      }
      sx={{
        left: 'unset',
      }}
      {...rest}
    >
      <Stack height={'100%'} justifyContent={'space-between'}>
        {/* header */}
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          px={3}
          py={2}
          width={500}
        >
          <Icon
            component={ICON_SPARK}
            sx={{ width: 20, height: 20, mr: 0.5 }}
          />
          <Typography fontWeight={600} mr={1}>
            Cell details
          </Typography>
          <StyledButton
            color={'info'}
            endIcon={<ContentCopy sx={{ width: 12, height: 12 }} />}
            onClick={async () => {
              await navigator.clipboard.writeText(JSON.stringify(data));
              SDRToast({
                message: 'Copied to Clipboard',
                header: false,
                variant: 'success' as HttpVariantEnum,
              });
            }}
            size={'small'}
            variant={'outlined'}
          >
            Copy JSON
          </StyledButton>
          <CloseIcon
            onClick={handleClose}
            sx={{ fontSize: 20, ml: 'auto', cursor: 'pointer' }}
          />
        </Stack>
        {/* content */}
        <Stack flex={1} gap={1.5} maxWidth={500} px={3} py={1} width={500}>
          <StyledTextField
            onChange={(e) => {
              debouncedSetSearch(e.target.value);
            }}
            placeholder={'Search'}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: 'text.secondary' }} />,
              },
            }}
            sx={{
              bgcolor: '#FFF',
            }}
            variant={'outlined'}
          />
          {filteredEntries.map(({ key, value }) => {
            if (Array.isArray(value)) {
              return (
                <StyledCellDetailsArray
                  key={key}
                  title={key}
                  value={value as string[]}
                />
              );
            }
            if (UTypeOf.isObject(value)) {
              return (
                <StyledCellDetailsObj
                  key={key}
                  title={key}
                  value={value as Record<string, any>}
                />
              );
            }
            return (
              <StyledCellItemContainer copyContent={value} key={key}>
                <Stack gap={1} key={key} width={'fit-content'}>
                  <Typography variant={'body2'}>{key}</Typography>
                  <Typography color={'text.secondary'} variant={'body3'}>
                    {value}
                  </Typography>
                </Stack>
              </StyledCellItemContainer>
            );
          })}
        </Stack>
        {/* footer */}
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          height={48}
          px={3}
        ></Stack>
      </Stack>
    </Drawer>
  );
};
