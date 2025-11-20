# QueryAutoComplete 组件使用文档

## 📋 概述

`QueryAutoComplete` 是一个基于 MUI Autocomplete 封装的高级自动完成输入组件，提供了完整的类型安全和丰富的功能特性。组件内部封装了搜索逻辑、状态管理和数据格式化，对外提供简洁的接口。

## ✨ 核心特性

- ✅ **完全类型安全**: 使用 TypeScript 判别联合类型，根据 `multiple` 参数自动推断 `value` 和 `onChange` 的类型
- ✅ **单选/多选模式**: 通过 `multiple` prop 灵活切换
- ✅ **自定义输入支持**: `freeSolo` 模式允许用户输入任意值
- ✅ **内置异步搜索**: 通过 `url` prop 自动处理防抖搜索，无需外部管理
- ✅ **灵活的数据源**: 支持静态选项（`options`）或动态搜索（`url`）
- ✅ **智能去重**: 多选模式自动去重和空值过滤
- ✅ **自动格式化**: 支持多种选项格式，内部自动转换
- ✅ **扩展性强**: 支持所有 MUI Autocomplete 原生属性（`disabled`、`sx`、`className` 等）
- ✅ **精美样式**: 独立的 `QueryAutoCompleteChip` 组件，高性能渲染

## 🔧 类型定义

### AutoCompleteOption

选项数据结构：

```typescript
type AutoCompleteOption = {
  inputValue?: string; // 自定义输入值（freeSolo 模式下使用）
  label: string;       // 显示文本
};
```

### Props 类型系统

组件使用 **TypeScript 判别联合类型 (Discriminated Union)**，通过 `multiple` 参数自动推断所有相关类型：

```typescript
// 基础属性
interface QueryAutoCompletePropsBase {
  title?: string;
  subTitle?: string;
  placeholder?: string;
  /** API URL - 有 url 时内部处理搜索，无 url 时使用 options */
  url?: string | null;
  /** 静态选项列表 - 支持原始格式（{key, label, value}）或简化格式（{label}） */
  options?: Array<
    { key?: string; label: string; value?: string } | AutoCompleteOption
  >;
  freeSolo?: boolean;
  loadingText?: string;
  noOptionsText?: string;
}

// 多选模式
interface QueryAutoCompletePropsMultiple extends QueryAutoCompletePropsBase {
  multiple: true;                      // 判别器
  value?: string[];                    // 数组类型
  onChange?: (newValue: string[]) => void;
}

// 单选模式
interface QueryAutoCompletePropsSingle extends QueryAutoCompletePropsBase {
  multiple?: false;                    // 判别器
  value?: string | null;               // 字符串或 null
  onChange?: (newValue: string | null) => void;
}

// 额外支持的属性
interface AdditionalAutocompleteProps {
  disabled?: boolean;
  readOnly?: boolean;
  sx?: any;
  className?: string;
  id?: string;
  [key: string]: any; // 支持任意 MUI Autocomplete 原生属性
}

// 最终导出类型
export type QueryAutoCompleteProps =
  | (QueryAutoCompletePropsMultiple & AdditionalAutocompleteProps)
  | (QueryAutoCompletePropsSingle & AdditionalAutocompleteProps);
```

### 类型推断示例

TypeScript 会根据 `multiple` 自动推断类型：

```typescript
// ✅ 多选 - 自动推断
<QueryAutoComplete
  multiple={true}
  value={['a', 'b']}           // ✓ 类型: string[]
  onChange={(val) => {}}        // ✓ val 类型: string[]
/>

// ✅ 单选 - 自动推断
<QueryAutoComplete
  multiple={false}
  value="hello"                 // ✓ 类型: string | null
  onChange={(val) => {}}        // ✓ val 类型: string | null
/>

// ❌ 类型错误 - 会被 TypeScript 捕获
<QueryAutoComplete
  multiple={true}
  value="string"                // ❌ 类型错误！应该是 string[]
/>
```

## 使用示例

### 1. 多选模式 - 静态选项

使用预设的静态选项列表：

