type TypeName =
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Null'
  | 'Undefined'
  | 'Symbol'
  | 'BigInt'
  | 'Array'
  | 'Object'
  | 'Function'
  | 'Date'
  | 'RegExp'
  | 'Map'
  | 'Set'
  | 'WeakMap'
  | 'WeakSet'
  | 'Promise'
  | 'Error';

export const UTypeOf = (value: unknown): TypeName => {
  return Object.prototype.toString.call(value).slice(8, -1) as TypeName;
};

UTypeOf.isString = (value: unknown): value is string => {
  return UTypeOf(value) === 'String';
};

UTypeOf.isNumber = (value: unknown): value is number => {
  return UTypeOf(value) === 'Number';
};

UTypeOf.isBoolean = (value: unknown): value is boolean => {
  return UTypeOf(value) === 'Boolean';
};

UTypeOf.isNull = (value: unknown): value is null => {
  return UTypeOf(value) === 'Null';
};

UTypeOf.isUndefined = (value: unknown): value is undefined => {
  return UTypeOf(value) === 'Undefined';
};

UTypeOf.isNullish = (value: unknown): value is null | undefined => {
  return UTypeOf.isNull(value) || UTypeOf.isUndefined(value);
};

UTypeOf.isSymbol = (value: unknown): value is symbol => {
  return UTypeOf(value) === 'Symbol';
};

UTypeOf.isBigInt = (value: unknown): value is bigint => {
  return UTypeOf(value) === 'BigInt';
};

UTypeOf.isArray = <T = unknown>(value: unknown): value is T[] => {
  return UTypeOf(value) === 'Array';
};

UTypeOf.isObject = <T = Record<string, unknown>>(
  value: unknown,
): value is T => {
  return UTypeOf(value) === 'Object';
};

UTypeOf.isEmptyObject = (value: unknown): boolean => {
  return UTypeOf.isObject(value) && Object.keys(value).length === 0;
};

UTypeOf.isFunction = (
  value: unknown,
): value is (...args: unknown[]) => unknown => {
  return UTypeOf(value) === 'Function';
};

UTypeOf.isDate = (value: unknown): value is Date => {
  return UTypeOf(value) === 'Date';
};

UTypeOf.isRegExp = (value: unknown): value is RegExp => {
  return UTypeOf(value) === 'RegExp';
};

UTypeOf.isMap = <K = unknown, V = unknown>(
  value: unknown,
): value is Map<K, V> => {
  return UTypeOf(value) === 'Map';
};

UTypeOf.isSet = <T = unknown>(value: unknown): value is Set<T> => {
  return UTypeOf(value) === 'Set';
};

UTypeOf.isWeakMap = <K extends object = object, V = unknown>(
  value: unknown,
): value is WeakMap<K, V> => {
  return UTypeOf(value) === 'WeakMap';
};

UTypeOf.isWeakSet = <T extends object = object>(
  value: unknown,
): value is WeakSet<T> => {
  return UTypeOf(value) === 'WeakSet';
};

UTypeOf.isPromise = <T = unknown>(value: unknown): value is Promise<T> => {
  return UTypeOf(value) === 'Promise';
};

UTypeOf.isError = (value: unknown): value is Error => {
  return UTypeOf(value) === 'Error';
};

UTypeOf.isPrimitive = (
  value: unknown,
): value is string | number | boolean | null | undefined | symbol | bigint => {
  const type = UTypeOf(value);
  return [
    'String',
    'Number',
    'Boolean',
    'Null',
    'Undefined',
    'Symbol',
    'BigInt',
  ].includes(type);
};

/**
 * @deprecated Use `value !== undefined` or `!UTypeOf.isUndefined(value)` instead
 */
export const UNotUndefined = (value: unknown): boolean => {
  return !UTypeOf.isUndefined(value);
};

/**
 * @deprecated Use `value !== null` or `!UTypeOf.isNull(value)` instead
 */
export const UNotNull = (value: unknown): boolean => {
  return !UTypeOf.isNull(value);
};
