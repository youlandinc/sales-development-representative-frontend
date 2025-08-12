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
