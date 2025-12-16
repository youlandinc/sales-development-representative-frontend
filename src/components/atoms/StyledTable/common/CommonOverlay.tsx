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

  const overlayZIndex = isInPinnedArea
    ? TABLE_Z_INDEX.OVERLAY_PINNED
    : TABLE_Z_INDEX.OVERLAY_NON_PINNED;

  return (
    <>
      {!isInPinnedArea && (
        <Box
          id="grid-pinned-blocker"
          sx={{
            position: 'sticky',
            left: 0,
            top: 0,
            width: pinnedWidth,
            height: containerHeight,
            zIndex: TABLE_Z_INDEX.OVERLAY_BLOCKER,
            pointerEvents: 'none',
            background: `repeating-linear-gradient(
              to bottom,
              ${TABLE_COLORS.DEFAULT_BG} 0px,
              ${TABLE_COLORS.DEFAULT_BG} ${height - 1}px,
              ${TABLE_COLORS.ROW_BORDER} ${height - 1}px,
              ${TABLE_COLORS.ROW_BORDER} ${height}px
            )`,
          }}
        />
      )}

      {isInPinnedArea ? (
        <Box
          id="grid-selection-overlay-sticky-container"
          sx={{
            position: 'sticky',
            left: 0,
            top: 0,
            width: pinnedWidth,
            height: containerHeight,
            pointerEvents: 'none',
            zIndex: overlayZIndex,
          }}
        >
          <Box
            id="grid-selection-overlay"
            sx={{
              position: 'absolute',
              left,
              top,
              width: width,
              height: height,
              border: `2px solid ${TABLE_COLORS.SELECTION_BORDER}`,
              pointerEvents: 'none',
              boxSizing: 'border-box',
              ...(isEditing && {
                outline: `2px solid ${TABLE_COLORS.SELECTION_OUTLINE}`,
                outlineOffset: 0,
              }),
            }}
          />
        </Box>
      ) : (
        <Box
          id="grid-selection-overlay"
          sx={{
            position: 'absolute',
            left,
            top,
            width: width,
            height: height,
            border: `2px solid ${TABLE_COLORS.SELECTION_BORDER}`,
            pointerEvents: 'none',
            boxSizing: 'border-box',
            zIndex: overlayZIndex,
            ...(isEditing && {
              outline: `2px solid ${TABLE_COLORS.SELECTION_OUTLINE}`,
              outlineOffset: 0,
            }),
          }}
        />
      )}
    </>
  );
};
