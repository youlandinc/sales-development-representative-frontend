import { flattenDeep, last } from 'lodash-es';
import { ClipboardEvent } from 'react';
import { Node, Range, Text } from 'slate';
import { ReactEditor } from 'slate-react';

// 处理 Paste 事件
export const handlePasteEvent = ({
  e, // 原始事件
  clipboard, // 本地保存的 clipboard（可能是上一次 Copy 时记录的）
  editor, // Slate Editor 实例
  setClipboard, // 更新 clipboard 的 setter
}: {
  e: ClipboardEvent<HTMLDivElement>;
  clipboard: Node[] | null;
  editor: ReactEditor;
  setClipboard: (clipboard: Node[] | null) => void;
}) => {
  e.preventDefault();
  e.stopPropagation();

  // 从剪贴板里拿 Slate 的自定义 fragment 数据
  const slateFragment = e.clipboardData.getData('application/x-slate-fragment');

  // 如果没有 slate fragment，就退化为普通文本
  if (!slateFragment) {
    const plainText = e.clipboardData.getData('text/plain');
    editor.insertText(plainText);
    return;
  }

  try {
    // Slate 的 fragment 是经过 base64 编码的 JSON
    const decoded = decodeURIComponent(window.atob(slateFragment));
    const fragment = JSON.parse(decoded);

    if (clipboard) {
      // 如果我们本地有保存过 fragment（说明是 Copy / Cut 产生的）
      editor.insertFragment(clipboard);
      setClipboard(null); // 用完后清空
      return;
    }

    // 否则直接粘贴 fragment
    editor.insertFragment(fragment);
  } catch {
    // 出现解析错误，退化为普通文本粘贴
    const plainTextFallback = e.clipboardData.getData('text/plain');
    editor.insertText(plainTextFallback);
  }
};

export const copyOrCutContent = ({
  editor,
  setClipboard,
}: {
  editor: ReactEditor;
  setClipboard: any;
}) => {
  if (!editor.selection) {
    return;
  }
  const content = Node.fragment(editor, editor.selection);
  setClipboard(content);
};
// 正则表达式：匹配 JSON 的各种 token
const reJsonKey = /"[^"\s]+":/; // 匹配 JSON 的 key，例如 `"name":`
const reJsonNull = /null/; // 匹配 null
const reJsonNumber = /\b\d+\b/; // 匹配数字，例如 123
const reJsonString = /"[^"\s]+"/; // 匹配字符串，例如 "abc"
const reJsonBoolean = /true|false/; // 匹配布尔值
const reJsonPunctuation = /[{}[\],:]/; // 匹配标点符号 {},[]:

// 根据 token 的内容，返回对应的高亮类型
export const getJsonTokenType = (token: string) =>
  reJsonKey.test(token)
    ? 'json-key'
    : reJsonString.test(token)
      ? 'json-string'
      : reJsonBoolean.test(token)
        ? 'json-boolean'
        : reJsonNull.test(token)
          ? 'json-null'
          : reJsonNumber.test(token)
            ? 'json-number'
            : 'json-punctuation';

// 把所有正则组合成一个大正则，全局匹配 JSON 里的所有 token
const reJsonTokens = new RegExp(
  [
    reJsonKey.source,
    reJsonBoolean.source,
    reJsonNull.source,
    reJsonString.source,
    reJsonNumber.source,
    reJsonPunctuation.source,
  ].join('|'),
  'g',
);

/**
 * 遍历 Slate 节点文本，为其中的 JSON token 添加高亮 range
 *
 * @param node  当前 Slate 节点
 * @param path  节点路径
 * @param ranges 已有的 ranges（存放高亮信息）
 * @returns 更新后的 ranges
 */
export const decorateJson = ({
  node,
  path,
  ranges,
}: {
  node: Text;
  path: number[];
  ranges: Range[];
}) => {
  if (!Text.isText(node)) {
    return ranges;
  } // 只处理文本节点

  const text = node.text;
  let match;

  // 循环匹配 JSON token
  while ((match = reJsonTokens.exec(text)) !== null) {
    const start = match.index; // token 起始位置
    const end = start + (match[0]?.length ?? 0); // token 结束位置
    const type = getJsonTokenType(match[0]); // 获取 token 类型

    // 生成 Slate 的装饰 range
    const range = {
      anchor: { path, offset: start },
      focus: { path, offset: end },
      type, // 用于渲染时加 className，比如 json-key, json-string
    };

    ranges.push(range);
  }

  return ranges;
};

// const wC = ({ input: t, fallbackToOldGrammar: n, onNewGrammarFailure: s }) => {
//   const a = trim(t);
//   try {
//     const i = a.split(/(?:\r\n|\r|\n)/).join(`
// `);
//     return DP(i, mue);
//   } catch (i) {
//     if (!n) throw i;
//     const r = DP(a, gue);
//     return s == null || s({ input: t, oldResult: r }), r;
//   }
// };

