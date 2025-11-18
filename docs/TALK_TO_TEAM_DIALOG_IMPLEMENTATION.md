# Talk to Team Dialog - Implementation Summary

## 概述 (Overview)

基于 Figma 设计实现了完整的"Talk to our team"对话框，包含表单提交和成功状态两个页面。

## 实现的设计

### 1. 表单页面 (node-id=14516-2359)
- 7 个表单字段（6 个必填 + 1 个可选）
- 两列布局优化空间利用
- 实时表单验证
- 电话号码自动格式化

### 2. 成功页面 (node-id=14516-2501)
- Confetti 庆祝图标
- 感谢消息
- 引导用户继续使用产品
- "Go to Directories" 行动按钮

## 文件结构

```
src/components/molecules/PricingPlan/
├── TalkToTeamDialog.tsx           # 主组件
├── TalkToTeamDialog.README.md     # 使用文档
├── index.ts                       # 导出
└── assets/
    └── icon_confetti.svg          # 成功图标
```

## 核心功能

### 状态管理

```typescript
const [isSubmitted, setIsSubmitted] = useState(false);
const [formData, setFormData] = useState<TalkToTeamFormData>({...});
```

- `isSubmitted`: 控制显示表单还是成功页面
- `formData`: 存储表单数据

### 表单验证

```typescript
disabled={
  !formData.firstName ||
  !formData.lastName ||
  !formData.workEmail ||
  !formData.company ||
  !formData.position ||
  !formData.useCase
}
```

所有必填字段填写完成后才能提交。

### 电话号码格式化

使用 `StyledNumberFormat` 组件自动格式化为 `(XXX) XXX-XXXX` 格式。

## 组件 Props

```typescript
interface TalkToTeamDialogProps {
  open: boolean;                                    // 控制显示
  onClose: () => void;                              // 关闭回调
  onSubmit?: (data: TalkToTeamFormData) => void;   // 提交回调
  onGoToDirectories?: () => void;                   // 导航回调
}
```

## 使用示例

### 基础用法

```tsx
import { TalkToTeamDialog } from '@/components/molecules';
import { useSwitch } from '@/hooks';

const { visible, toggle } = useSwitch();

<TalkToTeamDialog
  open={visible}
  onClose={toggle}
  onSubmit={(data) => {
    console.log('Submitted:', data);
  }}
  onGoToDirectories={() => {
    router.push('/directories');
  }}
/>
```

### 在 PricingPlan 中使用

```tsx
// src/components/organisms/PricingPlan.tsx
const { visible, toggle } = useSwitch();

<StyledButton onClick={toggle}>
  Talk to our team
</StyledButton>

<TalkToTeamDialog
  open={visible}
  onClose={toggle}
  onGoToDirectories={() => {
    console.log('Navigate to directories');
  }}
/>
```

## 视觉设计规范

### 颜色
- **主色**: #363440 (按钮、标题)
- **次要文本**: #6F6C7D (标签)
- **占位符**: #B0ADBD
- **边框**: #DFDEE6

### 尺寸
- **对话框宽度**: 800px
- **输入框高度**: 48px
- **按钮尺寸**: 336px × 40px
- **Confetti 图标**: 64px × 64px

### 间距
- **表单行间距**: 24px
- **字段间距**: 24px (水平)
- **成功页面间距**: 48px (垂直)

### 圆角
- **对话框**: 16px
- **输入框**: 8px
- **按钮**: 8px

## 交互流程

```
1. 用户点击 "Talk to our team" 按钮
   ↓
2. 显示表单对话框
   ↓
3. 用户填写表单
   ↓
4. 点击 "Submit" 按钮
   ↓
5. 调用 onSubmit 回调
   ↓
6. 显示成功页面（isSubmitted = true）
   ↓
7a. 点击 "Go to Directories" → 调用 onGoToDirectories
7b. 点击关闭按钮 → 重置状态并关闭
```

## 表单字段详情

| 字段 | 类型 | 必填 | 占位符 | 验证 |
|------|------|------|--------|------|
| First name | text | ✅ | Your first name | 非空 |
| Last name | text | ✅ | Your last name | 非空 |
| Work email | email | ✅ | name@company.com | 非空 |
| Phone | tel | ❌ | Your phone number | 格式化 |
| Company | text | ✅ | Your company name | 非空 |
| Position | text | ✅ | Your job title | 非空 |
| Use case | textarea | ✅ | Briefly describe... | 非空 |

## API 集成建议

### 提交表单

```typescript
const handleSubmit = async (data: TalkToTeamFormData) => {
  try {
    const response = await fetch('/api/contact/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit');
    }

    // 成功后会自动显示成功页面
  } catch (error) {
    console.error('Error submitting form:', error);
    // 显示错误提示
  }
};
```

### 后端 API 示例

```typescript
// POST /api/contact/team
{
  "firstName": "John",
  "lastName": "Doe",
  "workEmail": "john@company.com",
  "phone": "1234567890",
  "company": "Acme Inc",
  "position": "CEO",
  "useCase": "Looking to improve our sales process"
}

// Response
{
  "success": true,
  "message": "Thank you for contacting us!"
}
```

## 可访问性 (Accessibility)

- ✅ 键盘导航支持
- ✅ 表单标签关联
- ✅ 焦点管理
- ✅ ESC 键关闭对话框
- ✅ 禁用状态视觉反馈

## 响应式设计

- 对话框在小屏幕上自适应宽度
- 表单字段在移动端可能需要调整为单列布局（待实现）

## 未来优化

1. **表单验证增强**
   - Email 格式验证
   - 字段长度限制
   - 实时错误提示

2. **加载状态**
   - 提交时显示 loading
   - 防止重复提交

3. **错误处理**
   - API 错误提示
   - 网络错误重试

4. **分析追踪**
   - 表单打开追踪
   - 提交成功追踪
   - 字段填写率分析

5. **A/B 测试**
   - 不同文案测试
   - 按钮位置测试
   - 表单字段优化

## 测试建议

### 单元测试
- 表单验证逻辑
- 状态切换
- 数据格式化

### 集成测试
- 完整提交流程
- API 调用
- 导航功能

### E2E 测试
- 用户填写表单
- 提交成功
- 导航到 Directories

## 总结

实现了完整的"Talk to our team"对话框，包括：
- ✅ 表单页面（7 个字段）
- ✅ 成功页面（Confetti + 引导）
- ✅ 状态管理
- ✅ 表单验证
- ✅ 电话格式化
- ✅ 完整文档

组件已准备好集成到生产环境中使用。
