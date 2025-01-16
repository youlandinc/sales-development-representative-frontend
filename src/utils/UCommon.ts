export const UTypeOf = (value: unknown): string => {
  return Object.prototype.toString.call(value).slice(8, -1);
};

export const UNotUndefined = (value: unknown): boolean => {
  return Object.prototype.toString.call(value).slice(8, -1) !== 'Undefined';
};

export const UNotNull = (value: unknown): boolean => {
  return Object.prototype.toString.call(value).slice(8, -1) !== 'Null';
};