```tsx
import { QueryAutoComplete } from './base';

function MyComponent() {
  const [industries, setIndustries] = useState<string[]>([]);

  return (
    <QueryAutoComplete
      multiple={true}
      freeSolo={false}
      value={industries}
      onChange={setIndustries}
      options={[
        { key: 'tech', label: 'Technology', value: 'TECH' },
        { key: 'fin', label: 'Finance', value: 'FIN' },
        { key: 'health', label: 'Healthcare', value: 'HEALTH' },
      ]}
      placeholder="选择行业"
    />
  );
}
// 传出的值是 value 字段：['TECH', 'FIN']，显示的是 label 字段
```

### 2. 多选模式 - 带预设选项

提供预设选项列表，同时允许自定义输入：

```tsx
const industryOptions: AutoCompleteOption[] = [
  { label: 'Technology' },
  { label: 'Finance' },
  { label: 'Healthcare' },
];

<QueryAutoComplete
  multiple={true}
  freeSolo={true}
  value={selectedIndustries}
  onChange={setSelectedIndustries}
  options={industryOptions}
  placeholder="选择或输入行业"
/>
```

### 3. 多选模式 - 固定选项（非 freeSolo）

只允许从预设选项中选择：

```tsx
<QueryAutoComplete
  multiple={true}
  freeSolo={false}
  value={selectedTags}
  onChange={setSelectedTags}
  options={[
    { label: 'React' },
    { label: 'TypeScript' },
    { label: 'Next.js' },
  ]}
  placeholder="选择标签"
/>
```

### 4. 单选模式

单选输入框：

```tsx
function SingleSelectExample() {
  const [country, setCountry] = useState<string | null>(null);

  return (
    <QueryAutoComplete
      multiple={false}
      freeSolo={true}
      value={country}
      onChange={(newValue) => {
        // newValue 类型自动推断为 string | null
        setCountry(newValue);
      }}
      placeholder="输入国家名称"
    />
  );
}
```

### 5. 异步搜索（推荐）

组件内部自动处理搜索、防抖和状态管理：

```tsx
function AsyncSearchExample() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <QueryAutoComplete
      multiple={true}
      freeSolo={true}
      value={value}
      onChange={setValue}
      url="/api/companies/search"  // 组件自动拼接 ?q=xxx
      loadingText="搜索中..."
      noOptionsText="输入至少2个字符开始搜索"
      placeholder="搜索公司名称"
    />
  );
}
// 用户输入 "Google" → 自动请求 /api/companies/search?q=Google
// 内置 300ms 防抖，自动管理 loading 状态
```

### 6. 在 QueryContainer 中使用

配合 `QueryContainer` 实现标签和描述：

```tsx
<QueryContainer
  label="Company Names"
  description="Enter company names to search for"
>
  <QueryAutoComplete
    multiple={true}
    freeSolo={true}
    value={companies}
    onChange={setCompanies}
    placeholder="e.g. Amazon, Google"
  />
</QueryContainer>
```

## 参数详解

### 核心参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `multiple` | `true \| false` | - | 是否多选模式（影响 value 和 onChange 的类型） |
| `value` | `string[] \| string \| null` | - | 当前值（多选为数组，单选为字符串或 null） |
| `onChange` | `Function` | - | 值变化回调（参数类型随 multiple 自动推断） |
| `placeholder` | `string` | - | 占位符文本 |

### 选项相关

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `string \| null` | - | API URL，有值时组件内部处理搜索 |
| `options` | `Array<{key?, label, value?} \| AutoCompleteOption>` | `[]` | 静态选项列表，支持多种格式 |
| `freeSolo` | `boolean` | `true` | 是否允许自定义输入 |
| `noOptionsText` | `string` | `'No option'` | 无选项时的提示文本 |

