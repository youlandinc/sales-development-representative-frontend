import { isNumber, isString } from 'lodash-es';

export const UGetRoundedCanvas = (
  sourceCanvas: HTMLCanvasElement,
  xWidth?: number,
  xHeight?: number,
) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = xWidth || sourceCanvas.width;
  const height = xHeight || sourceCanvas.height;

  if (!context) {
    return sourceCanvas;
  }

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.globalCompositeOperation = 'destination-in';
  context.beginPath();
  context.fill();
  return canvas;
};

export const computedFilterCount = (
  t: (Option[] | boolean | string | number | undefined)[] = [],
) =>
  t.reduce(
    (pre, cur) =>
      cur == null || cur === 0 || cur === ''
        ? pre
        : Array.isArray(cur)
          ? (pre as number) + cur.length
          : cur === !0 || isNumber(cur) || isString(cur)
            ? (pre as number) + 1
            : pre,
    0,
  ) as number;

export const handleParam = (param: Record<string, any>) => {
  return Object.entries(param).reduce(
    (pre, [key, value]) => {
      if (Array.isArray(value)) {
        pre[key] = value.map((item) =>
          typeof item === 'string' ? item : item.value,
        );
        return pre;
      }
      pre[key] = value;
      return pre;
    },
    {} as Record<string, any>,
  );
};

export const getParamsFromUrl = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};
