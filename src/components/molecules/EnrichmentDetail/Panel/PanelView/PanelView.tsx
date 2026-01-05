import { FC, useCallback, useMemo, useState } from 'react';
import {
  ClickAwayListener,
  Divider,
  Grow,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { useShallow } from 'zustand/react/shallow';

import {
  PAPPER_STACK_CONTAINER_SX,
  PAPPER_SX,
  STACK_CONTAINER_SX,
} from '../config';
import { ViewActions, ViewItem } from './index';
import { PanelIcon } from '../PanelIcon';

import { useEnrichmentTableStore } from '@/stores/enrichment';
import { TableViewTypeEnum } from '@/types/enrichment';

interface PanelViewProps {
  tableId: string;
}

export const PanelView: FC<PanelViewProps> = ({ tableId }) => {
  const { views, activeViewId, fetchRowIds } = useEnrichmentTableStore(
    useShallow((store) => ({
      views: store.views,
      activeViewId: store.activeViewId,
      fetchRowIds: store.fetchRowIds,
    })),
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const activeView = useMemo(() => {
    return views.find((view) => view.viewId === activeViewId);
  }, [views, activeViewId]);

  const { generalViews, preconfiguredViews } = useMemo(() => {
    return {
      generalViews: views.filter(
        (view) =>
          view.viewType === TableViewTypeEnum.general || !view.isPreconfigured,
      ),
      preconfiguredViews: views.filter(
        (view) =>
          view.isPreconfigured && view.viewType !== TableViewTypeEnum.general,
      ),
    };
  }, [views]);

  const onPanelClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onViewSelect = useCallback(
    async (viewId: string) => {
      if (viewId === activeViewId) {
        return;
      }
      await fetchRowIds(tableId, viewId);
      onPanelClose();
    },
    [tableId, activeViewId, fetchRowIds, onPanelClose],
  );

  const onRenameView = useCallback(() => {
    // TODO: Implement rename view
    onPanelClose();
  }, [onPanelClose]);

  const onEditDescription = useCallback(() => {
    // TODO: Implement edit description
    onPanelClose();
  }, [onPanelClose]);

  const onDuplicateView = useCallback(() => {
    // TODO: Implement duplicate view
    onPanelClose();
  }, [onPanelClose]);

  const onDeleteView = useCallback(() => {
    // TODO: Implement delete view
    onPanelClose();
  }, [onPanelClose]);

  return (
    <>
      <Stack
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
        sx={STACK_CONTAINER_SX}
      >
        <PanelIcon.ViewIcon />
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.4,
          }}
        >
          {activeView?.viewName ?? 'Default view'}
        </Typography>
      </Stack>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={300}>
            <Paper sx={{ ...PAPPER_SX, mx: 0 }}>
              <ClickAwayListener
                mouseEvent={'onMouseDown'}
                onClickAway={() => setAnchorEl(null)}
                touchEvent={'onTouchStart'}
              >
                <Stack
                  sx={{
                    ...PAPPER_STACK_CONTAINER_SX,
                    minWidth: 220,
                    gap: 0.5,
                  }}
                >
                  {generalViews.map((view) => (
                    <ViewItem
                      isActive={view.viewId === activeViewId}
                      isDraggable={view.viewType === TableViewTypeEnum.general}
                      key={view.viewId}
                      onViewSelect={onViewSelect}
                      view={view}
                    />
                  ))}

                  {generalViews.length > 0 && preconfiguredViews.length > 0 && (
                    <Divider sx={{ borderColor: '#DFDEE6' }} />
                  )}

                  {preconfiguredViews.map((view) => (
                    <ViewItem
                      isActive={view.viewId === activeViewId}
                      key={view.viewId}
                      onViewSelect={onViewSelect}
                      view={view}
                    />
                  ))}

                  <Divider sx={{ borderColor: '#DFDEE6' }} />

                  <ViewActions
                    onDeleteView={onDeleteView}
                    onDuplicateView={onDuplicateView}
                    onEditDescription={onEditDescription}
                    onRenameView={onRenameView}
                  />
                </Stack>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
