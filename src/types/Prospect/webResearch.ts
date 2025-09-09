import { Editor } from '@tiptap/core';
import { SuggestionOptions } from '@tiptap/suggestion';
import { ReactNode } from 'react';

export interface CommandItem {
  title: string;
  icon?: ReactNode;
  command?: (props: { editor: Editor; range: Range }) => void;
  disabled?: boolean;
}

export interface CustomCommandItem {
  title: string;
  icon?: ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

export interface Range {
  from: number;
  to: number;
}

export interface CommandsListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export interface RenderSuggestionsProps {
  editor: Editor;
  clientRect: () => DOMRect;
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export interface SlashSuggestionOptions {
  suggestion?: Partial<SuggestionOptions>;
  commandItems?: CommandItem[];
  options?: any;
}
