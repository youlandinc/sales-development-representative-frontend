import { Mention } from '@tiptap/extension-mention';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PlaceholderNode } from './PlaceholderNode';
import { mentionSuggestionOptions } from './mentionSuggestionOptions';

export const ExtensionMention = Mention.extend({
  name: 'custom-placeholder',
  atom: true,
  selectable: true,
  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderNode);
  },
  addAttributes() {
    // 如果父类有 addAttributes 方法，先调用它获取父类的属性
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const parentAttributes = this?.parent ? this.parent() : {};

    return {
      // 先继承父类的属性
      ...parentAttributes,

      // 自定义 path 属性
      path: {
        default: null, // 默认值
        parseHTML: (element: any) => element.getAttribute('data-path'), // 从 HTML 中解析
        renderHTML: (attributes: any) => {
          // 如果属性存在，则渲染为 data-path
          return attributes.path ? { 'data-path': attributes.path } : {};
        },
      },

      // 自定义 href 属性
      href: {
        default: null,
        parseHTML: (element: any) => element.getAttribute('data-href'),
        renderHTML: (attributes: any) => {
          return attributes.href ? { 'data-href': attributes.href } : {};
        },
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
