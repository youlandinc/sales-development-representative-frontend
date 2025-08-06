'use client';

import { Button, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { Extension, Node } from '@tiptap/core';
import { Mention } from '@tiptap/extension-mention';
import {
  EditorContent,
  mergeAttributes,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CloseIcon from '@mui/icons-material/Close';

import { mentionSuggestionOptions } from './mentionSuggestionOptions';
import { useSwitch } from '@/hooks';
import { ChangeEvent, useMemo, useState } from 'react';


import {

  dT as h9,
  dF as noe,
  dH as DD,
} from './vendor.js';

console.log(h9)
console.log(noe)
console.log(DD)

const DEFAULT_PROMOT = `
  #CONTEXT#\nYou are tasked with finding a Java engineer associated with a given company or website, and extracting their professional profile and email address.\n\n#OBJECTIVE#\nIdentify a Java engineer related to {{Enrich Company}}, {{Domain}}, or {{Url}}, and extract their professional profile link (such as LinkedIn) and email address.\n\n#INSTRUCTIONS#\n1. Use the provided {{Enrich Company}}, {{Domain}}, or {{Url}} to search for employees or team members who are Java engineers (titles may include \"Java Engineer,\" \"Java Developer,\" or similar).\n2. Search LinkedIn, company team pages, or other professional directories for profiles matching the criteria.\n3. Extract the profile URL (preferably LinkedIn) and the email address if publicly available.\n4. If multiple Java engineers are found, return the first relevant result.\n5. If no Java engineer or email is found, return \"No Java engineer found\" or \"No email found\" as appropriate.\n\n#EXAMPLES#\nInput:\n  Enrich Company: Acme Corp\n  Domain: acmecorp.com\n  Url: https://acmecorp.com\n\nExpected Output:\n  Java Engineer Name: John Doe\n
      `;

type NodeType = {
  type: string;
  content?: Node[];
  text?: string;
  attrs?: { [key: string]: any };
};

type CustomExtensionOptions = {
  checked: boolean;
};

declare module '@tiptap/core' {
  interface ExtensionOptions {
    sharedSwitchStorage: CustomExtensionOptions;
  }
}

export const PlaceholderComponent = (props: any) => {
  const { node, deleteNode, editor } = props;

  const label = node?.attrs?.variableName;
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
            checked={editor.storage.sharedSwitchStorage.checked}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              // editor.storage.sharedSwitchStorage.checked = e.target.checked;
              // editor.storage.sharedSwitchStorage.onUpdate(e.target.checked);
              editor.commands.setChecked(e.target.checked);
            }}
            size={'small'}
          />
          <Typography color={'primary'}>{label}</Typography>
          <CloseIcon
            onClick={deleteNode}
            sx={{ color: 'text.secondary', cursor: 'pointer' }}
          />
        </Stack>
      </Tooltip>
    </NodeViewWrapper>
  );
};

/* export const PlaceholderNode = Node.create({
  name: 'custom-placeholder',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-placeholder]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-placeholder': '' }),
      `{{${HTMLAttributes.label}}}`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderComponent);
  },
}); */

export const SharedSwitchExtension = Extension.create({
  name: 'sharedSwitchStorage',
  addOptions() {
    return {
      checked: true,
      setChecked: () => {},
    };
  },
  addStorage() {
    return {
      checked: true, //this.options.checked,
    };
  },
  addCommands() {
    return {
      setChecked: (val: boolean) => () => {
        this.storage.checked = val;
        this.options.setChecked(val); // 通知外部
        return true;
      },
    };
  },
  // addStorage() {
  //   return {
  //     checked: true,
  //   };
  // },

  // // In SharedSwitchExtension
  // addCommands() {
  //   return {
  //     toggleChecked:
  //       (value: boolean) =>
  //       ({ editor }) => {
  //         editor.storage.sharedSwitchStorage.checked = value;
  //         return true;
  //       },
  //   };
  // },
});

