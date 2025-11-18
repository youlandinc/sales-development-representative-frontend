# 定价数据结构分析 - 基于三个 Figma 设计

## 设计图概览

### 设计图 1 (node-id=14516-2168): Capital Markets - Research & Intelligence
- **类别**: Directories
- **行业**: Capital Markets, Real Estate & Lending, Business & Corporate
- **方案**: 2 个方案（Research, Intelligence）
- **特点**: 无价格显示，都是 "Request access" 按钮

### 设计图 2 (node-id=14516-2531): Real Estate & Lending - 三档定价
- **类别**: Directories
- **行业**: Real Estate & Lending
- **方案**: 3 个方案（Essential, Professional, Institutional）
- **特点**: 
  - 有价格显示（$299, $999, Request pricing）
  - 有月付/年付切换
  - 有 "Current plan" 状态
  - Institutional 是高亮方案

### 设计图 3 (node-id=14516-3272): Enrichment Credits - 四档定价
- **类别**: Enrichment
- **行业**: Enrichment credits（单一行业）
- **方案**: 4 个方案（Free, Basic, Plus, Pro）
- **特点**:
  - 有价格显示（Free, $129, $199, $699）
  - 有月付/年付切换
  - Free 是 "Current plan"
  - Pro 是高亮方案

## 数据结构需求分析

### 1. 顶层结构

```typescript
interface PricingResponse {
  [categoryKey: string]: CategoryConfig[];
}

// 示例:
{
  "Directories": [...],
  "Enrichment": [...]
}
```

### 2. 类别配置 (CategoryConfig)

每个类别包含多个行业分类：

```typescript
interface CategoryConfig {
  category: string;           // "CAPITAL_MARKETS", "REAL_ESTATE_LENDING", etc.
  categoryName: string;       // "Capital Markets", "Real Estate & Lending"
  plans: PlanInfo[];         // 该行业下的所有方案
}
```

### 3. 方案信息 (PlanInfo)

```typescript
interface PlanInfo {
  planName: string;                    // "Essential", "Professional", "Research"
  isDefault: boolean;                  // 是否为高亮/推荐方案
  packages: string[];                  // 功能列表
  paymentDetail: PaymentDetail[];      // 支付详情（月付/年付）
}
```

### 4. 支付详情 (PaymentDetail)

```typescript
interface PaymentDetail {
  type: string | null;                 // "MONTH", "YEAR", null (无限制)
  planDateTypeName: string;            // "pay monthly", "pay yearly(17% off)"
  price: number | null;                // 价格，null 表示 "Request pricing"
  priceAdditionalInfo: string | null;  // 额外信息，如 "100 verified records per month"
  credit: number | null;               // 积分/额度
  creditType: string;                  // "RECORD", "CREDIT"
}
```

## 完整数据结构示例

### 示例 1: Directories - Capital Markets (无价格)

```json
{
  "Directories": [
    {
      "category": "CAPITAL_MARKETS",
      "categoryName": "Capital Markets",
      "plans": [
        {
          "planName": "Capital Markets Research",
          "isDefault": false,
          "packages": [
            "Built for emerging teams",
            "Unlimited searches",
            "Firm info: Name, Description, Type, Location, Website, Phone, AUM (when available)",
            "Contact info: Name, Title, Email, Phone",
            "Up to 100 records per search",
            "Ideal for analysts, advisors, and small funds"
          ],
          "paymentDetail": [
            {
              "type": null,
              "planDateTypeName": "Request access",
              "price": null,
              "priceAdditionalInfo": "Built for emerging teams",
              "credit": null,
              "creditType": "UNLIMITED"
            }
          ]
        },
        {
          "planName": "Capital Markets Intelligence",
          "isDefault": true,
          "packages": [
            "For institutional investors",
            "Includes everything in Research, plus:",
            "Access to Mandates, Investment Sectors, Check Sizes, Commitments, Investment History, and High-Net-Worth Individuals",
            "Up to 1,000 records per search",
            "Ideal for LPs, GPs, and institutional investors who need the full picture"
          ],
          "paymentDetail": [
            {
              "type": null,
              "planDateTypeName": "Request access",
              "price": null,
              "priceAdditionalInfo": "For institutional investors",
              "credit": null,
              "creditType": "UNLIMITED"
            }
          ]
        }
      ]
    }
  ]
}
```

### 示例 2: Directories - Real Estate & Lending (有价格 + 月付/年付)

