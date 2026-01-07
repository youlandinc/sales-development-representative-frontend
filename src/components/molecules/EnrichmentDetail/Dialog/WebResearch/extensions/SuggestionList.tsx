import {
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from '@mui/material';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import type { MentionSuggestion } from './mentionSuggestionOptions';

import { useMergedColumns } from '@/components/molecules/EnrichmentDetail/hooks';
import { TypeIcon } from '../../../Table/TableIcon';
import {
  TableColumnProps,
  TableColumnTypeEnum,
} from '@/types/enrichment/table';

export type SuggestionListRef = {
  // For convenience using this SuggestionList from within the
  // mentionSuggestionOptions, we'll match the signature of SuggestionOptions's
  // `onKeyDown` returned in its `render` function
  onKeyDown: NonNullable<
    ReturnType<
      NonNullable<SuggestionOptions<MentionSuggestion>['render']>
    >['onKeyDown']
  >;
};

// This type is based on
// https://github.com/ueberdosis/tiptap/blob/a27c35ac8f1afc9d51f235271814702bc72f1e01/packages/extension-mention/src/mention.ts#L73-L103.
// TODO(Steven DeMartini): Use the Tiptap exported MentionNodeAttrs interface
// once https://github.com/ueberdosis/tiptap/pull/4136 is merged.
interface MentionNodeAttrs {
  id: string | null;
  label?: string | null;
  fieldType: TableColumnTypeEnum;
}

export type SuggestionListProps = SuggestionProps<MentionSuggestion>;

export const SuggestionList = forwardRef<
  SuggestionListRef,
  SuggestionListProps
>((props, ref) => {
  // Get merged columns
  const columns = useMergedColumns();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      if (index >= columns.length) {
        return;
      }
      const suggestion = columns[index];
      const mentionItem: MentionNodeAttrs = {
        id: suggestion.fieldId,
        label: suggestion.fieldName,
        fieldType: suggestion.fieldType,
      };
      props.command(mentionItem);
    },
    [columns, props],
  );

  const upHandler = useCallback(() => {
    setSelectedIndex((prev) => (prev + columns.length - 1) % columns.length);
  }, [columns.length]);

  const downHandler = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % columns.length);
  }, [columns.length]);

  const enterHandler = useCallback(() => {
    selectItem(selectedIndex);
  }, [selectItem, selectedIndex]);

  const onClickToSelectItem = useCallback(
    (index: number) => {
      selectItem(index);
    },
    [selectItem],
  );

  useEffect(() => setSelectedIndex(0), [columns]);

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }
        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }
        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }
        return false;
      },
    }),
    [upHandler, downHandler, enterHandler],
  );

  return columns.length > 0 ? (
    <Paper elevation={5}>
      <List
        // dense
        sx={{
          // In case there are contiguous stretches of long text that can't wrap:
          // overflow: 'hidden',
          p: 0,
        }}
      >
        {columns.map((item: TableColumnProps, index: number) => (
          <ListItem disablePadding key={item.fieldId}>
            <ListItemButton
              onClick={() => onClickToSelectItem(index)}
              selected={index === selectedIndex}
              sx={{ px: 1.5, py: 1, gap: 1 }}
            >
              <TypeIcon
                size={18}
                type={
                  (item?.fieldType as TableColumnTypeEnum) ||
                  TableColumnTypeEnum.text
                }
              />
              <Typography fontSize={12} lineHeight={1.5}>
                {item.fieldName}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  ) : null;
});

SuggestionList.displayName = 'SuggestionList';
