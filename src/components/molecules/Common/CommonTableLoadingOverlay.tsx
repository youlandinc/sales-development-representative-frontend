import { ReactNode, useMemo } from 'react';
import { Box, LinearProgress, Skeleton, styled } from '@mui/material';
import {
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
  useGridApiContext,
} from '@mui/x-data-grid';

function mulberry32(a: number): () => number {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomBetween(seed: number, min: number, max: number): () => number {
  const random = mulberry32(seed);
  return () => min + (max - min) * random();
}

const SkeletonCell = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottom: '1px solid #D2D6E1',
}));

export const CommonSkeletonLoadingOverlay = () => {
  const apiRef = useGridApiContext();

  const dimensions = apiRef.current?.getRootDimensions();
  const viewportHeight = dimensions?.viewportInnerSize.height ?? 0;

  const rowHeight = 40;
  const skeletonRowsCount = Math.ceil(viewportHeight / rowHeight);

  const totalWidth = gridColumnsTotalWidthSelector(apiRef);
  const positions = gridColumnPositionsSelector(apiRef);
  const inViewportCount = useMemo(
    () => positions.filter((value) => value <= totalWidth).length,
    [totalWidth, positions],
  );
  const columns = apiRef.current.getVisibleColumns().slice(0, inViewportCount);

  const children = useMemo(() => {
    // reseed random number generator to create stable lines betwen renders
    const random = randomBetween(12345, 25, 75);
    const array: ReactNode[] = [];

    for (let i = 0; i < skeletonRowsCount; i += 1) {
      for (const column of columns) {
        const width = Math.round(random());
        array.push(
          <SkeletonCell
            key={`col-${column.field}-${i}`}
            sx={{ justifyContent: column.align }}
          >
            <Skeleton sx={{ mx: 1 }} width={`${width}%`} />
          </SkeletonCell>,
        );
      }
      array.push(<SkeletonCell key={`fill-${i}`} />);
    }
    return array;
  }, [skeletonRowsCount, columns]);

  const rowsCount = apiRef.current.getRowsCount();

  return rowsCount > 0 ? (
    <LinearProgress />
  ) : (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${columns
          .map(({ computedWidth }) => `${computedWidth}px`)
          .join(' ')} 1fr`,
        gridAutoRows: `${rowHeight}px`,
      }}
    >
      {children}
    </div>
  );
};