```json
{
  "Directories": [
    {
      "category": "REAL_ESTATE_LENDING",
      "categoryName": "Real Estate & Lending",
      "plans": [
        {
          "planName": "Essential",
          "isDefault": false,
          "packages": [
            "100 verified records per month",
            "Access to core fields: Contact type, Contact location",
            "Up to 100 records per search",
            "Designed for independent brokers, smaller lenders, and analysts evaluating data quality before scaling."
          ],
          "paymentDetail": [
            {
              "type": "MONTH",
              "planDateTypeName": "per month",
              "price": 299,
              "priceAdditionalInfo": "100 verified records per month",
              "credit": 100,
              "creditType": "RECORD"
            },
            {
              "type": "YEAR",
              "planDateTypeName": "per year (17% off)",
              "price": 2980,
              "priceAdditionalInfo": "100 verified records per month",
              "credit": 1200,
              "creditType": "RECORD"
            }
          ]
        },
        {
          "planName": "Professional",
          "isDefault": false,
          "packages": [
            "400 verified records per month",
            "Access to search by project types",
            "Advanced fields, including past projects/lenders, upcoming maturities, and additional contact methods",
            "Up to 400 records per search",
            "Built for active originators and small to mid-size lenders"
          ],
          "paymentDetail": [
            {
              "type": "MONTH",
              "planDateTypeName": "per month",
              "price": 999,
              "priceAdditionalInfo": "400 verified records per month",
              "credit": 400,
              "creditType": "RECORD"
            },
            {
              "type": "YEAR",
              "planDateTypeName": "per year (17% off)",
              "price": 9950,
              "priceAdditionalInfo": "400 verified records per month",
              "credit": 4800,
              "creditType": "RECORD"
            }
          ]
        },
        {
          "planName": "Institutional",
          "isDefault": true,
          "packages": [
            "Unlimited verified records",
            "Full data coverage",
            "Exports and bulk access enabled",
            "Up to 1,000 records per search",
            "For high-volume lenders and large real-estate organizations with complex portfolios"
          ],
          "paymentDetail": [
            {
              "type": null,
              "planDateTypeName": "Request pricing",
              "price": null,
              "priceAdditionalInfo": "Unlimited verified records",
              "credit": null,
              "creditType": "UNLIMITED"
            }
          ]
        }
      ]
    }
  ]
}
```

### 示例 3: Enrichment - Enrichment credits (四档定价)

```json
{
  "Enrichment": [
    {
      "category": "ENRICHMENT_CREDITS",
      "categoryName": "Enrichment credits",
      "plans": [
        {
          "planName": "Free",
          "isDefault": false,
          "packages": [
            "50 credits per month",
            "Access to enrichment functions: Find work email, Find personal LinkedIn URL",
            "Up to 50 records per search"
          ],
          "paymentDetail": [
            {
              "type": "MONTH",
              "planDateTypeName": "free",
              "price": 0,
              "priceAdditionalInfo": "Try enrichment for free",
              "credit": 50,
              "creditType": "CREDIT"
            }
          ]
        },
        {
          "planName": "Basic",
          "isDefault": false,
          "packages": [
            "1,000 credits per month",
            "Access to enrichment functions: Find work email, Find personal LinkedIn URL, Find personal email, Find phone number",
            "Up to 500 records per search"
          ],
          "paymentDetail": [
            {
              "type": "MONTH",
              "planDateTypeName": "per month",
              "price": 129,
              "priceAdditionalInfo": "1,000 credits per month",
              "credit": 1000,
              "creditType": "CREDIT"
            },
            {
              "type": "YEAR",
              "planDateTypeName": "per year (17% off)",
              "price": 1285,
              "priceAdditionalInfo": "1,000 credits per month",
              "credit": 12000,
              "creditType": "CREDIT"
            }
          ]
        },
        {
          "planName": "Plus",
          "isDefault": false,
          "packages": [
            "2,000 verified records per month",
            "Access to enrichment functions: Find work email, Find personal LinkedIn URL, Find personal email, Find phone number",
            "Up to 1,000 records per search",
            "Ability to purchase additional credits up to 3 times per month"
          ],
          "paymentDetail": [
            {
              "type": "MONTH",
              "planDateTypeName": "per month",
              "price": 199,
              "priceAdditionalInfo": "2,000 verified records per month",
              "credit": 2000,
              "creditType": "CREDIT"
            },
            {
              "type": "YEAR",
              "planDateTypeName": "per year (17% off)",
              "price": 1985,
              "priceAdditionalInfo": "2,000 verified records per month",
              "credit": 24000,
              "creditType": "CREDIT"
            }
          ]
        },
        {
          "planName": "Pro",
          "isDefault": true,
          "packages": [
            "10,000 verified records per month",
            "Access to enrichment functions: Find work email, Find personal LinkedIn URL, Find personal email, Find phone number",
            "Up to 5,000 records per search",
            "Ability to purchase unlimited additional credits"
          ],
          "paymentDetail": [
            {
              "type": "MONTH",
              "planDateTypeName": "per month",
              "price": 699,
              "priceAdditionalInfo": "10,000 verified records per month",
              "credit": 10000,
              "creditType": "CREDIT"
            },
            {
              "type": "YEAR",
              "planDateTypeName": "per year (17% off)",
              "price": 6960,
              "priceAdditionalInfo": "10,000 verified records per month",
              "credit": 120000,
              "creditType": "CREDIT"
            }
          ]
        }
      ]
    }
  ]
}
```

