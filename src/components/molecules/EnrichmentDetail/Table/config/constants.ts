// Table layout constants
export const ROW_HEIGHT = 36;
export const MIN_BATCH_SIZE = 50;

// System column IDs
export const SYSTEM_COLUMN_SELECT = '__select';

//AI action keys
export const ACTION_KEY_AI = 'use-ai';

//find action keys
export const ACTION_KEY_FIND = 'find';

// Non-editable action keys
export const NON_EDITABLE_ACTION_KEYS = [
  ACTION_KEY_AI,
  ACTION_KEY_FIND,
] as const;
