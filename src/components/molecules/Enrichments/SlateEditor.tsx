import {
  ComponentRef,
  CSSProperties,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import { createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';

const initialValue = {
  type: 'object',
  properties: {
    CEO: {
      type: 'string',
      description: "Full name of the CEO or 'No CEO or LinkedIn profile found'",
    },
    LinkedIn_Profile: {
      type: 'string',
      description:
        "LinkedIn profile URL of the CEO or 'No CEO or LinkedIn profile found'",
    },
  },
  required: ['CEO', 'LinkedIn_Profile'],
};

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

export const tokenizeJSON = (jsonStr: string) => {
  const tokenPattern =
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(true|false|null)\b|[{}[\],]|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\s+)/g;

  const tokens: { text: string; type: string }[] = [];

  jsonStr.replace(tokenPattern, (match) => {
    let type = 'plain';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        type = 'key'; // JSON key
      } else {
        type = 'string'; // string value
      }
    } else if (/true|false/.test(match)) {
      type = 'boolean';
    } else if (/null/.test(match)) {
      type = 'null';
    } else if (/[{}[\],]/.test(match)) {
      type = 'symbol';
    } else if (/^\s+$/.test(match)) {
      type = 'space';
    } else {
      type = 'number';
    }

    tokens.push({ text: match, type });
    return '';
  });

  return tokens;
};

// token → Slate 节点
export const schemaToSlate = (schema?: Record<any, any>) => {
  const jsonStr = JSON.stringify(schema, null, 2);
  const tokens = tokenizeJSON(jsonStr || '');

  return [
    {
      type: 'paragraph',
      children: tokens.map((t) => ({
        text: t.text,
        tokenType: t.type,
      })),
    },
  ];
};

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
  initialValue?: Record<any, any>;
  placeholder?: string;
  style?: CSSProperties;
};

export const SlateEditor = forwardRef<ComponentRef<any>, SlateEditorProps>(
  ({ initialValue, placeholder = 'Enter JSON', style }, ref) => {
    const handleOnKeyDown = useCallback(
      (I: KeyboardEvent<HTMLDivElement>, _: any) => {
        switch (I.key) {
          case 'Enter':
            (!I.ctrlKey || !I.metaKey || I.shiftKey) &&
              (_ == null ||
                _.insertText(`
`));
            I.preventDefault();
            I.stopPropagation();
            break;
          case 'Tab':
            I.shiftKey &&
              (_ == null || _.insertText('	'),
              I.preventDefault(),
              I.stopPropagation());
            break;
        }
      },
      [],
    );
    // const renderElement = useCallback(
    //   (props: RenderElementProps) => <Element {...props} />,
    //   [],
    // );
    // const renderLeaf = useCallback(
    //   (props: RenderLeafProps) => <Leaf {...props} />,
    //   [],
    // );
    const editor = useMemo(() => withReact(createEditor()), []);

    useImperativeHandle(ref, () => editor, [editor]);
    // Render the Slate context.
    return (
      <Slate editor={editor} initialValue={schemaToSlate(initialValue)}>
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
            ...style,
          }}
        />
      </Slate>
    );
  },
);
