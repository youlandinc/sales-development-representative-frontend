import { DocumentType, NodeType, TextType } from '@tiptap/core';

export const insertWithPlaceholders = (
  text: string,
  fieldMapping: Record<string, string>,
) => {
  // editor.commands.setContent('');

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
      attrs: {
        label: match[1].trim(),
        id: fieldMapping?.[match[1]] || '',
      },
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
  return paragraphs;
  // paragraphs.forEach((paragraph) => {
  //   editor.commands.insertContent(paragraph);
  // });
};

export const extractPromptText = (
  doc: DocumentType,
  fieldMap: Record<string, string>,
): string => {
  let result = '';

  function walk(nodes?: NodeType[]) {
    if (!nodes) {
      return;
    }
    for (const node of nodes) {
      if (node.type === 'text') {
        result += (node as unknown as TextType).text || '';
      } else if (node.type === 'custom-placeholder') {
        const label = node.attrs?.label;
        const id = fieldMap[label] || label;
        // result += `{{${id}}}`;
        result += `{{${label}}}`;
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
  return result.trim();
};
