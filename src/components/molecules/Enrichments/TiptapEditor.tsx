'use client';

import { Box, Button, Icon, Stack, Typography } from '@mui/material';
import { Node } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
import { StyledButton } from '@/components/atoms';

import ICON_SPARKLE from './assets/icon_sparkle.svg';

// import { dH as DD, dT as h9, dF as noe } from './vendor.js';
import { ExtensionMention } from '@/components/molecules/Enrichments/ExtensionMention';
import {
  ExtensionNode,
  ExtensionStorage,
  VariableTokenNode,
} from '@/components/molecules';

// console.log(h9);
// console.log(noe);
// console.log(DD);

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

// const PlaceholderNode = Node.create({
//   name: 'custom-placeholder',
//   addOptions() {
//     return {
//       HTMLAttributes: {},
//       renderLabel({ variableName: t }) {
//         return `{{${t}}}`;
//       },
//       onVariableTypeChange: void 0,
//       variables: [],
//     };
//   },
//   group: 'inline',
//   inline: true,
//   selectable: true,
//   atom: true,
//   addAttributes() {
//     return {
//       variableName: {
//         default: null,
//         parseHTML: (t) => t.getAttribute('data-variable-name'),
//         renderHTML: (t) =>
//           t.variableName
//             ? {
//                 'data-variable-name': t.variableName,
//               }
//             : {},
//       },
//       variableType: {
//         default: 'text',
//         parseHTML: (t) => t.getAttribute('data-variable-type') || 'text',
//         renderHTML: (t) =>
//           t.variableType
//             ? {
//                 'data-variable-type': t.variableType,
//               }
//             : {},
//       },
//     };
//   },
//   parseHTML() {
//     return [
//       {
//         tag: 'span[data-variable-name]',
//       },
//     ];
//   },
//   renderHTML({ HTMLAttributes: t, node: n }) {
//     return [
//       'span',
//       mergeAttributes(
//         {
//           'data-variable-name': n.attrs.variableName,
//           'data-variable-type': n.attrs.variableType,
//         },
//         this.options.HTMLAttributes,
//         t,
//       ),
//       this.options.renderLabel({
//         variableName: n.attrs.variableName,
//         variableType: n.attrs.variableType,
//       }),
//     ];
//   },
//   renderText({ node: t }) {
//     return `{{${t.attrs.variableName}}}`;
//   },
//   addNodeView() {
//     return ReactNodeViewRenderer(PlaceholderNode, {
//       contentDOMElementTag: 'span',
//     });
//   },
//   addCommands() {
//     return {
//       insertVariableToken:
//         (t) =>
//         ({ commands: n }) =>
//           n.insertContent({
//             type: this.name,
//             attrs: {
//               variableName: t.variableName,
//               variableType: t.variableType || 'text',
//             },
//           }),
//       updateVariableTokenTypes:
//         (t) =>
//         ({ tr: n, state: s, dispatch: a }) => {
//           let i = !1;
//           const r = new Map();
//           return (
//             t.forEach((o) => {
//               r.set(o.name, o.type);
//             }),
//             s.doc.descendants((o, l) => {
//               if (o.type.name === this.name) {
//                 const d = o.attrs.variableName,
//                   u = o.attrs.variableType,
//                   m = r.get(d);
//                 m &&
//                   m !== u &&
//                   (n.setNodeMarkup(l, void 0, {
//                     ...o.attrs,
//                     variableType: m,
//                   }),
//                   (i = !0));
//               }
//             }),
//             i && a && a(n),
//             i
//           );
//         },
//     };
//   },
//   addKeyboardShortcuts() {
//     return {
//       Backspace: () =>
//         this.editor.commands.command(({ tr: t, state: n }) => {
//           let s = !1;
//           const { selection: a } = n,
//             { empty: i, anchor: r } = a;
//           return i
//             ? (n.doc.nodesBetween(r - 1, r, (o, l) =>
//                 o.type.name === this.name
//                   ? ((s = !0), t.delete(l, l + o.nodeSize), !1)
//                   : !0,
//               ),
//               s)
//             : !1;
//         }),
//     };
//   },
// });

/*const TokenComponent = ({ node: t, selected: n, deleteNode: s }) => {
  const a = ho(),
    {
      item: i,
      defaultToggled: r,
      tooltipProps: o,
      renderToken: l,
      renderTooltip: c,
      onToggleToken: d,
      isFallback: u,
    } = t.attrs,
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
  return (
    <NodeViewWrapper as="span" data-placeholder>
      <div>123321</div>
    </NodeViewWrapper>
  );
};*/

