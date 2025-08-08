import { NodeViewWrapper } from '@tiptap/react';
import { Icon, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { ChangeEvent, FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import ICON_TEXT from './assets/icon_text.svg';

export const PlaceholderNode: FC = (props: any) => {
  const { node, deleteNode, editor } = props;
  const {
    item,
    defaultToggled,
    tooltipProps,
    renderToken,
    renderTooltip,
    onToggleToken,
    isFallback,
  } = node.attrs;

  const label = node?.attrs?.label;

  return (
    <NodeViewWrapper as="span" data-placeholder>
      <Tooltip title={label}>
        <Stack
          alignItems={'center'}
          component={'span'}
          flexDirection={'row'}
          gap={0.5}
          px={1}
          py={0.5}
          sx={{
            display: 'inline-flex',
            boxShadow: '0 0 2px 0 rgba(52, 50, 62, 0.35)',
            borderRadius: '8px',
          }}
          width={'fit-content'}
        >
          <Switch
            // checked={editor.storage.sharedSwitchStorage.checked}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              // editor.storage.sharedSwitchStorage.checked = e.target.checked;
              // editor.storage.sharedSwitchStorage.onUpdate(e.target.checked);
              // editor.commands.setChecked(e.target.checked);
            }}
            size={'small'}
          />
          <Icon component={ICON_TEXT} sx={{ width: 18, height: 18 }} />
          <Typography color={'text.primary'}>{label}</Typography>
          <CloseIcon
            onClick={deleteNode}
            sx={{ color: 'text.secondary', cursor: 'pointer', fontSize: 18 }}
          />
        </Stack>
      </Tooltip>
    </NodeViewWrapper>
  );
};
