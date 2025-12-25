import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { debounce, Icon, Stack } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { CommonRenameTextField, LayoutUserInfo } from '@/components/molecules';

import { useEnrichmentTableStore } from '@/stores/enrichment';

import ICON_BACK from './assets/head/icon-back.svg';

interface EnrichmentDetailHeaderProps {
  tableId: string;
}

export const EnrichmentDetailHeader: FC<EnrichmentDetailHeaderProps> = ({
  tableId,
}) => {
  const { resetTable, tableName, renameTable } = useEnrichmentTableStore(
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
    <Stack
      sx={{
        alignItems: 'center',
        height: 54,
        px: 4,
        gap: 3,
        flexDirection: 'row',
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 1,
        }}
      >
        <Icon
          component={ICON_BACK}
          onClick={() => {
            resetTable();
            router.push('/enrichment');
          }}
          sx={{ width: 20, height: 20, mt: 0.5, cursor: 'pointer' }}
        />
        <Stack
          sx={{
            alignItem: 'center',
            cursor: 'pointer',
            flexDirection: 'row',
            gap: 1,
            height: '100%',
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
  );
};
