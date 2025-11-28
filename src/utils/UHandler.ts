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

export const getParamsFromUrl = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};
