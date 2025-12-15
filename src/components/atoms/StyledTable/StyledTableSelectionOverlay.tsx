import { FC } from 'react';
import { Box } from '@mui/material';

interface StyledTableSelectionOverlayProps {
  left: number;
  top: number;
  width: number;
  height: number;
  isVisible: boolean;
  isEditing?: boolean;
  containerHeight: number;
  pinnedWidth: number;
}

export const StyledTableSelectionOverlay: FC<
  StyledTableSelectionOverlayProps
> = ({
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

  const overlayZIndex = isInPinnedArea ? 25 : 10;

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
            zIndex: 15,
            pointerEvents: 'none',
            background: `repeating-linear-gradient(
              to bottom,
              #fff 0px,
              #fff ${height - 1}px,
              #F0EFF5 ${height - 1}px,
              #F0EFF5 ${height}px
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
              border: '2px solid #6F6C7D',
              pointerEvents: 'none',
              boxSizing: 'border-box',
              ...(isEditing && {
                outline: '2px solid #D0CEDA',
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
            border: '2px solid #6F6C7D',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            zIndex: overlayZIndex,
            ...(isEditing && {
              outline: '2px solid #D0CEDA',
              outlineOffset: 0,
            }),
          }}
        />
      )}
    </>
  );
};
