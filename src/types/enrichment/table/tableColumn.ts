// ============================================================================
// Table Column Types (metaColumns - shared across all views)
// ============================================================================

import {
  IntegrationAction,
  ValidationActionConfigParam,
} from '../integrations';
import { TableColumnTypeEnum, TableFilterConditionType } from './index';

export interface TableColumnProps {
  fieldId: string;
  fieldName: string;
  fieldType: TableColumnTypeEnum;
  description: string | null;
  actionKey: string | null;
  dependentFieldId: string | null;
  visible: boolean;
  isUnique: boolean;
  nullable: boolean;
  pin: boolean;
  color: string | null;
  csn: number;
  width: number;
  typeSettings: {
    inputBinding: {
      formulaText: string;
      name: string;
      optional?: boolean;
    }[];
    optionalPathsInInputs: {
      prompt: string[];
    };
  } | null;
  semanticType: string | null;
  groupId: string | null;
  actionDefinition: IntegrationAction | null;
  isExtractedField: boolean | null;
  mappingField: string | null;

  supportedFilterConditions:
    | {
        conditionType: TableFilterConditionType;
        needsValue: boolean;
      }[]
    | null;
}

// Runtime column meta (extends TableColumnProps with computed fields)
export interface TableColumnMeta extends Partial<TableColumnProps> {
  isAiColumn?: boolean;
  canEdit?: boolean;
}

// API Params
export interface MetaColumnUpdateParams {
  fieldId: string;
  description?: string;
  fieldName?: string;
  fieldType?: TableColumnTypeEnum;
}

export interface ColumnFieldGroupMapItem extends IntegrationAction {
  inputParameters: { name: string; formulaText: string }[];
}

export interface ColumnFieldGroupMap {
  [groupId: string]: {
    groupId: string;
    name: string;
    requiredInputsBinding: {
      name: string;
      formulaText: string;
      optional: boolean;
    }[];
    waterfallConfigs: ColumnFieldGroupMapItem[];
    validationActionConfig: ValidationActionConfigParam | null;
  };
}