### 搜索相关

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loadingText` | `string` | `'searching...'` | 搜索加载时的提示文本（仅当 url 存在时） |

### 显示相关

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 标题（目前未使用，预留） |
| `subTitle` | `string` | - | 副标题（目前未使用，预留） |

## 行为说明

### 多选模式

1. **值处理**:
   - 自动去重
   - 过滤掉空值
   - 返回纯字符串数组

2. **自定义输入**:
   - 当 `freeSolo={true}` 时，输入框会显示 "Add \"xxx\"" 选项
   - 选择后自动添加到值数组中

3. **删除操作**:
   - 每个已选值显示为一个 Chip
   - 点击 Chip 上的 × 图标可删除

### 单选模式

1. **值处理**:
   - 选择值时返回字符串
   - 清空时返回 `null`
   - 如果 `inputValue` 为空，返回 `null`

2. **清空操作**:
   - 内置清空按钮（MUI 默认）
   - 清空时触发 `onChange(null)`

## 样式定制

组件内置了以下样式：

- **输入框**: 最小高度 32px，字体大小 12px
- **Chip**: 高度 22px，最大宽度 160px，带删除按钮
- **清空按钮**: 始终可见

如需自定义样式，可以通过 `sx` prop 覆盖。

## ⚙️ 实现细节

### 值处理逻辑

#### 多选模式
```typescript
// 1. 接收 newValue（可能是 string[] 或 (string | AutoCompleteOption)[]）
// 2. 映射：AutoCompleteOption → string（取 inputValue）
// 3. 过滤：移除 undefined/null/空字符串
// 4. 去重：使用 Set 去除重复值
// 5. 返回：纯 string[] 数组

const value = Array.from(
  new Set(
    items
      .map((item) => typeof item === 'string' ? item : item.inputValue)
      .filter((v): v is string => !!v)
  )
);
```

#### 单选模式
```typescript
// 1. 接收 newValue（可能是 string | AutoCompleteOption | null）
// 2. 判断类型并提取值
// 3. 如果值存在返回 string，否则返回 null

const value = typeof item === 'string' ? item : item.inputValue;
onChange?.(value || null);
```

### 样式定制

组件内置了以下样式配置：

```typescript
// 输入框样式
'& .MuiInputBase-root': {
  minHeight: '32px',
  padding: '4px 9px !important',
  gap: 1,
}

// Chip 样式
{
  height: '22px',
  maxWidth: '160px',
  padding: '0 8px',
  borderRadius: '4px',
  backgroundColor: '#EAE9EF',
}
```

可以通过 `sx` prop 覆盖：

```tsx
<QueryAutoComplete
  {...props}
  sx={{
    '& .MuiInputBase-root': {
      minHeight: '40px', // 覆盖默认高度
    },
  }}
/>
```

## ⚠️ 注意事项

### 1. 类型推断

**判别联合类型**的工作原理：
- `multiple: true` → TypeScript 识别为 `QueryAutoCompletePropsMultiple`
- `multiple?: false` → TypeScript 识别为 `QueryAutoCompletePropsSingle`
- 类型系统自动关联 `value` 和 `onChange` 的参数类型

```typescript
// ✅ 正确用法
const [values, setValues] = useState<string[]>([]);
<QueryAutoComplete
  multiple={true}
  value={values}
  onChange={setValues} // 类型完美匹配
/>

// ❌ 错误用法
const [value, setValue] = useState<string>('');
<QueryAutoComplete
  multiple={true}
  value={value}        // ❌ 类型错误
  onChange={setValue}  // ❌ 类型错误
/>
```

### 2. Options 数据格式

组件期望的 `options` 类型为 `AutoCompleteOption[]`：

```typescript
// ✅ 正确
const options: AutoCompleteOption[] = [
  { label: 'Option 1' },
  { label: 'Option 2', inputValue: 'custom' },
];

// ❌ 错误 - 多余字段会被忽略
const options = [
  { key: '1', label: 'Option 1', value: 'opt1' } // key 和 value 无效
];

// ✅ 转换旧格式
const converted = rawOptions.map(opt => ({
  label: opt.label,
  inputValue: opt.value, // 可选：预填 inputValue
}));
```

### 3. FreeSolo 模式说明

- `freeSolo={true}`: 允许用户输入任意文本，未在 options 中的值会显示 "Add \"xxx\""
- `freeSolo={false}`: 只能从 options 中选择，不允许自定义输入

```tsx
// 自由输入模式
<QueryAutoComplete
  multiple={true}
  freeSolo={true}
  options={[{ label: 'Preset 1' }]}
  // 用户可以输入 "Custom Value"
/>

// 严格选择模式
<QueryAutoComplete
  multiple={true}
  freeSolo={false}
  options={[{ label: 'Only Option' }]}
  // 用户只能选择 "Only Option"
