import {
  ComponentRef,
  CSSProperties,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';

// const initialValue = {
//   type: 'object',
//   properties: {
//     CEO: {
//       type: 'string',
//       description: "Full name of the CEO or 'No CEO or LinkedIn profile found'",
//     },
//     LinkedIn_Profile: {
//       type: 'string',
//       description:
//         "LinkedIn profile URL of the CEO or 'No CEO or LinkedIn profile found'",
//     },
//   },
//   required: ['CEO', 'LinkedIn_Profile'],
// };

/*const renderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  switch (element.type) {
    case 'object':
      return (
        <div {...attributes} style={{ marginLeft: 16 }}>
          <span>{'{'}</span>
          {children}
          <span>{'}'}</span>
        </div>
      );
    case 'pair':
      return (
        <div {...attributes} style={{ marginLeft: 16 }}>
          <span style={{ color: '#c586c0' }}>"{element.key}"</span>
          {element.required && <span style={{ color: 'red' }}> *</span>}
          <span>: </span>
          {children}
        </div>
      );
    case 'value':
      return (
        <div {...attributes} style={{ color: '#4ec9b0', marginLeft: 16 }}>
          {children}
          {element.description && (
            <span style={{ color: 'gray', marginLeft: 8 }}>
              // {element.description}
            </span>
          )}
        </div>
      );
    default:
      return <span {...attributes}>{children}</span>;
  }
};*/

const renderLeaf = ({ attributes, children, leaf }: any) => {
  let color = '#6F6C7D';
  if (leaf.tokenType === 'key') {
    color = '#009874';
  }
  if (leaf.tokenType === 'string') {
    color = '#032F62';
  }
  if (leaf.tokenType === 'symbol') {
    color = '#D73A49';
  }
  if (leaf.tokenType === 'number') {
    color = '#1C00CF';
  }
  // space 不加颜色

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

type SlateEditorProps = {
  initialValue?: Descendant[];
  placeholder?: string;
  style?: CSSProperties;
};

export const SlateEditor = forwardRef<ComponentRef<any>, SlateEditorProps>(
  (
    {
      initialValue = [
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error

          type: 'paragraph',
          children: [{ text: '' }],
        },
      ],
      placeholder = 'Enter JSON',
      style,
    },
    ref,
  ) => {
    const [value, setValue] = useState<Descendant[]>([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      { type: 'paragraph', children: [{ text: '' }] },
    ]);
    const handleOnKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>, editor: any) => {
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

    const editor = useMemo(() => withReact(createEditor()), []);

    useImperativeHandle(ref, () => editor, [editor]);

    // Render the Slate context.
    return (
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => setValue(value)}
      >
        <Editable
          autoFocus
          onKeyDown={(e) => {
            handleOnKeyDown(e, editor);
          }}
          placeholder={placeholder}
          renderLeaf={renderLeaf}
          spellCheck
          style={{
            outline: 'none',
            minHeight: 32,
            borderRadius: '8px',
            border: '1px solid #E5E5E5',
            padding: '16px',
            fontSize: '12px',
            ...style,
          }}
        />
      </Slate>
    );
  },
);
