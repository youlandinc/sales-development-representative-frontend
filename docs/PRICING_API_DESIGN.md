# 定价系统 API 设计文档

## API 端点

### GET /sdr/pricing/info

获取所有定价方案信息

**Response:**
```typescript
{
  "Directories": [
    {
      "category": "CAPITAL_MARKETS",
      "categoryName": "Capital Markets",
      "plans": [...]
    },
    {
      "category": "REAL_ESTATE_LENDING", 
      "categoryName": "Real Estate & Lending",
      "plans": [...]
    },
    {
      "category": "BUSINESS_CORPORATE",
      "categoryName": "Business & Corporate", 
      "plans": [...]
    }
  ],
  "Enrichment": [
    {
      "category": "ENRICHMENT_CREDITS",
      "categoryName": "Enrichment credits",
      "plans": [...]
    }
  ]
}
```

## 完整 API Response 示例

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
    },
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
    },
    {
      "category": "BUSINESS_CORPORATE",
      "categoryName": "Business & Corporate",
      "plans": []
    }
  ],
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

## 字段说明

### 顶层结构
- **Key**: 类别名称（"Directories", "Enrichment"）
- **Value**: CategoryConfig 数组

### CategoryConfig
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `category` | string | 行业标识（大写+下划线） | "CAPITAL_MARKETS" |
| `categoryName` | string | 行业显示名称 | "Capital Markets" |
| `plans` | PlanInfo[] | 该行业下的所有方案 | [...] |

### PlanInfo
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `planName` | string | 方案名称 | "Essential" |
| `isDefault` | boolean | 是否为推荐/高亮方案 | true |
| `packages` | string[] | 功能列表 | ["Feature 1", "Feature 2"] |
| `paymentDetail` | PaymentDetail[] | 支付详情（月付/年付） | [...] |

### PaymentDetail
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `type` | string \| null | 计费周期类型 | "MONTH", "YEAR", null |
| `planDateTypeName` | string | 计费周期显示名称 | "per month", "per year (17% off)" |
| `price` | number \| null | 价格（null = Request pricing） | 299, null |
| `priceAdditionalInfo` | string \| null | 额外价格信息 | "100 verified records per month" |
| `credit` | number \| null | 额度/积分 | 100, null |
| `creditType` | string | 额度类型 | "RECORD", "CREDIT", "UNLIMITED" |

## 前端使用示例

### 1. 获取定价数据

```typescript
import { _fetchAllPlan } from '@/request/pricingPlan';

const { data } = useSWR('pricing-plan', async () => {
  const res = await _fetchAllPlan();
  return res;
});
```

### 2. 渲染类别切换

```typescript
Object.keys(data?.data || {}).map((category) => (
  <Button key={category}>{category}</Button>
))
```

### 3. 渲染行业 Tabs

```typescript
data?.data?.[selectedCategory]?.map((item) => (
  <Tab 
    key={item.category}
    label={item.categoryName}
    value={item.category}
  />
))
```

### 4. 渲染方案卡片

```typescript
const currentPlans = data?.data?.[planType]
  ?.find((item) => item.category === category)
  ?.plans || [];

currentPlans.map((plan) => (
  <PricingPlanCard key={plan.planName} plan={plan} />
))
```

### 5. 处理价格显示

```typescript
const firstPayment = plan.paymentDetail[0];

if (firstPayment.price === null) {
  // 显示 "Request pricing"
  return <Text>{firstPayment.priceAdditionalInfo}</Text>;
} else if (firstPayment.price === 0) {
  // 免费方案
  return <Text>Try enrichment for free</Text>;
} else {
  // 显示价格
  return (
    <>
      <Text>${firstPayment.price}</Text>
      <Text>{firstPayment.planDateTypeName}</Text>
    </>
  );
}
```

### 6. 月付/年付切换

```typescript
const [billingCycle, setBillingCycle] = useState<'MONTH' | 'YEAR'>('MONTH');

const selectedPayment = plan.paymentDetail.find(
  (pd) => pd.type === billingCycle
) || plan.paymentDetail[0];
```

## 数据验证规则

### 必填字段
- ✅ `category`: 不能为空
- ✅ `categoryName`: 不能为空
- ✅ `planName`: 不能为空
- ✅ `isDefault`: 必须为 boolean
- ✅ `packages`: 必须为数组（可以为空）
- ✅ `paymentDetail`: 必须为数组且至少有一个元素

### 可选字段
- ⚪ `type`: 可以为 null（表示无限制）
- ⚪ `price`: 可以为 null（表示 Request pricing）
- ⚪ `priceAdditionalInfo`: 可以为 null
- ⚪ `credit`: 可以为 null（表示无限制）

### 业务规则
1. 每个 category 至少有一个 plan
2. 每个 plan 至少有一个 paymentDetail
3. 如果 `price` 为 null，则 `type` 也应为 null
4. 如果 `credit` 为 null，则 `creditType` 应为 "UNLIMITED"
5. 每个 category 最多只能有一个 `isDefault: true` 的 plan

## 错误处理

### 常见错误场景

1. **API 请求失败**
```typescript
try {
  const res = await _fetchAllPlan();
  return res;
} catch (err) {
  const { message, header, variant } = err as HttpError;
  SDRToast({ message, header, variant });
}
```

2. **数据为空**
```typescript
if (!data?.data) {
  return <EmptyState />;
}
```

3. **找不到对应的 category**
```typescript
const categoryData = data?.data?.[planType];
if (!categoryData || categoryData.length === 0) {
  return <EmptyState message="No plans available" />;
}
```

## 性能优化建议

1. **缓存策略**
```typescript
useSWR('pricing-plan', fetchFn, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1分钟内不重复请求
});
```

2. **按需加载**
- 只加载当前选中的 category 数据
- 懒加载方案详情

3. **数据预处理**
- 在 API 层面计算年付折扣
- 预处理功能列表格式

## 总结

该 API 设计：
- ✅ **完全满足** 三个 Figma 设计图的需求
- ✅ **灵活支持** 多种定价模式
- ✅ **易于扩展** 新类别和方案
- ✅ **前端友好** 直接映射到 UI 组件
- ✅ **类型安全** 完整的 TypeScript 类型定义
