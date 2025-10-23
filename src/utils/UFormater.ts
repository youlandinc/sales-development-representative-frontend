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

/**
 * 格式化时间：小于48小时显示小时，大于48小时显示天
 * @param minutes 分钟数
 * @returns 格式化后的时间字符串
 */
export const UFormatTimeByThreshold = (
  minutes: number | string | null | undefined,
): string => {
  if (!UNotUndefined(minutes) || !UNotNull(minutes)) {
    return '0 min';
  }

  // 转换为数字并取整
  let mins = 0;
  if (typeof minutes === 'string') {
    mins = Math.round(parseFloat(minutes));
  } else {
    mins = Math.round(minutes as number);
  }

  if (isNaN(mins)) {
    return '0 min';
  }

  // 48小时 = 2880分钟
  if (mins < 2880) {
    // 小于48小时，显示小时
    const hours = Math.floor(mins / 60);
    return hours > 0 ? `${hours} hr` : `${mins} min`;
  }
  // 大于等于48小时，显示天
  const days = Math.floor(mins / (60 * 24));
  return `${days} day${days > 1 ? 's' : ''}`;
};
