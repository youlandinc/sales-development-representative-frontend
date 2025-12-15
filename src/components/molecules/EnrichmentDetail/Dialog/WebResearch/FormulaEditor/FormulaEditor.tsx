import { Typography } from '@mui/material';
import { compact, flatten } from 'lodash-es';
import {
  ClipboardEvent,
  CSSProperties,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Descendant, Element, Node, NodeEntry, Text } from 'slate';
import { Editable, ReactEditor, RenderLeafProps, Slate } from 'slate-react';

import { useFormatString } from '../hooks';

import {
  buildExpressionFromNodes,
  copyOrCutContent,
  decorateJson,
  handlePasteEvent,
  parseTextToNodes,
  validateJson,
} from '@/utils';

interface LeafType extends Text {
  type: string;
}

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const { type } = leaf as LeafType;
  // space 不加颜色
  let color = '#6F6C7D';
  switch (type) {
    case 'json-punctuation':
      color = '#D73A49';
      break;
    case 'json-boolean':
      color = '#005CC5';
      break;
    case 'json-nescapeForJsonStringber':
      color = '#005CC5';
      break;
    case 'json-string':
      color = '#032F62';
      break;
    case 'json-key':
      color = '#009874';
      break;
    case 'json-null':
      color = '#24292E';
      break;
    default:
      break;
  }

  return (
    <span
      {...attributes}
      style={{
        color,
        fontFamily: 'monospace',
        fontSize: 14,
        whiteSpace: 'pre-wrap',
      }}
    >
      {children}
    </span>
  );
};

interface SlateEditorProps {
  editor: ReactEditor;
  initialValue?: string;
  placeholder?: string;
  style?: CSSProperties;
  onEditorReady?: (editor: ReactEditor) => void;
  onValueChange?: (value: string) => void;
}

export const FormulaEditor = forwardRef<ReactEditor, SlateEditorProps>(
  (
    {
      editor,
      initialValue = '',
      placeholder = 'Enter JSON',
      style,
      onEditorReady,
      onValueChange,
    },
    ref,
  ) => {
    // const editor = useMemo(() => withReact(createEditor()), []);
    const [error, setError] = useState<string>('');
    const defaultValue = [
      { type: 'paragraph', children: parseTextToNodes(initialValue) },
    ];
    const [value, setValue] = useState<Descendant[]>(defaultValue);

    // 保存一个临时的剪贴板内容
    const [clipboard, setClipboard] = useState<Node[] | null>(null);

    // 从节点树提取 paragraph 的 children，拼接成纯文本
    const paragraphChildren = flatten(
      compact(
        value.map((n) =>
          Element.isElement(n) && (n as any).type === 'paragraph'
            ? n.children
            : null,
        ),
      ),
    );

    // 把文本转成 JSON 字符串
    const currentString =
      Element.isElement(value?.[0]) && (value[0] as any).type === 'paragraph'
        ? buildExpressionFromNodes({
            nodes: paragraphChildren,
            isCommaSeparated: false,
          })
        : '';

    // JSON 转换函数 j1（可能是格式化 JSON）
    const formattedString = useFormatString(currentString);

    // 当 JSON 发生变化时，触发外部 setValue
    useEffect(() => {
      if (currentString !== formattedString) {
        onValueChange?.(currentString);
      }
    }, [onValueChange, value, currentString, formattedString]);

    // JSON 装饰器：用于语法高亮（调用 L8e 前面定义的）
    const decorate = useCallback(([node, path]: NodeEntry) => {
      const ranges: any[] = [];
      return decorateJson({ node: node as Text, path, ranges });
    }, []);

    // 处理 Copy / Cut 事件
    const handleCopyOrCut = useCallback(() => {
      // o$ 看起来是一个工具函数（可能负责从 editor 里取出内容并存到 state）
      copyOrCutContent({ editor, setClipboard });
    }, [editor]);

    // React 的 useCallback 包装，保证依赖更新时函数也更新
    const handlePaste = useCallback(
      (event: ClipboardEvent<HTMLDivElement>) => {
        handlePasteEvent({
          e: event,
          clipboard,
          editor,
          setClipboard,
        });
      },
      [clipboard, editor],
    );

    const handleOnKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>, editor: ReactEditor) => {
        switch (event.key) {
          case 'Enter':
            // 当按下 Enter 且不是 Ctrl/Meta 组合时（并且不是 Shift+Enter）
            if (!event.ctrlKey || !event.metaKey || event.shiftKey) {
              editor?.insertText('\n'); // 插入换行
            }
            event.preventDefault();
            event.stopPropagation();
            break;

          case 'Tab':
            // 当按下 Shift+Tab
            if (event.shiftKey) {
              editor?.insertText('\t'); // 插入制表符
              event.preventDefault();
              event.stopPropagation();
            }
            break;
        }
      },
      [],
    );

    const handleBlur = useCallback(() => {
      const content =
        editor?.children
          ?.map((n) => Node.string(n))
          .join('')
          ?.trim() || '';
      if (content === '') {
        setError('');
        return;
      }
      const { error } = validateJson(
        editor?.children?.map((n) => Node.string(n)).join('\n') || '',
      );
      setError(error?.message || '');
    }, [editor]);

    useEffect(() => {
      onEditorReady?.(editor);
    }, [editor, onEditorReady]);

    useImperativeHandle(ref, () => editor, [editor]);

    // Render the Slate context.
    return (
      <Slate
        editor={editor}
        initialValue={defaultValue}
        onChange={setValue}
        // value={value}
      >
        <Editable
          autoFocus
          decorate={decorate}
          onBlur={handleBlur}
          onCopy={handleCopyOrCut}
          onCut={handleCopyOrCut}
          onKeyDown={(e) => handleOnKeyDown(e, editor)}
          onPaste={handlePaste}
          placeholder={placeholder}
          renderLeaf={renderLeaf}
          spellCheck
          style={{
            outline: 'none',
            minHeight: 32,
            borderRadius: '8px',
            border: '1px solid #E5E5E5',
            borderColor: error ? '#D73A49' : '#E5E5E5',
            padding: '16px',
            fontSize: '12px',
            ...style,
          }}
        />
        {error && (
          <Typography color={'#D73A49'} variant={'body3'}>
            {error}
          </Typography>
        )}
      </Slate>
    );
  },
);

FormulaEditor.displayName = 'FormulaEditor';
