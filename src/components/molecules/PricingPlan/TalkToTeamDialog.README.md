# TalkToTeamDialog Component

联系我们团队的对话框组件，包含表单和提交成功状态。

## 功能特性

- ✅ **表单验证**: 必填字段验证
- ✅ **成功状态**: 提交后显示成功页面
- ✅ **电话格式化**: 自动格式化电话号码
- ✅ **响应式布局**: 两列表单布局

## 使用方法

```tsx
import { TalkToTeamDialog } from '@/components/molecules';
import { useSwitch } from '@/hooks';

function MyComponent() {
  const { visible, toggle } = useSwitch();

  const handleSubmit = (data: TalkToTeamFormData) => {
    // 发送数据到后端
    console.log('Form data:', data);
    // API call here
  };

  const handleGoToDirectories = () => {
    // 导航到 Directories 页面
    router.push('/directories');
  };

  return (
    <>
      <button onClick={toggle}>Contact Us</button>
      
      <TalkToTeamDialog
        open={visible}
        onClose={toggle}
        onSubmit={handleSubmit}
        onGoToDirectories={handleGoToDirectories}
      />
    </>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | 控制对话框显示/隐藏 |
| `onClose` | `() => void` | Yes | 关闭对话框的回调 |
| `onSubmit` | `(data: TalkToTeamFormData) => void` | No | 表单提交回调 |
| `onGoToDirectories` | `() => void` | No | "Go to Directories" 按钮点击回调 |

## 表单数据结构

```typescript
interface TalkToTeamFormData {
  firstName: string;
  lastName: string;
  workEmail: string;
  phone?: string;        // 可选
  company: string;
  position: string;
  useCase: string;
}
```

## 状态流程

1. **初始状态**: 显示表单
2. **填写表单**: 用户输入信息
3. **提交**: 点击 Submit 按钮
4. **成功状态**: 显示成功页面（带 confetti 图标）
5. **关闭/导航**: 点击关闭或 "Go to Directories"

## 表单字段

### 必填字段
- First name
- Last name
- Work email
- Company
- Position
- What are you looking to do? (use case)

### 可选字段
- Phone (optional)

## 成功页面设计

提交成功后显示：
- 🎉 Confetti 图标
- "Thank you! We'll reach out soon."
- "In the meantime, you can start prospecting with Corepass"
- "Go to Directories" 按钮

## 样式特点

- **对话框宽度**: 800px
- **输入框高度**: 48px
- **按钮宽度**: 336px
- **圆角**: 8px (输入框), 16px (对话框)
- **颜色**: 
  - 主色: #363440
  - 次要文本: #6F6C7D
  - 占位符: #B0ADBD

## 集成示例

### 与路由集成

```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

<TalkToTeamDialog
  open={visible}
  onClose={toggle}
  onGoToDirectories={() => {
    router.push('/directories');
  }}
/>
```

### 与 API 集成

```tsx
const handleSubmit = async (data: TalkToTeamFormData) => {
  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // 成功后会自动显示成功页面
  } catch (error) {
    console.error('Error:', error);
    // 处理错误
  }
};
```

## 注意事项

1. 提交按钮在所有必填字段填写完成前保持禁用状态
2. 电话号码自动格式化为 (XXX) XXX-XXXX 格式
3. 关闭对话框会重置表单和成功状态
4. Terms of Use 和 Privacy Policy 链接需要更新为实际 URL
