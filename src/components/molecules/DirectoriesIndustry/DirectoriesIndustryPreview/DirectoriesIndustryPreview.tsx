import { FC } from 'react';
import { Stack } from '@mui/material';

import { useDirectoriesStore } from '@/stores/directories';
import { useShallow } from 'zustand/react/shallow';

import { PreviewSummary, PreviewTable } from './index';

export const DirectoriesIndustryPreview: FC = () => {
  const { previewHeader, previewBody, isLoadingPreview, hasSubmittedSearch } =
    useDirectoriesStore(
      useShallow((state) => ({
        previewHeader: state.previewHeader,
        previewBody: state.previewBody,
        isLoadingPreview: state.isLoadingPreview,
        hasSubmittedSearch: state.hasSubmittedSearch,
      })),
    );

  const { findCount, findList, maxImportCount } = previewBody;

  const isShowResult =
    isLoadingPreview || (hasSubmittedSearch && findCount > 0);

  // Debug: check which columns have isAuth === false
  if (previewHeader.length > 0) {
    console.log(
      'previewHeader:',
      previewHeader.map((h) => ({ name: h.columnName, isAuth: h.isAuth })),
    );
  }

  return (
    <Stack sx={{ flex: 1, p: 3, gap: 3, overflow: 'hidden' }}>
      <PreviewSummary
        importCount={maxImportCount}
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
