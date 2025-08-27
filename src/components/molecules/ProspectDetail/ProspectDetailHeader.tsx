import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { debounce, Icon, Stack } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { CommonRenameTextField, LayoutUserInfo } from '@/components/molecules';

import { useProspectTableStore } from '@/stores/Prospect';

import ICON_BACK from './assets/head/icon-back.svg';
import ICON_COLUMN from './assets/head/icon-column.svg';

import ICON_VIEW from './assets/head/icon-view.svg';
import ICON_ROW from './assets/head/icon-row.svg';
import ICON_FILTER from './assets/head/icon-filter.svg';
import ICON_SEARCH from './assets/head/icon-search.svg';

import {
  HeadColumnsPanel,
  HeadFilterPanel,
  HeadRowsPanel,
  HeadViewPanel,
} from './Panel';

interface ProspectDetailHeaderProps {
  tableId: string;
}

export const ProspectDetailHeader: FC<ProspectDetailHeaderProps> = ({
  tableId,
}) => {
  const { resetTable, tableName, renameTable } = useProspectTableStore(
    (store) => store,
  );

  const router = useRouter();

  const [rename, setRename] = useState(tableName);

  const debounceRename = useMemo(
    () =>
      debounce(async (value) => {
        await renameTable(tableId, value);
      }, 500),
    [renameTable, tableId],
  );

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setRename(e.target.value);
    await debounceRename(e.target.value);
  };

  useEffect(() => {
    setRename(tableName);
  }, [tableName]);

  return (
    <Stack gap={3} pb={1.5} pt={3} px={4}>
      <Stack alignItems={'center'} flexDirection={'row'} height={32}>
        <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
          <Icon
            component={ICON_BACK}
            onClick={() => {
              resetTable();
              router.push('/prospect-enrich');
            }}
            sx={{ width: 20, height: 20, mt: 0.25, cursor: 'pointer' }}
          />
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            height={'100%'}
            sx={{
              cursor: 'pointer',
            }}
          >
            <CommonRenameTextField
              onChange={onChange}
              slotProps={{
                input: {
                  onBlur: (e) => {
                    if (e.target.value === '') {
                      setRename(tableName);
                    }
                  },
                },
              }}
              sx={{ mt: 0.25 }}
              value={rename}
            />
          </Stack>
        </Stack>

        <Stack ml={'auto'}>
          <LayoutUserInfo />
        </Stack>
      </Stack>

      <Stack flexDirection={'row'} gap={1.5} height={32} ml={-1.5}>
        <HeadViewPanel />
        <HeadColumnsPanel />
        <HeadRowsPanel />
        <HeadFilterPanel />

        {/*<Stack*/}
        {/*  data-toolbar-button*/}
        {/*  onClick={(e) => handleMenuClick(e, 'search')}*/}
        {/*  sx={{*/}
        {/*    gap: 0.5,*/}
        {/*    px: 1.5,*/}
        {/*    borderRadius: 1,*/}
        {/*    flexDirection: 'row',*/}
        {/*    alignItems: 'center',*/}
        {/*    cursor: 'pointer',*/}
        {/*    '&:hover': { bgcolor: '#EDEDED' },*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Icon component={ICON_SEARCH} sx={{ width: 20, height: 20 }} />*/}
        {/*  <Typography fontSize={14}>Search</Typography>*/}
        {/*</Stack>*/}
      </Stack>
    </Stack>
  );
};