/*const t8e = h9.create({
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
    if (!t) {
      throw new Error(
        'TokenV2 extension requires a Behavior implementation to handle autocomplete actions.',
      );
    }
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
});*/

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
        attrs: { label: match[1].trim() },
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
      ExtensionMention,
      // PlaceholderNode,
      ExtensionNode,
      ExtensionStorage /* .configure({
        checked: checked,
        setChecked: (checked: boolean) => {
          setChecked(checked);
        },
      }), */,
      Placeholder.configure({
        placeholder: 'Write something …',
      }),
      VariableTokenNode,
    ],
    content: DEFAULT_PROMOT,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: 'padding:0px;outline:none;min-width:80px;',
      },
    },
    onCreate: ({ editor }) => {
      insertWithPlaceholders(editor, DEFAULT_PROMOT);
    },
  });

  if (!editor) {
    return null;
  }
  function $ae(t: string) {
    const n = t.toLowerCase();
    return n.includes('email') || n.includes('mail')
      ? 'email'
      : n.includes('phone') || n.includes('mobile') || n.includes('tel')
        ? 'phone'
        : n.includes('url') ||
            n.includes('link') ||
            n.includes('website') ||
            n.includes('site') ||
            n.includes('domain')
          ? 'url'
          : n.includes('date') ||
              n.includes('time') ||
              n.includes('created') ||
              n.includes('updated') ||
              n.includes('birth') ||
              n.includes('start') ||
              n.includes('end')
            ? 'date'
            : n.startsWith('is') ||
                n.startsWith('has') ||
                n.startsWith('can') ||
                n.includes('enabled') ||
                n.includes('disabled') ||
                n.includes('active')
              ? 'boolean'
              : n.includes('count') ||
                  n.includes('number') ||
                  n.includes('amount') ||
                  n.includes('quantity') ||
                  n.includes('price') ||
                  n.includes('age') ||
                  n.includes('score') ||
                  n.includes('rating') ||
                  n.includes('size')
                ? 'number'
                : n.endsWith('s') && !n.endsWith('ss') && !n.endsWith('us')
                  ? 'array'
                  : n.includes('config') ||
                      n.includes('settings') ||
                      n.includes('data') ||
                      n.includes('info') ||
                      n.includes('details')
                    ? 'object'
                    : 'text';
  }
  const k = [];
  const i = [
    {
      name: 'Enrich Company',
      type: 'text',
      id: 'enrichCompany',
    },
    {
      name: 'Domain',
      type: 'text',
      id: 'f_0szqqc8XXxBN2S6jiEx',
    },
    { name: 'Url', type: 'text', id: 'f_0szqqc8Z5mwa6iwDnqp' },
  ];
  let A = false;
  editor.state.doc.descendants((E, I) => {
    let _;
    if (E.isText && E.text) {
      const T = E.text,
        P = /\{\{([^{}]+)\}\}/g;
      let R;
      for (; (R = P.exec(T)) !== null; ) {
        const M = (_ = R[1]) == null ? void 0 : _.trim();
        if (!M) {
          continue;
        }
        const L = i.find((B) => B.name === M),
          O = (L == null ? void 0 : L.type) || $ae(M);

        k.push({
          start: I + R.index,
          end: I + R.index + R[0].length,
          variableName: M,
          variableType: O,
        });
      }
    }
  });

  k.reverse().forEach(
    ({ start: E, end: I, variableName: _, variableType: T }) => {
      const P = editor.schema.nodes.variableToken;
      console.log(E, I, _, T);
      P &&
        editor.state.tr.replaceWith(
          E,
          I,
          P.create({ variableName: _, variableType: T }),
        );
      A = true;
    },
  );
  console.log(editor.schema.nodes.variableToken);
  A && editor.view.dispatch(editor.state.tr);
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
      <Stack border={'1px solid #ccc'} borderRadius={2} gap={1.25} p={2}>
        <EditorContent
          editor={editor}
          style={{
            padding: '0',
            // border: '1px solid #ccc',
            // borderRadius: '8px',
            outline: 'none',
          }}
        />
        <Stack flexDirection={'row'} justifyContent={'space-between'}>
          <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
            <Typography color={'text.secondary'} fontSize={10}>
              Type
            </Typography>
            <Box
              bgcolor={'#EAE9EF'}
              border={'1px solid #DFDEE6'}
              borderRadius={'2px'}
              color={'secondary'}
              fontSize={'10px'}
              px={'4px'}
              py={'2px'}
            >
              /
            </Box>
            <Typography color={'text.secondary'} fontSize={10}>
              to Insert column
            </Typography>
          </Stack>
          <StyledButton
            color={'info'}
            size={'small'}
            startIcon={<Icon component={ICON_SPARKLE} />}
            variant={'outlined'}
          >
            Generate
          </StyledButton>
        </Stack>
      </Stack>
      <Button onClick={handleClick} variant={'outlined'}>
        get json
      </Button>
      <Button onClick={handleGetText} variant={'outlined'}>
        get text
      </Button>
    </Stack>
  );
};
