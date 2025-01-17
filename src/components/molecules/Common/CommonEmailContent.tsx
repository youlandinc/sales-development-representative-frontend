import { FC, RefObject, useEffect, useRef } from 'react';
import { Box, SxProps } from '@mui/material';

import { useRenderDom } from '@/hooks';

type CommonEmailContentProps = {
  content?: string;
  sx?: SxProps;
  style?: string;
};

export const CommonEmailContent: FC<CommonEmailContentProps> = ({
  content,
  sx,
  style,
}) => {
  const contentRef = useRef(null);
  const { renderFile } = useRenderDom(
    contentRef as unknown as RefObject<HTMLDivElement>,
    style,
  );

  useEffect(() => {
    renderFile(content ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);
  return <Box ref={contentRef} sx={sx}></Box>;
};
