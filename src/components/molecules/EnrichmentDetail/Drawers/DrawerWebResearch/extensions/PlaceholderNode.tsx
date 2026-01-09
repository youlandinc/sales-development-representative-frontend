import { Stack, Tooltip, Typography } from '@mui/material';
import { NodeViewWrapper } from '@tiptap/react';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { TypeIcon } from '../../../Table/TableIcon';
import { useWebResearchStore } from '@/stores/enrichment';
import { TableColumnTypeEnum } from '@/types/enrichment/table';

import CloseIcon from '@mui/icons-material/Close';

export const PlaceholderNode: FC = (props: any) => {
  const { excludeFields, setExcludeFields, removeExcludeFields } =
    useWebResearchStore(
      useShallow((state) => ({
        excludeFields: state.excludeFields,
        setExcludeFields: state.setExcludeFields,
        removeExcludeFields: state.removeExcludeFields,
      })),
    );

  const { node, deleteNode, editor } = props;
  const {
    //TODO
    // item,
    // defaultToggled,
    // tooltipProps,
    // renderToken,
    // renderTooltip,
    // onToggleToken,
    // isFallback,
    fieldType,
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
  }, [excludeFields, id]);

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
    <NodeViewWrapper as={'span'} data-placeholder>
      <Tooltip title={label}>
        <Stack
          alignItems={'center'}
          component={'span'}
          flexDirection={'row'}
          gap={0.5}
          my={0.5}
          px={1}
          py={0.5}
          sx={{
            display: 'inline-flex',
            boxShadow: '0 0 2px 0 rgba(52, 50, 62, 0.35)',
            borderRadius: '8px',
          }}
          width={'fit-content'}
        >
          {/* <Switch checked={checked} onChange={onChange} size={'small'} /> */}
          <TypeIcon size={18} type={fieldType as TableColumnTypeEnum} />
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