/>
```

### 4. 内置搜索原理

组件内部已实现完整的搜索逻辑：

```typescript
// 内部实现（不需要外部编写）
const onSearch = useCallback(async (inputValue: string) => {
  if (!url) return;
  
  // 清除之前的定时器
  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current);
  }
  
  // 输入太短时清空选项
  if (!inputValue || inputValue.length < 2) {
    setInternalOptions([]);
    return;
  }
  
  setLoading(true);
  
  // 防抖：300ms 后执行搜索
  debounceTimerRef.current = setTimeout(async () => {
    try {
      const searchUrl = `${url}?q=${encodeURIComponent(inputValue)}`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      
      const items = Array.isArray(data) ? data : data.data || [];
      const formattedOptions = items.map(item => ({
        label: item.label || item.name || item.value,
        inputValue: item.value || item.label || item.name,
      }));
      setInternalOptions(formattedOptions);
    } catch (error) {
      console.error('Search failed:', error);
      setInternalOptions([]);
    } finally {
      setLoading(false);
    }
  }, 300);
}, [url]);

// 使用（无需外部管理）
<QueryAutoComplete
  url="/api/search"
  // 其他 props...
/>
```

### 5. 性能优化建议

**大数据量场景 (>1000 条选项)**:
- ✅ 使用 `url` prop 启用服务端搜索（组件内置）
- ✅ 后端限制返回结果数量 (如最多返回 50 条)
- ✅ 后端实现分页加载
- ❌ 避免客户端一次性加载所有数据

**内置防抖配置**:
```typescript
// 组件内部默认配置
const DEBOUNCE_TIME = 300; // 输入搜索防抖时间
const MIN_SEARCH_LENGTH = 2; // 最少搜索字符数
```

## ❓ 常见问题

### Q1: 如何获取选中项的完整对象而不只是字符串？

**A:** 组件设计为只返回字符串值，以保持简单性。如需完整对象，在外部维护映射：

```typescript
const options: AutoCompleteOption[] = [
  { label: 'Option 1', inputValue: 'opt1' },
  { label: 'Option 2', inputValue: 'opt2' },
];

// 创建映射表
const optionMap = new Map(
  options.map(opt => [opt.label, opt])
);

// 获取完整对象
const selectedObjects = selectedValues
  .map(val => optionMap.get(val))
  .filter(Boolean);
```

### Q2: 如何禁用组件？

**A:** 使用 MUI Autocomplete 原生属性：

```tsx
<QueryAutoComplete
  {...props}
  disabled={true}        // 完全禁用
  readOnly={true}        // 只读模式
/>
```

### Q3: 如何自定义 Chip 样式？

**A:** Chip 样式通过 `useChipStyle` hook 定义。建议通过 `sx` prop 覆盖：

```tsx
<QueryAutoComplete
  {...props}
  sx={{
    '& .MuiAutocomplete-tag': {
      // 覆盖 Chip 样式（如果使用原生渲染）
    },
  }}
/>
```

如需完全自定义，可以 fork 组件并修改 `renderValue` 函数。

### Q4: 为什么单选模式返回 `null` 而不是空字符串？

**A:** 遵循 MUI Autocomplete 和 React 最佳实践：
- `null` = "无值/未选择"（语义明确）
- `""` = "空字符串值"（可能导致歧义）

```typescript
// ✅ 清晰的语义
if (value === null) {
  // 用户未选择任何值
}

// ❌ 混淆的语义
if (value === '') {
  // 是空字符串还是未选择？
}
```

### Q5: 如何处理 "Add \"xxx\"" 提示？

**A:** 这是 `freeSolo` 模式的特性。可以通过以下方式调整：

```tsx
// 禁用 "Add" 提示
<QueryAutoComplete
  freeSolo={false}  // 仅允许从选项中选择
/>

