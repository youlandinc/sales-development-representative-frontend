'use client';

import { Box, Icon, Stack, SxProps, Typography } from '@mui/material';
import { Content, Editor } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  ComponentRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';

import { StyledButton } from '@/components/atoms';

import ICON_SPARKLE from '../assets/icon_sparkle.svg';
import { ExtensionMention } from './ExtensionMention';
import { ExtensionNode } from './ExtensionNode';
import { ExtensionStorage } from './ExtensionStorage';

// type NodeType = {
//   type: string;
//   content?: Node[];
//   text?: string;
//   attrs?: { [key: string]: any };
// };
interface PromptEditorProps {
  defaultValue?: Content;
  placeholder?: string;
  handleGenerate?: () => void;
  isLoading?: boolean;
  minHeight?: number;
  onEditorReady?: (editor: Editor) => void;
  editorSx?: SxProps;
}
export const PromptEditor = forwardRef<ComponentRef<any>, PromptEditorProps>(
  (
    {
      defaultValue = null,
      placeholder = '',
      handleGenerate,
      isLoading,
      minHeight = 150,
      onEditorReady,
      editorSx,
    },
    ref,
  ) => {
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
      onUpdate() {
        //TODO
        //onChange
      },
      extensions: [
        Placeholder.configure({
          placeholder,
        }),
        StarterKit.configure({
          paragraph: {
            HTMLAttributes: {
              style: 'margin:0px 0px 10px 0px;line-height:1.5;font-size:12px;',
            },
          },
        }),
        ExtensionMention,
        ExtensionNode,
        ExtensionStorage,

        // VariableTokenNode,
      ],
      content: null,
      // Don't render immediately on the server to avoid SSR issues
      immediatelyRender: false,
      editorProps: {
        attributes: {
          style: `padding:0px;outline:none;min-height:${minHeight}px;`,
        },
      },
      onCreate: ({ editor }) => {
        onEditorReady?.(editor);
        // Safely set content after editor is fully initialized with schema
        // try {
        //   if (defaultValue) {
        //     // Use setTimeout to ensure schema is fully registered
        //     setTimeout(() => {
        //       editor.commands.setContent(defaultValue);
        //     }, 0);
        //   }
        // } catch (error) {
        //   console.error('Error setting editor content:', error);
        // }
        // insertWithPlaceholders(editor, DEFAULT_PROMOT);
        // const a = insertWithPlaceholders(editor, DEFAULT_PROMOT);
        // console.log(a);
        // editor.commands.setContent(
        //   insertWithPlaceholders(editor, DEFAULT_PROMOT),
        // );
        // editor.commands.setContent(defaultValue);
      },
    });

    useEffect(() => {
      if (editor) {
        try {
          if (defaultValue) {
            // Use setTimeout to ensure schema is fully registered
            setTimeout(() => {
              editor.commands.setContent(defaultValue);
            }, 100);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error setting editor content:', error);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValue), minHeight, editor]);

    useImperativeHandle(ref, () => editor);

    if (!editor) {
      return null;
    }

    /*  const k = [];
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
      );*/
    // console.log(editor.schema.nodes.variableToken);
    // A && editor.view.dispatch(editor.state.tr);
    //   editor.commands.setContent(
    //     parsePromptTextToNodes(`
    // #CONTEXT#\nYou are tasked with finding a Java engineer associated with a given company or website, and extracting their professional profile and email address.\n\n#OBJECTIVE#\nIdentify a Java engineer related to {{Enrich Company}}, {{Domain}}, or {{Url}}, and extract their professional profile link (such as LinkedIn) and email address.\n\n#INSTRUCTIONS#\n1. Use the provided {{Enrich Company}}, {{Domain}}, or {{Url}} to search for employees or team members who are Java engineers (titles may include \"Java Engineer,\" \"Java Developer,\" or similar).\n2. Search LinkedIn, company team pages, or other professional directories for profiles matching the criteria.\n3. Extract the profile URL (preferably LinkedIn) and the email address if publicly available.\n4. If multiple Java engineers are found, return the first relevant result.\n5. If no Java engineer or email is found, return \"No Java engineer found\" or \"No email found\" as appropriate.\n\n#EXAMPLES#\nInput:\n  Enrich Company: Acme Corp\n  Domain: acmecorp.com\n  Url: https://acmecorp.com\n\nExpected Output:\n  Java Engineer Name: John Doe\n
    // `),
    //   );

    /*   function extractPromptText(
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
      } */

    return (
      <Stack gap={2}>
        <Stack
          gap={1.25}
          sx={{
            '& .tiptap p.is-editor-empty::before': {
              content: 'attr(data-placeholder)',
              color: '#B0ADBD',
              float: 'left' /* 避免光标错位 */,
              height: 0,
              pointerEvents: 'none',
              fontSize: 12,
              lineHeight: 1.5,
            },
            ...editorSx,
          }}
        >
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
              loading={isLoading}
              onClick={handleGenerate}
              size={'small'}
              startIcon={<Icon component={ICON_SPARKLE} />}
              sx={{
                width: 100,
                borderColor: '#D0CEDA !important',
              }}
              variant={'outlined'}
            >
              Generate
            </StyledButton>
          </Stack>
        </Stack>
        {/* <Button onClick={handleClick} variant={'outlined'}>
        get json
      </Button>
      <Button onClick={handleGetText} variant={'outlined'}>
        get text
      </Button> */}
      </Stack>
    );
  },
);
