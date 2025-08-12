export const insertWithPlaceholders = (text: string) => {
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
  return paragraphs;
  // paragraphs.forEach((paragraph) => {
  //   editor.commands.insertContent(paragraph);
  // });
};
