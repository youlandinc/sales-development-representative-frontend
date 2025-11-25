import { FC } from 'react';
import { Stack } from '@mui/material';

import { useDirectoriesStore } from '@/stores/directories';

import { PreviewSummary, PreviewTable } from './index';

export const DirectoriesIndustryPreview: FC = () => {
  const previewHeader = useDirectoriesStore((state) => state.previewHeader);
  const previewBody = useDirectoriesStore((state) => state.previewBody);
  const isLoadingPreview = useDirectoriesStore(
    (state) => state.isLoadingPreview,
  );
  const hasSubmittedSearch = useDirectoriesStore(
    (state) => state.hasSubmittedSearch,
  );

  const { findCount, findList } = previewBody;

  const isShowResult =
    isLoadingPreview || (hasSubmittedSearch && findCount > 0);

  return (
    <Stack sx={{ flex: 1, p: 3, gap: 3, overflow: 'hidden' }}>
      <PreviewSummary
        importCount={Math.min(findCount, 1000)}
        isShowResult={isShowResult}
        loading={isLoadingPreview}
        totalCount={findCount}
      />
      <Stack sx={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <PreviewTable
          body={findList}
          header={previewHeader}
          isShowResult={isShowResult}
          loading={isLoadingPreview}
        />
      </Stack>
    </Stack>
  );
};
