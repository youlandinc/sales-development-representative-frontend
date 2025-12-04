import { FC } from 'react';
import { Stack } from '@mui/material';

import { useDirectoriesStore } from '@/stores/directories';
import { useShallow } from 'zustand/react/shallow';

import { PreviewSummary, PreviewTable } from './index';

export const DirectoriesIndustryPreview: FC = () => {
  const { previewBody, isLoadingPreview, hasSubmittedSearch } =
    useDirectoriesStore(
      useShallow((state) => ({
        previewBody: state.previewBody,
        isLoadingPreview: state.isLoadingPreview,
        hasSubmittedSearch: state.hasSubmittedSearch,
      })),
    );

  const { findCount, maxImportCount, defaultPreviewCount } = previewBody;

  const isShowResult =
    isLoadingPreview || (hasSubmittedSearch && findCount > 0);

  return (
    <Stack sx={{ flex: 1, py: 1.5, gap: 1.5, overflow: 'hidden' }}>
      <PreviewSummary
        importCount={maxImportCount}
        isShowResult={isShowResult}
        loading={isLoadingPreview}
        previewCount={defaultPreviewCount}
        totalCount={findCount}
      />
      <Stack sx={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
        <PreviewTable />
      </Stack>
    </Stack>
  );
};
