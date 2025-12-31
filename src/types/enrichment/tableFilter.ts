export enum TableFilterConditionType {
  equal_to = 'EQUAL_TO',
  not_equal_to = 'NOT_EQUAL_TO',
  contains = 'CONTAINS',
  contains_any_of = 'CONTAINS_ANY_OF',
  does_not_contain = 'DOES_NOT_CONTAIN',
  does_not_contain_any_of = 'DOES_NOT_CONTAIN_ANY_OF',
  is_empty = 'IS_EMPTY',
  is_not_empty = 'IS_NOT_EMPTY',
  greater_than = 'GREATER_THAN',
  greater_or_equal_to = 'GREATER_OR_EQUAL_TO',
  less_than = 'LESS_THAN',
  less_or_equal_to = 'LESS_OR_EQUAL_TO',
  is_between = 'IS_BETWEEN',
  is_checked = 'IS_CHECKED',
  is_not_checked = 'IS_NOT_CHECKED',
  is = 'IS',
  is_not = 'IS_NOT',
  has_an_error = 'HAS_AN_ERROR',
  does_not_contain_an_error = 'DOES_NOT_CONTAIN_AN_ERROR',
  has_results = 'HAS_RESULTS',
  has_no_results = 'HAS_NO_RESULTS',
  has_not_run = 'HAS_NOT_RUN',
  is_queued = 'IS_QUEUED',
  is_awaiting_callback = 'IS_AWAITING_CALLBACK',
  is_retrying = 'IS_RETRYING',
  run_condition_not_met = 'RUN_CONDITION_NOT_MET',
  is_running = 'IS_RUNNING',
  is_not_running = 'IS_NOT_RUNNING',
  is_stale = 'IS_STALE',
}

export interface TableFilterItem {
  fieldId: string;
  conditionType: TableFilterConditionType;
  values: string | string[];
}

export interface TableFilterGroupItem {
  filters: TableFilterItem[];
}

export type TableFilterRequestParams = TableFilterGroupItem[];
