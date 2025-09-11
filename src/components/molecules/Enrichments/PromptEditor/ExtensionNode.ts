import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { PlaceholderNode } from './PlaceholderNode';

export const ExtensionNode = Node.create({
  name: 'custom-placeholder',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (t) => t.getAttribute('data-id'),
        renderHTML: (t) => (t.id ? { 'data-id': t.id } : {}),
      },
      label: {
        default: null,
        parseHTML: (t) => t.getAttribute('data-label'),
        renderHTML: (t) => (t.label ? { 'data-label': t.label } : {}),
      },
      path: {
        default: null,
        parseHTML: (t) => t.getAttribute('data-path'),
        renderHTML: (t) => (t.path ? { 'data-path': t.path } : {}),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderNode);
  },
  addOptions() {
    return { behavior: undefined };
  },
  /*  addProseMirrorPlugins() {
    const { behavior: t } = this.options,
      n = this.editor;
    if (!t) {
      throw new Error(
        'TokenV2 extension requires a Behavior implementation to handle autocomplete actions.',
      );
    }
    const s = (a) => t.autocompleteReducer(a, n);
    return new Plugin({
      triggers: [
        {
          name: 'token',
          trigger: RegExp('(/)$'),
          cancelOnFirstSpace: !1,
          allArrowKeys: !0,
          decorationAttrs: {
            class:
              'token-autocomplete text-content-action tiptap-suggestion-decoration',
          },
        },
      ],
      reducer: s,
    });
  },*/
  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes }, 0];
  },
});

export const VariableTokenNode = Node.create({
  name: 'variableToken',
  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ variableName }: { variableName: string }) {
        return `{{${variableName}}}`;
      },
      onVariableTypeChange: undefined,
      variables: [],
    };
  },
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,
  addAttributes() {
    return {
      variableName: {
        default: null,
        parseHTML: (t) => t.getAttribute('data-variable-name'),
        renderHTML: (t) =>
          t.variableName
            ? {
                'data-variable-name': t.variableName,
              }
            : {},
      },
      variableType: {
        default: 'text',
        parseHTML: (t) => t.getAttribute('data-variable-type') || 'text',
        renderHTML: (t) =>
          t.variableType
            ? {
                'data-variable-type': t.variableType,
              }
            : {},
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-variable-name]',
      },
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      'span',
      mergeAttributes(
        {
          'data-variable-name': node.attrs.variableName,
          'data-variable-type': node.attrs.variableType,
        },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      this.options.renderLabel({
        variableName: node.attrs.variableName,
        variableType: node.attrs.variableType,
      }),
    ];
  },
  renderText({ node }) {
    return `{{${node.attrs.variableName}}}`;
  },
  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderNode, {
      contentDOMElementTag: 'span',
    });
  },

  /* addCommands() {
    return {
      insertVariableToken:
        (t) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              variableName: t.variableName,
              variableType: t.variableType || 'text',
            },
          }),
      updateVariableTokenTypes:
        (t) =>
        ({ tr, state, dispatch }) => {
          let i = false;
          const r = new Map();
          return (
            t.forEach((o) => {
              r.set(o.name, o.type);
            }),
            state.doc.descendants((o, l) => {
              if (o.type.name === this.name) {
                const d = o.attrs.variableName,
                  u = o.attrs.variableType,
                  m = r.get(d);
                m &&
                  m !== u &&
                  (tr.setNodeMarkup(l, void 0, {
                    ...o.attrs,
                    variableType: m,
                  }),
                  (i = !0));
              }
            }),
            i && dispatch && dispatch(tr),
            i
          );
        },
    };
  },*/
  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr: t, state: n }) => {
          let s = false;
          const { selection: a } = n,
            { empty: i, anchor: r } = a;
          return i
            ? (n.doc.nodesBetween(r - 1, r, (o, l) =>
                o.type.name === this.name
                  ? ((s = !0), t.delete(l, l + o.nodeSize), !1)
                  : !0,
              ),
              s)
            : !1;
        }),
    };
  },
});
