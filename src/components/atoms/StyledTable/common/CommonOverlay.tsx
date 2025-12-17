import { FC } from 'react';
import { Box } from '@mui/material';

import { TABLE_COLORS, TABLE_Z_INDEX } from '../styles';

interface CommonOverlayProps {
  left: number;
  top: number;
  width: number;
  height: number;
  isVisible: boolean;
  isEditing?: boolean;
  containerHeight: number;
  pinnedWidth: number;
}

export const CommonOverlay: FC<CommonOverlayProps> = ({
  left,
  top,
  width,
  height,
  isVisible,
  isEditing = false,
  containerHeight,
  pinnedWidth,
}) => {
  if (!isVisible) {
    return null;
  }

  const isInPinnedArea = left < pinnedWidth;

  const selectionBorderStyles = {
    position: 'absolute' as const,
    left,
    top,
    width,
    height,
    border: `2px solid ${TABLE_COLORS.SELECTION_BORDER}`,
    pointerEvents: 'none' as const,
    boxSizing: 'border-box' as const,
    ...(isEditing && {
      outline: `2px solid ${TABLE_COLORS.SELECTION_OUTLINE}`,
      outlineOffset: 0,
    }),
  };

  // Pinned area: wrap in sticky container so overlay follows pinned columns on horizontal scroll
  if (isInPinnedArea) {
    return (
      <Box
        id="grid-overlay-container"
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: containerHeight,
          pointerEvents: 'none',
          zIndex: TABLE_Z_INDEX.OVERLAY_PINNED,
        }}
      >
        <Box
          id="grid-selection-overlay-sticky"
          sx={{
            position: 'sticky',
            left: 0,
            top: 0,
            width: pinnedWidth,
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <Box id="grid-selection-overlay" sx={selectionBorderStyles} />
        </Box>
      </Box>
    );
  }

  // Non-pinned area: container starts at pinnedWidth with overflow:hidden
  // This ensures border cannot bleed into pinned area
  return (
    <Box
      id="grid-overlay-container"
      sx={{
        position: 'absolute',
        left: pinnedWidth,
        top: 0,
        width: `calc(100% - ${pinnedWidth}px)`,
        height: containerHeight,
        pointerEvents: 'none',
        zIndex: TABLE_Z_INDEX.CELL,
        overflow: 'hidden',
      }}
    >
      <Box
        id="grid-selection-overlay"
        sx={{
          ...selectionBorderStyles,
          left: left - pinnedWidth,
        }}
      />
    </Box>
  );
};
