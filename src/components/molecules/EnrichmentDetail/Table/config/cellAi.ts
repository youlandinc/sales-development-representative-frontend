import {
  TableCellAIPhaseEnum,
  TableCellMetaDataValidateStatusEnum,
} from '@/types';

export const CELL_AI_VALIDATE_HASH: Record<
  TableCellMetaDataValidateStatusEnum,
  string
> = {
  [TableCellMetaDataValidateStatusEnum.verified]:
    '/images/table/ai-status/icon-verified.svg',
  [TableCellMetaDataValidateStatusEnum.not_found]:
    '/images/table/ai-status/icon-not-found.svg',
  [TableCellMetaDataValidateStatusEnum.not_validated]:
    '/images/table/ai-status/icon-not-validated.svg',
  [TableCellMetaDataValidateStatusEnum.potential_issue]:
    '/images/table/ai-status/icon-potential-issue.svg',
};

// for loading state
export const CELL_AI_PHASE_HASH: Partial<Record<TableCellAIPhaseEnum, string>> =
  {
    [TableCellAIPhaseEnum.searching]: 'Searching',
    [TableCellAIPhaseEnum.verifying]: 'Verifying',
    [TableCellAIPhaseEnum.re_searching]: 'Re-searching',
    [TableCellAIPhaseEnum.populating]: 'Populating',
  };
