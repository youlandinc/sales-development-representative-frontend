// ============================================================================
// Menu Types
// ============================================================================

import { ReactNode } from 'react';
import {
  TableColumnMenuActionEnum,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

export interface TableColumnActionOption {
  label: string;
  icon: ReactNode;
  value: TableColumnMenuActionEnum | TableColumnTypeEnum | '';
  disabled?: boolean;
  variant?: 'danger' | 'normal';
  children?: TableColumnActionOption[];
  submenu?: TableColumnActionOption[];
}

export interface HeaderMenuClickParams {
  type: TableColumnMenuActionEnum | TableColumnTypeEnum | string;
  columnId: string;
  value?: any;
  parentValue?: any;
}
