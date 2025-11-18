# Pricing Data Structure - Implementation Summary

## 概述 (Overview)

基于两个 Figma 设计图，我设计了一个灵活、高效的定价数据结构，支持从后端获取数据并简单高效地渲染。

## 核心文件 (Core Files)

### 1. 类型定义 (Type Definitions)
**文件**: `src/types/pricing.ts`

定义了完整的 TypeScript 类型系统：
- `PricingData` - 根数据结构
- `PricingCategory` - 类别（Directories/Enrichment）
- `IndustryPlans` - 行业分类（Capital Markets/Real Estate/Business）
- `PricingPlan` - 单个定价方案
- `PricingFeature` - 功能特性
- `PricingInfo` - 价格信息
- `PlanButton` - 按钮配置

### 2. 模拟数据 (Mock Data)
**文件**: `src/data/mockPricingData.ts`

提供了完整的示例数据，匹配两个 Figma 设计：
- Capital Markets (Research, Intelligence)
- Real Estate & Lending (Essential, Professional, Institutional)

### 3. 工具函数 (Utility Functions)
**文件**: `src/utils/pricingUtils.ts`

提供数据查询和处理函数：
- `getCategory()` - 获取类别
- `getIndustry()` - 获取行业
- `getPlans()` - 获取方案列表
- `formatPrice()` - 格式化价格
- `getButtonStyle()` - 获取按钮样式
- `getCardStyle()` - 获取卡片样式

### 4. React Hook
**文件**: `src/hooks/usePricingData.ts`

自定义 Hook，管理状态和数据获取：
- 自动加载数据
- 管理 category/industry/billingCycle 状态
- 提供过滤后的 plans 列表
- 处理 loading 和 error 状态

### 5. 示例组件 (Example Component)
**文件**: `src/components/organisms/PricingPlansExample.tsx`

完整的实现示例，展示如何使用数据结构渲染 UI。

## 数据结构设计亮点 (Design Highlights)

### 1. 三层层级结构
```
Category (Directories/Enrichment)
  └── Industry (Capital Markets/Real Estate/Business)
      └── Plans (Essential/Professional/Institutional)
```

### 2. 灵活的价格配置
```typescript
pricing: {
  amount?: number,        // undefined = "Request pricing"
  currency: string,       // "USD"
  billingCycle: string,   // "monthly" | "yearly"
  displayText?: string    // 自定义显示文本
}
```

### 3. 动态按钮配置
```typescript
button: {
  action: "request_access" | "choose_plan" | "current_plan" | "talk_to_team",
  text: string,
  variant: "primary" | "secondary" | "disabled"
}
```

### 4. 特性列表
```typescript
features: [
  {
    id: string,
    text: string,
    icon?: string,
    highlighted?: boolean  // 加粗显示
  }
]
```

## 使用示例 (Usage Example)

```typescript
import { usePricingData } from '@/hooks/usePricingData';
import { fetchPricingData } from '@/data/mockPricingData';

const MyComponent = () => {
  const {
    currentPlans,      // 当前选中的方案列表
    category,          // 当前类别
    industry,          // 当前行业
    setCategory,       // 切换类别
    setIndustry,       // 切换行业
    loading,           // 加载状态
  } = usePricingData(fetchPricingData);

  return (
    <div>
      {currentPlans.map(plan => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
};
```

## 后端 API 设计 (Backend API Design)

### GET /api/pricing
返回完整的定价数据结构

### GET /api/user/subscription
返回用户当前订阅信息

详细的 API 规范请参考 `PRICING_DATA_STRUCTURE.md`

## 渲染策略 (Rendering Strategy)

### 高效渲染原则：
1. **单一数据源** - 所有数据来自后端 API
2. **组件复用** - 单个 `PricingCard` 组件渲染所有方案
3. **数据驱动样式** - 根据 `isHighlighted` 等属性动态应用样式
4. **Memoization** - 使用 `useMemo` 缓存计算结果
5. **条件渲染** - 根据数据灵活显示/隐藏元素

### 组件结构：
```
PricingPlansPage
├── CategoryToggle (Directories/Enrichment)
├── IndustryTabs (Capital Markets, Real Estate, etc.)
├── BillingCycleToggle (Monthly/Yearly)
└── PricingCardsGrid
    └── PricingCard × N (数据驱动渲染)
```

## 优势 (Advantages)

1. ✅ **类型安全** - 完整的 TypeScript 支持
2. ✅ **可扩展** - 易于添加新类别、行业、方案
3. ✅ **高效** - 优化的查询和渲染
4. ✅ **灵活** - 支持多种定价模式
5. ✅ **可维护** - 清晰的结构和文档
6. ✅ **后端就绪** - 为 API 集成设计

## 下一步 (Next Steps)

1. 将 mock 数据替换为真实 API 调用
2. 添加用户订阅状态集成
3. 实现方案升级/降级流程
4. 添加方案对比功能
5. 支持多货币和本地化

## 文档 (Documentation)

完整文档请查看：
- `docs/PRICING_DATA_STRUCTURE.md` - 详细的数据结构文档
- `src/types/pricing.ts` - TypeScript 类型定义
- `src/components/organisms/PricingPlansExample.tsx` - 实现示例