// 自定义提示文本
// 需要修改组件内部 filterOptions 中的 label
```

### Q6: 组件支持哪些 MUI Autocomplete 属性？

**A:** 通过 `AdditionalAutocompleteProps` 支持大部分原生属性：

```typescript
interface AdditionalAutocompleteProps {
  disabled?: boolean;
  readOnly?: boolean;
  sx?: any;
  className?: string;
  id?: string;
  [key: string]: any; // 其他 Autocomplete 原生属性
}
```

**支持的常用属性**：
- ✅ `disabled`、`readOnly`
- ✅ `sx`、`className`、`id`
- ✅ `size`、`fullWidth`
- ✅ `disableClearable`
- ✅ 其他 MUI Autocomplete props

**不支持/被覆盖的属性**：
- ❌ `renderInput`（内部使用 `StyledTextField`）
- ❌ `onChange`（类型已重新定义）
- ❌ `options`、`value`（类型已重新定义）

## 📝 总结

### 组件优势

1. **类型安全** 🛡️
   - 判别联合类型自动推断
   - 编译时类型检查
   - IDE 智能提示

2. **易用性** ✨
   - API 简洁直观
   - 合理的默认值
   - 丰富的使用示例

3. **功能完整** 🚀
   - 单选/多选
   - 自定义输入
   - 异步搜索
   - 智能去重

4. **扩展性** 🔧
   - 支持 MUI 原生属性
   - 可自定义样式
   - 灵活的配置选项

### 技术亮点

```typescript
// 1. 判别联合类型 - 类型安全
type Props = MultipleProps | SingleProps;

// 2. 智能值处理 - 去重 + 过滤
Array.from(new Set(items.map(...).filter(...)))

// 3. 类型守卫 - 精确过滤
.filter((v): v is string => !!v)

// 4. 扩展性 - 支持任意属性
interface Additional { [key: string]: any }
```

### 适用场景

- ✅ 表单输入（单选/多选）
- ✅ 标签选择器
- ✅ 搜索框（带建议）
- ✅ 数据筛选器
- ✅ 异步搜索场景

### 不适用场景

- ❌ 需要返回完整对象（仅返回 string）
- ❌ 需要树形结构选择
- ❌ 需要分组显示（可通过 MUI 原生实现）

## 📌 快速参考

```tsx
// 最简单的用法
<QueryAutoComplete
  multiple={true}
  value={values}
  onChange={setValues}
  placeholder="输入或选择"
/>

// 完整配置
<QueryAutoComplete
  // 必填
  multiple={true}
  value={values}
  onChange={setValues}
  
  // 选项
  options={[{ label: 'Option 1' }]}
  freeSolo={true}
  
  // 异步搜索
  loading={isLoading}
  onInputChange={handleSearch}
  loadingText="搜索中..."
  noOptionsText="未找到结果"
  
  // UI
  placeholder="请输入"
  disabled={false}
  
  // 样式
  sx={{ width: 300 }}
  className="custom-class"
/>
```

## 🌐 API 响应格式

当使用 `url` prop 时，组件期望以下响应格式：

```typescript
// 方式1：直接返回数组
[
  { label: 'Item 1', value: 'val1' },
  { name: 'Item 2', value: 'val2' },  // 支持 name 字段
  { label: 'Item 3' },                 // value 可选
]

// 方式2：包装在 data 字段中
{
  data: [
    { label: 'Item 1', value: 'val1' }
  ]
}

// 组件会自动提取以下字段（优先级）
{
  label: item.label || item.name || item.value || String(item),
  inputValue: item.value || item.label || item.name || String(item),
}
```

### 请求格式

```typescript
// 用户输入 "Google"
// 自动请求: GET /api/search?q=Google