// const xt = ((t) => (
//   (t[(t.TERNARY = 0)] = 'TERNARY'),
//   (t[(t.ARRAY_SUBSCRIPT = 1)] = 'ARRAY_SUBSCRIPT'),
//   (t[(t.DOT = 2)] = 'DOT'),
//   (t[(t.UNARY_PLUS = 3)] = 'UNARY_PLUS'),
//   (t[(t.UNARY_MINUS = 4)] = 'UNARY_MINUS'),
//   (t[(t.BIT_NEGATION = 5)] = 'BIT_NEGATION'),
//   (t[(t.NOT = 6)] = 'NOT'),
//   (t[(t.PLUS = 7)] = 'PLUS'),
//   (t[(t.MINUS = 8)] = 'MINUS'),
//   (t[(t.MULTIPLY = 9)] = 'MULTIPLY'),
//   (t[(t.DIVIDE = 10)] = 'DIVIDE'),
//   (t[(t.OR = 11)] = 'OR'),
//   (t[(t.AND = 12)] = 'AND'),
//   (t[(t.BIT_OR = 13)] = 'BIT_OR'),
//   (t[(t.BIT_AND = 14)] = 'BIT_AND'),
//   (t[(t.BIT_XOR = 15)] = 'BIT_XOR'),
//   (t[(t.EQUAL = 16)] = 'EQUAL'),
//   (t[(t.NOT_EQUAL = 17)] = 'NOT_EQUAL'),
//   (t[(t.LESS_THAN = 18)] = 'LESS_THAN'),
//   (t[(t.GREATER_THAN = 19)] = 'GREATER_THAN'),
//   (t[(t.LESS_OR_EQUAL = 20)] = 'LESS_OR_EQUAL'),
//   (t[(t.GREATER_OR_EQUAL = 21)] = 'GREATER_OR_EQUAL'),
//   (t[(t.BIT_SHIFT_LEFT = 22)] = 'BIT_SHIFT_LEFT'),
//   (t[(t.BIT_SHIFT_RIGHT = 23)] = 'BIT_SHIFT_RIGHT'),
//   (t[(t.MODULO = 24)] = 'MODULO'),
//   (t[(t.CALL = 25)] = 'CALL'),
//   (t[(t.LITERAL_ARRAY = 26)] = 'LITERAL_ARRAY'),
//   (t[(t.NULLISH_COALESCE = 27)] = 'NULLISH_COALESCE'),
//   (t[(t.EQUAL_STRICT = 28)] = 'EQUAL_STRICT'),
//   (t[(t.NOT_EQUAL_STRICT = 29)] = 'NOT_EQUAL_STRICT'),
//   (t[(t.LITERAL_OBJECT = 30)] = 'LITERAL_OBJECT'),
//   (t[(t.CONSTRUCT = 31)] = 'CONSTRUCT'),
//   t
// ))(xt || {});

// const Lm = (t) =>
//   t
//     ? t.type === 'operator' && t.operator === xt.PLUS
//       ? [...Lm(t.left), ...Lm(t.right)]
//       : [t]
//     : [];

export const parseTextToNodes = (input: string) => {
  if (!input || input === '') {
    return [{ text: '' }];
  }

  try {
    // 处理字符串中的转义换行符
    const normalized = input.replace(/\\n/g, '\n').replace(/\\r/g, '\r');

    // 转换成扁平化节点数组
    return flattenDeep([{ text: normalized }])
      .map((current, index, arr) => {
        const result: any[] = [];
        const prev = arr[index - 1];

        // 如果当前和前一个都不是文本节点，插入一个空文本节点
        if (!Text.isText(current) && !Text.isText(prev)) {
          result.push({ text: '' });
        }

        // 加入当前节点
        result.push(current);

        // 如果最后一个不是文本节点，收尾补一个空节点
        if (current === last(arr) && !Text.isText(current)) {
          result.push({ text: '' });
        }

        return result;
      })
      .reduce((acc, cur) => [...acc, ...cur], []);
  } catch {
    return [{ text: '' }];
  }
};

export const escapeForJsonString = (str: string) => str;
// str &&
// `"${str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"')}"`;

export const wrapAsTemplateExpression = (str: string) =>
  `{{${/^\d|[.,@ ]/.test(str) ? `[${escapeForJsonString(str)}]` : str}}}`;

/**
 * 将路径数组转成安全的 JS 可选链访问表达式
 * 例如 ["user", "name"] -> {{user}}?.name
 */
export const buildPathExpression = (
  path: string[],
  jsonStringify = false,
  formatForJson = false,
  appendComma = false,
) => {
  const [first, ...rest] = path;

  const expression =
    (jsonStringify ? 'JSON.stringify(' : '') +
    (formatForJson ? 'formatForJSON(' : '') +
    wrapAsTemplateExpression(first) +
    rest
      .map((segment) => {
        if (typeof segment === 'number') {
          return `?.[${segment}]`; // 数字索引用 []
        }

        const quotedStringRegex = /'[^']*'|"[^"]*"/;

        // 简单标识符 -> ?.key
        if (/^[a-zA-Z_]*$/.test(segment)) {
          return `?.${segment}`;
        }

        // 否则加上括号 ?.["xxx"]
        return `?.[${
          quotedStringRegex.test(segment)
            ? segment
            : escapeForJsonString(segment)
        }]`;
      })
      .join('') +
    (jsonStringify ? ')' : '') +
    (formatForJson ? ')' : '') +
    (appendComma ? '+ "," ' : '');

  return expression;
};

/**
 * 将 Slate 节点数组转成拼接的 JS 表达式字符串
 */
export const buildExpressionFromNodes = ({
  nodes,
  isCommaSeparated = false,
}: {
  nodes: any[];
  isCommaSeparated?: boolean;
}) =>
  nodes
    // 过滤空文本
    .filter((n) => !Text.isText(n) || n.text)
    .map((node) => {
      if (Text.isText(node)) {
        return escapeForJsonString(node.text);
      }

      if (node.type === 'tag') {
        return escapeForJsonString(node.value + ', ');
      }

      if (node.type === 'path') {
        return buildPathExpression(
          node.path,
          node.isJSONStringified ?? false,
          node.isFormattedForJSON ?? false,
          isCommaSeparated,
        );
      }

      return '';
    })
    .join(' + ');

export const validateJson = (t: string) => {
  try {
    const parsed = JSON.parse(t);
    return { error: null, parsed };
  } catch (n) {
    return n instanceof SyntaxError
      ? { error: n, parsed: null }
      : { error: { message: 'Unknown error' }, parsed: null };
  }
};