const PlaceholderNode = Node.create({
  name: 'custom-placeholder',
  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ variableName: t }) {
        return `{{${t}}}`;
      },
      onVariableTypeChange: void 0,
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
  renderHTML({ HTMLAttributes: t, node: n }) {
    return [
      'span',
      mergeAttributes(
        {
          'data-variable-name': n.attrs.variableName,
          'data-variable-type': n.attrs.variableType,
        },
        this.options.HTMLAttributes,
        t,
      ),
      this.options.renderLabel({
        variableName: n.attrs.variableName,
        variableType: n.attrs.variableType,
      }),
    ];
  },
  renderText({ node: t }) {
    return `{{${t.attrs.variableName}}}`;
  },
  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderComponent, {
      contentDOMElementTag: 'span',
    });
  },
  addCommands() {
    return {
      insertVariableToken:
        (t) =>
        ({ commands: n }) =>
          n.insertContent({
            type: this.name,
            attrs: {
              variableName: t.variableName,
              variableType: t.variableType || 'text',
            },
          }),
      updateVariableTokenTypes:
        (t) =>
        ({ tr: n, state: s, dispatch: a }) => {
          let i = !1;
          const r = new Map();
          return (
            t.forEach((o) => {
              r.set(o.name, o.type);
            }),
            s.doc.descendants((o, l) => {
              if (o.type.name === this.name) {
                const d = o.attrs.variableName,
                  u = o.attrs.variableType,
                  m = r.get(d);
                m &&
                  m !== u &&
                  (n.setNodeMarkup(l, void 0, {
                    ...o.attrs,
                    variableType: m,
                  }),
                  (i = !0));
              }
            }),
            i && a && a(n),
            i
          );
        },
    };
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr: t, state: n }) => {
          let s = !1;
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

const TokenComponent = ({ node: t, selected: n, deleteNode: s }) =>{
  const a = ho(),
      {
        item: i,
        defaultToggled: r,
        tooltipProps: o,
        renderToken: l,
        renderTooltip: c,
        onToggleToken: d,
        isFallback: u,
      } =  (t.attrs),
      m = useMemo(
          () =>
              i != null && i.toggleable
                  ? typeof r == 'function'
                      ? r(i)
                      : (r ?? !0)
                  : !1,
          [i, r],
      ),
      g = (h) => {
        !i || !d || d({ item: i, value: h });
      };
  return  <NodeViewWrapper as="span" data-placeholder>
    <div>123321</div>
  </NodeViewWrapper>
}

const t8e = h9.create({
      name: 'Token',
      group: 'inline',
      inline: !0,
      atom: !0,
      selectable: !0,
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
        return ReactNodeViewRenderer(TokenComponent);
      },
      addOptions() {
        return { behavior: void 0 };
      },
      addProseMirrorPlugins() {
        const { behavior: t } = this.options,
            n = this.editor;
        if (!t)
          throw new Error(
              'TokenV2 extension requires a Behavior implementation to handle autocomplete actions.',
          );
        const s = (a) => t.autocompleteReducer(a, n);
        return qke({
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
      },
      renderHTML({ HTMLAttributes: t }) {
        return ['span', { ...t }, 0];
      },
    }),


export const TiptapEditor = () => {
  const [checked, setChecked] = useState<boolean>(true);

  const insertWithPlaceholders = (editor: any, text: string) => {
    editor.commands.setContent('');

    const placeholderRegex = /{{(.*?)}}/g;
    let match;
    let lastIndex = 0;
    const paragraphs: any[] = [];
    let currentParagraphNodes: any[] = [];

    function flushParagraph() {
      if (currentParagraphNodes.length > 0) {
        paragraphs.push({
          type: 'paragraph',
          content: currentParagraphNodes,
        });
        currentParagraphNodes = [];
      }
    }

    while ((match = placeholderRegex.exec(text)) !== null) {
      const preText = text.slice(lastIndex, match.index);
      const lines = preText.split(/\r?\n/);

      lines.forEach((line, index) => {
        if (line) {
          currentParagraphNodes.push({ type: 'text', text: line });
        }
        if (index < lines.length - 1) {
          flushParagraph();
        }
      });

      // 插入 placeholder 占位符
      currentParagraphNodes.push({
        type: 'custom-placeholder',
        attrs: { variableName: match[1].trim() },
      });

      lastIndex = placeholderRegex.lastIndex;
    }

    // 处理最后一段（剩余文字）
    const remaining = text.slice(lastIndex);
    const remainingLines = remaining.split(/\r?\n/);
    remainingLines.forEach((line, index) => {
      if (line) {
        currentParagraphNodes.push({ type: 'text', text: line });
      }
      if (index < remainingLines.length - 1) {
        flushParagraph();
      }
    });

    flushParagraph(); // 收尾
    // 插入到 editor 中
    //先清空
    paragraphs.forEach((paragraph) => {
      editor.commands.insertContent(paragraph);
    });
  };

  /*   const parsePromptTextToNodes = (text: string) => {
    const nodes: any[] = [];
    const regex = /{{(.*?)}}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push({
          type: 'text',
          text: text.slice(lastIndex, match.index),
        });
      }

      nodes.push({
        type: 'placeholder',
        attrs: { label: match[1].trim() },
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      nodes.push({
        type: 'text',
        text: text.slice(lastIndex),
      });
    }
    console.log(nodes);
    return [
      {
        type: 'paragraph',
        content: nodes,
      },
    ];
  }; */

  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.extend({
        name: 'Token',
        atom: !0,
        selectable: !0,
        addNodeView() {
          return ReactNodeViewRenderer(PlaceholderComponent);
        },
        addAttributes() {
          const  t= this.parent;
          return {
            ...((t  ) == null ? void 0 : t.call(this)),
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
      })/*.extend({
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
      })*/.configure({
        suggestion: {
          ...mentionSuggestionOptions,
          char: '/',
        },
        HTMLAttributes: {
          class: 'mention',
        },
      }),
      PlaceholderNode,
      SharedSwitchExtension /* .configure({
        checked: checked,
        setChecked: (checked: boolean) => {
          setChecked(checked);
        },
      }), */,
    ],
    content: '',
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: 'padding:16px;',
      },
    },
  });

  if (!editor) {
    return null;
  }

  insertWithPlaceholders(editor, DEFAULT_PROMOT);
  //   editor.commands.setContent(
  //     parsePromptTextToNodes(`
  // #CONTEXT#\nYou are tasked with finding a Java engineer associated with a given company or website, and extracting their professional profile and email address.\n\n#OBJECTIVE#\nIdentify a Java engineer related to {{Enrich Company}}, {{Domain}}, or {{Url}}, and extract their professional profile link (such as LinkedIn) and email address.\n\n#INSTRUCTIONS#\n1. Use the provided {{Enrich Company}}, {{Domain}}, or {{Url}} to search for employees or team members who are Java engineers (titles may include \"Java Engineer,\" \"Java Developer,\" or similar).\n2. Search LinkedIn, company team pages, or other professional directories for profiles matching the criteria.\n3. Extract the profile URL (preferably LinkedIn) and the email address if publicly available.\n4. If multiple Java engineers are found, return the first relevant result.\n5. If no Java engineer or email is found, return \"No Java engineer found\" or \"No email found\" as appropriate.\n\n#EXAMPLES#\nInput:\n  Enrich Company: Acme Corp\n  Domain: acmecorp.com\n  Url: https://acmecorp.com\n\nExpected Output:\n  Java Engineer Name: John Doe\n
  // `),
  //   );
  const FIELD_MAP = {
    'Enrich Company': 'f_0szqqc8QBTxZKg6HYr9',
    Domain: 'f_0szqqc8XXxBN2S6jiEx',
    Url: 'f_0szqqc8Z5mwa6iwDnqp',
  };

  function extractPromptText(
    doc: NodeType,
    fieldMap: Record<string, string>,
  ): string {
    let result = '';

    function walk(nodes?: Node[]) {
      if (!nodes) {
        return;
      }
      for (const node of nodes) {
        if (node.type === 'text') {
          result += node.text || '';
        } else if (node.type === 'custom-placeholder') {
          const label = node.attrs?.label;
          const id = fieldMap[label] || label;
          result += `{{${id}}}`;
        } else {
          // 递归遍历嵌套内容
          if (node.content) {
            walk(node.content);
          }

          // 每段后加换行，模拟段落结构
          if (node.type === 'paragraph') {
            result += '\n';
          }
        }
      }
    }

    walk(doc.content);
    return JSON.stringify(result.trim());
  }

  const handleClick = () => {
    console.log(extractPromptText(editor.getJSON(), FIELD_MAP));
  };

  const handleGetText = () => {
    console.log(editor.getText());
  };

  return (
    <Stack gap={2}>
      <EditorContent
        editor={editor}
        style={{ padding: '0', border: '1px solid #ccc', borderRadius: '8px' }}
      />
      <Button onClick={handleClick} variant={'outlined'}>
        get json
      </Button>
      <Button onClick={handleGetText} variant={'outlined'}>
        get text
      </Button>
    </Stack>
  );
};