// 最少输入2个字符才会触发搜索
// 300ms 防抖，避免频繁请求
```

## 🏗️ 组件架构

### 文件结构

```
QueryAutoComplete/
├── QueryAutoComplete.tsx       # 主组件
├── QueryAutoCompleteChip.tsx   # Chip 渲染组件（高性能）
├── index.ts                     # 导出配置
└── QueryAutoComplete.md         # 文档
```

### 核心设计

1. **内部状态管理**
   - `internalOptions` - 格式化后的选项列表
   - `loading` - 加载状态
   - `debounceTimerRef` - 防抖定时器

2. **自动格式化**
   ```typescript
   // 支持多种输入格式
   { key: 'opt1', label: 'Option 1', value: 'val1' }  // 原始格式
   { label: 'Option 1' }                               // 简化格式
   
   // 内部统一转换为
   { label: 'Option 1', inputValue: 'val1' }
   ```

3. **智能搜索**
   - 自动拼接 `?q=` 参数
   - 300ms 防抖
   - 最少2字符搜索
   - 自动管理 loading 状态

4. **独立 Chip 组件**
   - 使用 `QueryAutoCompleteChip` 组件
   - 避免 MUI 默认 Chip 的性能问题
   - 轻量级 Image 图标

## 🏗️ 组件架构

### 文件结构

```
QueryAutoComplete/
├── QueryAutoComplete.tsx        # 主组件（~100 行）
├── QueryAutoCompleteChip.tsx    # Chip 渲染组件
├── hooks/
│   ├── useQueryAutoComplete.ts  # 统一 Hook（所有逻辑）
│   └── index.ts                  # Hook 导出
├── index.ts                      # 组件导出
└── QueryAutoComplete.md          # 完整文档
```

### Hook 架构

**useQueryAutoComplete** - 统一处理所有逻辑

```typescript
export const useQueryAutoComplete = ({
  url,
  staticOptions,
  value,
  multiple,
  onChange,
}) => {
  // ==================== 状态管理 ====================
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ==================== 初始化静态选项 ====================
  useEffect(() => { /* 格式化 { key, label, value } → { label, inputValue } */ });

  // ==================== 动态搜索 ====================
  const onSearch = useCallback(async (inputValue) => {
    // 防抖 300ms
    // 最少 2 字符
    // 自动 fetch 和格式化
  });

  // ==================== 值转换 ====================
  const autocompleteValue = useMemo(() => {
    // 字符串 → 对象（单选）
    // 字符串数组 → 对象数组（多选）
  });

  // ==================== 事件回调 ====================
  const onValueChange = useCallback(() => { /* 对象 → 字符串 */ });
  const onInputValueChange = useCallback(() => { /* 触发搜索 */ });
  const onGetOptionLabel = useCallback(() => { /* 显示 label */ });
  const onIsOptionEqualToValue = useCallback(() => { /* 比较 inputValue */ });

  return {
    options,
    loading,
    autocompleteValue,
    onValueChange,
    onInputValueChange,
    onGetOptionLabel,
    onIsOptionEqualToValue,
  };
};
```

### 重构对比

| 指标 | 重构前 | 重构后 | 改善 |
|------|--------|--------|------|
| 主组件行数 | 284 | ~100 | ⬇️ 65% |
| 逻辑封装 | ❌ 混在组件中 | ✅ Hook 分离 | ⬆️⬆️⬆️ |
| 可测试性 | ❌ 困难 | ✅ Hook 可独立测试 | ⬆️⬆️⬆️ |
| 可复用性 | ❌ 无法复用 | ✅ Hook 可复用 | ⬆️⬆️⬆️ |
| 代码可读性 | ⚠️ 较差 | ✅ 清晰 | ⬆️⬆️⬆️ |

### Hook 使用示例

```typescript
// 在自定义组件中复用
import { useQueryAutoComplete } from './QueryAutoComplete';

function CustomSelect() {
  const {
    options,
    loading,
    autocompleteValue,
    onValueChange,
  } = useQueryAutoComplete({
    url: '/api/search',
    value: selectedValue,
    multiple: false,
    onChange: setSelectedValue,
  });

  return <MyCustomComponent options={options} loading={loading} />;
}
```

## 🔄 版本历史

### v2.1.0 (2024-11-19)
- ✅ **架构优化**: 提取统一的 `useQueryAutoComplete` Hook
- ✅ 主组件简化至 ~100 行
- ✅ 逻辑集中，内部模块化清晰
- ✅ 提升可测试性和可复用性

### v2.0.0 (2024-11-19)
- ✅ **重大更新**: 内部封装搜索逻辑
- ✅ 新增 `url` prop 支持动态搜索
- ✅ 移除外部 `loading` 和 `onInputChange` props
- ✅ 自动格式化多种选项格式
- ✅ 提取独立的 `QueryAutoCompleteChip` 组件
- ✅ 优化文件结构（移至独立文件夹）

### v1.0.0 (2024-11-18)
- ✅ 初始版本发布
- ✅ 支持单选/多选模式
- ✅ 完整的类型安全（判别联合类型）
- ✅ 自动去重和空值过滤

---

**组件路径**: `src/components/molecules/DirectoriesIndustry/DirectoriesIndustryQuery/base/QueryAutoComplete/`  
**文档维护**: 2024-11-19  
**技术栈**: React + TypeScript + MUI + react-jss  
**关键特性**: 内部搜索、自动格式化、Hook 架构、高性能渲染
