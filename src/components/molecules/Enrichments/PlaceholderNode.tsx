import { NodeViewWrapper } from '@tiptap/react';
import { Icon, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { ChangeEvent, FC, useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import ICON_TEXT from './assets/icon_text.svg';
import { useWebResearchStore } from '@/stores/Prospect';

export const PlaceholderNode: FC = (props: any) => {
  const { excludeFields, setExcludeFields, removeExcludeFields } =
    useWebResearchStore((state) => state);

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
  const id = node?.attrs?.id;

  const storage = editor.storage.sharedSwitch;

  const [checked, setChecked] = useState(storage.checked || true);

  // useEffect(() => {
  //   // 订阅存储变化
  //   storage.subscribe(setChecked);
  //
  //   // 清理订阅
  //   return () => {
  //     storage.unsubscribe();
  //   };
  // }, [storage]);

  useEffect(() => {
    if (excludeFields.includes(id)) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  }, [excludeFields.join('')]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    // storage.setChecked(e.target.checked);
    if (!e.target.checked && id) {
      setExcludeFields(id);
    } else {
      removeExcludeFields(id);
    }
    setChecked(e.target.checked);
  };

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
          <Switch checked={checked} onChange={onChange} size={'small'} />
          <Icon component={ICON_TEXT} sx={{ width: 18, height: 18 }} />
          <Typography color={'text.primary'} variant={'body3'}>
            {label}
          </Typography>
          <CloseIcon
            onClick={deleteNode}
            sx={{ color: 'text.secondary', cursor: 'pointer', fontSize: 18 }}
          />
        </Stack>
      </Tooltip>
    </NodeViewWrapper>
  );
};
