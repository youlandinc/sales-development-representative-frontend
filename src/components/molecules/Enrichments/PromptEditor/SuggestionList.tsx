import {
  Icon,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from '@mui/material';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import type { MentionSuggestion } from './mentionSuggestionOptions';

import { useProspectTableStore } from '@/stores/Prospect';
import { COLUMN_TYPE_ICONS } from '@/components/atoms/StyledTable/columnTypeIcons';
import { TableColumnTypeEnum } from '@/types/Prospect/table';

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
  const { columns } = useProspectTableStore((store) => store);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    if (index >= columns.length) {
      // Make sure we actually have enough items to select the given index. For
      // instance, if a user presses "Enter" when there are no options, the index will
      // be 0 but there won't be any items, so just ignore the callback here
      return;
    }

    const suggestion = columns[index];

    // Set all of the attributes of our Mention node based on the suggestion
    // data. The fields of `suggestion` will depend on whatever data you
    // return from your `items` function in your "suggestion" options handler.
    // Our suggestion handler returns `MentionSuggestion`s (which we've
    // indicated via SuggestionProps<MentionSuggestion>). We are passing an
    // object of the `MentionNodeAttrs` shape when calling `command` (utilized
    // by the Mention extension to create a Mention Node).
    const mentionItem: MentionNodeAttrs = {
      id: suggestion.fieldId,
      label: suggestion.fieldName,
      fieldType: suggestion.fieldType,
    };
    // type where if you specify the suggestion type (like
    // `SuggestionProps<MentionSuggestion>`), it will incorrectly require that
    // type variable for `command`'s argument as well (whereas instead the
    // type of that argument should be the Mention Node attributes). This
    // should be fixed once https://github.com/ueberdosis/tiptap/pull/4136 is
    // merged and we can add a separate type arg to `SuggestionProps` to
    // specify the type of the commanded selected item.
    props.command(mentionItem);
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + columns.length - 1) % columns.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % columns.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [columns]);

  useImperativeHandle(ref, () => ({
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
  }));

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
        {columns.map((item, index) => (
          <ListItem disablePadding key={item.fieldId}>
            <ListItemButton
              onClick={() => selectItem(index)}
              selected={index === selectedIndex}
              sx={{ px: 1.5, py: 1, gap: 1 }}
            >
              <Icon
                component={
                  COLUMN_TYPE_ICONS[item?.fieldType as TableColumnTypeEnum] ||
                  COLUMN_TYPE_ICONS[TableColumnTypeEnum.text]
                }
                sx={{ width: 18, height: 18 }}
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
