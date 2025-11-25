import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';

import { DateRangeEnum } from '@/types/Settings/creditUsage';

/**
 * 格式化日期范围枚举为可读的字符串
 * @param dateRange - DateRangeEnum 枚举值
 * @param referenceDate - 参考日期，默认为当前日期
 * @returns 格式化的日期范围字符串
 */
export const formatDateRange = (
  dateRange: DateRangeEnum,
  referenceDate: Date = new Date(),
): string => {
  const dateFormat = 'MMM d, yyyy';

  switch (dateRange) {
    case DateRangeEnum.this_month: {
      const start = startOfMonth(referenceDate);
      const end = endOfMonth(referenceDate);
      return `This month (${format(start, dateFormat)} - ${format(end, dateFormat)})`;
    }

    case DateRangeEnum.last_month: {
      const lastMonth = subMonths(referenceDate, 1);
      const start = startOfMonth(lastMonth);
      const end = endOfMonth(lastMonth);
      return `Last month (${format(start, dateFormat)} - ${format(end, dateFormat)})`;
    }

    case DateRangeEnum.last_3_months: {
      const threeMonthsAgo = subMonths(referenceDate, 3);
      const start = startOfMonth(threeMonthsAgo);
      const end = endOfMonth(referenceDate);
      return `Last 3 months (${format(start, dateFormat)} - ${format(end, dateFormat)})`;
    }

    case DateRangeEnum.last_6_months: {
      const sixMonthsAgo = subMonths(referenceDate, 6);
      const start = startOfMonth(sixMonthsAgo);
      const end = endOfMonth(referenceDate);
      return `Last 6 months (${format(start, dateFormat)} - ${format(end, dateFormat)})`;
    }

    case DateRangeEnum.range: {
      return 'Select custom range';
    }

    default:
      return '';
  }
};

/**
 * 获取日期范围的起止时间
 * @param dateRange - DateRangeEnum 枚举值
 * @param referenceDate - 参考日期，默认为当前日期
 * @returns { startTime: Date, endTime: Date } 或 null（自定义范围时）
 */
export const getDateRangeBounds = (
  dateRange: DateRangeEnum,
  referenceDate: Date = new Date(),
): { startTime: Date; endTime: Date } | null => {
  switch (dateRange) {
    case DateRangeEnum.this_month: {
      return {
        startTime: startOfDay(startOfMonth(referenceDate)),
        endTime: endOfDay(endOfMonth(referenceDate)),
      };
    }

    case DateRangeEnum.last_month: {
      const lastMonth = subMonths(referenceDate, 1);
      return {
        startTime: startOfDay(startOfMonth(lastMonth)),
        endTime: endOfDay(endOfMonth(lastMonth)),
      };
    }

    case DateRangeEnum.last_3_months: {
      const threeMonthsAgo = subMonths(referenceDate, 3);
      return {
        startTime: startOfDay(startOfMonth(threeMonthsAgo)),
        endTime: endOfDay(endOfMonth(referenceDate)),
      };
    }

    case DateRangeEnum.last_6_months: {
      const sixMonthsAgo = subMonths(referenceDate, 6);
      return {
        startTime: startOfDay(startOfMonth(sixMonthsAgo)),
        endTime: endOfDay(endOfMonth(referenceDate)),
      };
    }

    case DateRangeEnum.range: {
      // 自定义范围需要用户选择，返回 null
      return null;
    }

    default:
      return null;
  }
};

export const DATE_RANGE_OPTIONS = [
  {
    value: DateRangeEnum.this_month,
    label: 'This month',
    key: DateRangeEnum.this_month,
  },
  {
    value: DateRangeEnum.last_month,
    label: 'Last month',
    key: DateRangeEnum.last_month,
  },
  {
    value: DateRangeEnum.last_3_months,
    label: 'Last 3 months',
    key: DateRangeEnum.last_3_months,
  },
  {
    value: DateRangeEnum.last_6_months,
    label: 'Last 6 months',
    key: DateRangeEnum.last_6_months,
  },
  {
    value: DateRangeEnum.range,
    label: 'Select custom range',
    key: DateRangeEnum.range,
  },
];