## 数据结构设计优势

### 1. **灵活性**
- ✅ 支持有价格和无价格方案（price: null）
- ✅ 支持月付/年付切换（paymentDetail 数组）
- ✅ 支持不同类型的额度（RECORD, CREDIT, UNLIMITED）
- ✅ 支持高亮/推荐方案（isDefault）

### 2. **可扩展性**
- ✅ 易于添加新类别（Directories, Enrichment, ...）
- ✅ 易于添加新行业（Capital Markets, Real Estate, ...）
- ✅ 易于添加新方案（Essential, Professional, ...）
- ✅ 易于添加新支付周期（月付、年付、季付...）

### 3. **简洁性**
- ✅ 扁平化结构，避免过度嵌套
- ✅ 字段命名清晰，易于理解
- ✅ 复用 paymentDetail 处理多种计费场景

### 4. **前端渲染友好**
- ✅ `packages` 数组直接映射到功能列表
- ✅ `isDefault` 直接控制高亮样式
- ✅ `price === null` 直接判断是否显示 "Request pricing"
- ✅ `paymentDetail` 数组支持月付/年付切换

## UI 渲染逻辑

### 1. 类别切换 (Directories / Enrichment)
```typescript
Object.keys(data) // ["Directories", "Enrichment"]
```

### 2. 行业 Tab 切换
```typescript
data[category].map(item => ({
  label: item.categoryName,
  value: item.category
}))
```

### 3. 方案卡片渲染
```typescript
const currentPlans = data[category]
  .find(item => item.category === selectedCategory)
  ?.plans || [];

currentPlans.map(plan => (
  <PricingCard plan={plan} />
))
```

### 4. 价格显示逻辑
```typescript
const firstPayment = plan.paymentDetail[0];

if (firstPayment.price === null) {
  // 显示 "Request pricing" 或 priceAdditionalInfo
  return <Text>{firstPayment.priceAdditionalInfo}</Text>;
} else {
  // 显示价格
  return <Text>${firstPayment.price} {firstPayment.planDateTypeName}</Text>;
}
```

### 5. 按钮文本逻辑
```typescript
const getButtonText = (plan: PlanInfo) => {
  if (plan.isCurrentPlan) return "Current plan";
  if (plan.paymentDetail[0].price === null) return "Request access";
  return "Choose plan";
};
```

### 6. 月付/年付切换
```typescript
const selectedPayment = plan.paymentDetail.find(
  pd => pd.type === billingCycle
) || plan.paymentDetail[0];
```

## 与现有代码的对比

### 现有类型定义 (src/types/pricingPlan.ts)
```typescript
// ✅ 已有的类型定义与设计图需求完全匹配
interface PlanInfo {
  packages: string[];
  paymentDetail: PlanPaymentDetail[];
  planName: string;
  isDefault: boolean;
}
```

### 建议的优化

1. **添加用户当前方案标识**
```typescript
interface PlanInfo {
  packages: string[];
  paymentDetail: PlanPaymentDetail[];
  planName: string;
  isDefault: boolean;
  isCurrentPlan?: boolean;  // 新增：标识用户当前使用的方案
}
```

2. **添加按钮配置**
```typescript
interface PlanInfo {
  packages: string[];
  paymentDetail: PlanPaymentDetail[];
  planName: string;
  isDefault: boolean;
  isCurrentPlan?: boolean;
  buttonConfig?: {
    text: string;
    action: "subscribe" | "request_access" | "current_plan" | "talk_to_team";
    disabled?: boolean;
  };
}
```

## 总结

当前的数据结构设计 **完全满足** 三个 Figma 设计图的需求：

✅ **支持多类别**: Directories, Enrichment
✅ **支持多行业**: Capital Markets, Real Estate, Business, Enrichment credits
✅ **支持多方案**: Research, Intelligence, Essential, Professional, Institutional, Free, Basic, Plus, Pro
✅ **支持灵活定价**: 有价格、无价格、月付、年付
✅ **支持高亮方案**: isDefault 字段
✅ **支持功能列表**: packages 数组
✅ **支持额度管理**: credit, creditType 字段

数据结构简洁、灵活、易于扩展，前端渲染逻辑清晰明了。
