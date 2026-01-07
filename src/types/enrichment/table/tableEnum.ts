// ============================================================================
// Table Enums
// ============================================================================

export enum TableColumnTypeEnum {
  text = 'TEXT',
  number = 'NUMBER',
  email = 'EMAIL',
  phone = 'PHONE',
  currency = 'CURRENCY',
  date = 'DATE',
  url = 'URL',
  img_url = 'IMG_URL',
  checkbox = 'CHECKBOX',
  select = 'SELECT',
  assigned_to = 'ASSIGNED_TO',
  paragraph = 'PARAGRAPH',
  action = 'ACTION',
}

export enum TableColumnMenuActionEnum {
  divider = 'DIVIDER',
  ai_agent = 'AI_AGENT',
  rename_column = 'RENAME_COLUMN',
  edit_column = 'EDIT_COLUMN',
  edit_description = 'EDIT_DESCRIPTION',
  sort_a_z = 'SORT_A_Z',
  sort_z_a = 'SORT_Z_A',
  pin = 'PIN',
  unpin = 'UNPIN',
  visible = 'VISIBLE',
  delete = 'DELETE',
  cell_detail = 'CELL_DETAIL',
  header_actions = 'HEADER_ACTIONS',
  insert_column_left = 'INSERT_COLUMN_LEFT',
  insert_column_right = 'INSERT_COLUMN_RIGHT',
  change_column_type = 'CHANGE_COLUMN_TYPE',
  actions_overview = 'ACTIONS_OVERVIEW',
  work_email = 'WORK_EMAIL',
}

export enum TableViewTypeEnum {
  general = 'GENERAL',
  missing_data = 'MISSING_DATA',
  errored = 'ERRORED',
}
