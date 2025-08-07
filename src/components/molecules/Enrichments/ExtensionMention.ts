import { Mention } from '@tiptap/extension-mention';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { mentionSuggestionOptions } from '@/components/molecules/Enrichments/mentionSuggestionOptions';
import { PlaceholderNode } from './PlaceholderNode';

export const ExtensionMention = Mention.extend({
  name: 'Token',
  atom: true,
  selectable: true,
  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderNode);
  },
  addAttributes() {
    const t = this.parent;
    return {
      ...(t == null ? void 0 : t.call(this)),
      path: {
        default: null,
        parseHTML: (n) => n.getAttribute('data-path'),
        renderHTML: (n) => (n.path ? { 'data-path': n.path } : {}),
      },
      href: {
        default: null,
        parseHTML: (n) => n.getAttribute('data-href'),
        renderHTML: (n) => (n.href ? { 'data-href': n.href } : {}),
      },
    };
  },
}) /*.extend({
        addNodeView() {
          return ReactNodeViewRenderer(PlaceholderComponent);
        },
        parseHTML() {
          return [
            {
              tag: 'mention-component',
            },
          ];
        },
        renderHTML({ HTMLAttributes }) {
          return ['mention-component', mergeAttributes(HTMLAttributes)];
        },
      })*/
  .configure({
    suggestion: {
      ...mentionSuggestionOptions,
      char: '/',
    },
    HTMLAttributes: {
      class: 'mention',
    },
  });
