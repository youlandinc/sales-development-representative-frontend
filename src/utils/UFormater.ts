import { format } from 'date-fns';
import { FormatDateOptions } from 'date-fns/format';
import { UNotNull, UNotUndefined, UTypeOf } from '@/utils/UCommon';

export const UFormatDollar = (
  amount: string | number | null | undefined,
  radix = 2,
): string => {
  if (!UNotUndefined(amount) || !UNotNull(amount)) {
    return '-';
  }
  if (!amount) {
    return '$0';
  }
  let target = amount;
  if (UTypeOf(target) === 'String') {
    target = parseFloat(target as string);
  }
  return target.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(target) ? 0 : radix,
  });
};

export const UFormatNumber = (
  number: string | number | null | undefined,
): string => {
  if (!UNotUndefined(number) || !UNotNull(number)) {
    return '-';
  }
  if (!number) {
    return '0';
  }
  let target = number;
  if (UTypeOf(target) === 'String') {
    target = parseFloat(target as string);
  }
  return target.toLocaleString('en-US');
};

export const UFormatPercent = (
  percentageValue: number | undefined | string | null,
  radix = 2,
): string => {
  if (!UNotUndefined(percentageValue) || !UNotNull(percentageValue)) {
    return '-';
  }
  if (radix <= 0) {
    return '0%';
  }
  const insideRadix = UGetRadix(radix);
  let target = percentageValue;
  if (UTypeOf(target) === 'String') {
    target = parseFloat(target as string);
  }
  return (
    ((Math.floor((target as number) * 10000000) / 10000000) * 100).toFixed(
      insideRadix >= 3 ? 3 : insideRadix,
    ) + '%'
  );
};

export const UGetRadix = (
  value: number | undefined | string | null,
): number => {
  if (!UNotUndefined(value) || !UNotNull(value) || Number.isInteger(value)) {
    return 2;
  }
  const target = value + '';
  return target.substring(target.indexOf('.') + 1).length >= 3 ? 3 : 2;
};

export const UFormatDate = (
  date: string | Date | null,
  timeFormat = 'MM/dd/yyyy',
  options?: FormatDateOptions,
) => {
  if (!date) {
    return '-';
  }
  return format(new Date(date), timeFormat, options);
};
