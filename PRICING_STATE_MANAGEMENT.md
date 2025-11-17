# 定价页面状态管理方案

## 核心思路

**后端一次性返回所有数据 → 前端管理状态 → 根据状态过滤显示内容**

---

## 1. 后端返回的数据结构

```typescript
// 后端 API: GET /api/pricing
// 返回所有定价数据
{
  "directories": {
    "capital-markets": {
      "monthly": [ /* PricingCard[] */ ],
      "yearly": [ /* PricingCard[] */ ]
    },
    "real-estate-lending": {
      "monthly": [ /* PricingCard[] */ ],
      "yearly": [ /* PricingCard[] */ ]
    },
    "business-corporate": {
      "monthly": [ /* PricingCard[] */ ],
      "yearly": [ /* PricingCard[] */ ]
    }
  },
  "enrichment": {
    "enrichment-credits": {
      "monthly": [ /* PricingCard[] */ ],
      "yearly": [ /* PricingCard[] */ ]
    }
  }
}
```

---

## 2. 前端状态管理

```typescript
export const PricingPlan = () => {
  // ========== 用户选择状态 ==========
  const [planType, setPlanType] = useState<'directories' | 'enrichment'>('directories');
  const [category, setCategory] = useState<CategoryType>('capital-markets');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  // ========== 数据状态 ==========
  const [allData, setAllData] = useState<BackendPricingData | null>(null);
  const [loading, setLoading] = useState(true);

  // ========== 初始化：获取所有数据（只调用一次）==========
  useEffect(() => {
    const loadData = async () => {
      const data = await fetch('/api/pricing').then(res => res.json());
      setAllData(data);
      setLoading(false);
    };
    loadData();
  }, []); // 空依赖数组 = 只在组件挂载时调用一次

  // ========== 根据状态过滤数据 ==========
  const currentCards = allData?.[planType]?.[category]?.[billingPeriod] || [];

  return (
    <div>
      {/* 用户切换 planType */}
      <ToggleButton onChange={(_, val) => setPlanType(val)}>
        <Button value="directories">Directories</Button>
        <Button value="enrichment">Enrichment</Button>
      </ToggleButton>

      {/* 用户切换 category */}
      <Tabs onChange={(_, val) => setCategory(categories[val])}>
        <Tab>Capital Markets</Tab>
        <Tab>Real Estate & Lending</Tab>
        <Tab>Business & Corporate</Tab>
      </Tabs>

      {/* 用户切换 billingPeriod */}
      <ToggleButton onChange={(_, val) => setBillingPeriod(val)}>
        <Button value="yearly">Pay yearly (17% off)</Button>
        <Button value="monthly">Pay monthly</Button>
      </ToggleButton>

      {/* 显示当前选中的卡片 */}
      {currentCards.map(card => (
        <PricingCard key={card.id} {...card} />
      ))}
    </div>
  );
};
```

---

## 3. 状态切换逻辑

### 3.1 切换 Plan Type

```typescript
const handlePlanTypeChange = (_, newValue: 'directories' | 'enrichment') => {
  setPlanType(newValue);
  
  // 重要：切换 planType 时，重置 category
  if (newValue === 'enrichment') {
    setCategory('enrichment-credits'); // enrichment 只有一个 category
  } else {
    setCategory('capital-markets'); // directories 默认第一个
  }
};
```

### 3.2 切换 Category

```typescript
const handleCategoryChange = (_, tabIndex: number) => {
  const categories = planType === 'directories' 
    ? ['capital-markets', 'real-estate-lending', 'business-corporate']
    : ['enrichment-credits'];
  
  setCategory(categories[tabIndex]);
};
```

### 3.3 切换 Billing Period

```typescript
const handleBillingPeriodChange = (_, newValue: 'monthly' | 'yearly') => {
  setBillingPeriod(newValue);
};
```

---

## 4. 数据过滤

```typescript
// 方法 1: 直接访问（推荐）
const currentCards = allData?.[planType]?.[category]?.[billingPeriod] || [];

// 方法 2: 使用函数（更安全）
const getCurrentCards = (): PricingCard[] => {
  if (!allData) return [];
  
  try {
    return allData[planType][category][billingPeriod];
  } catch (error) {
    console.error('Invalid data path');
    return [];
  }
};
```

---

## 5. 完整流程图

```
用户打开页面
    ↓
调用 API 获取所有数据（只调用一次）
    ↓
存储到 allData 状态
    ↓
用户点击 "Directories" 按钮
    ↓
setPlanType('directories')
    ↓
currentCards = allData['directories']['capital-markets']['yearly']
    ↓
渲染对应的卡片
    ↓
用户点击 "Real Estate & Lending" Tab
    ↓
setCategory('real-estate-lending')
    ↓
currentCards = allData['directories']['real-estate-lending']['yearly']
    ↓
渲染新的卡片
    ↓
用户点击 "Pay monthly"
    ↓
setBillingPeriod('monthly')
    ↓
currentCards = allData['directories']['real-estate-lending']['monthly']
    ↓
渲染新的卡片
```

---

## 6. 关键点总结

### ✅ 优点
1. **只调用一次 API** - 减少网络请求
2. **切换速度快** - 所有数据已在内存中
3. **状态管理简单** - 只需管理 3 个状态变量
4. **用户体验好** - 切换无延迟

### ⚠️ 注意事项
1. **数据量大时** - 考虑首次加载时间
2. **状态联动** - 切换 planType 时要重置 category
3. **错误处理** - 数据路径可能不存在
4. **Loading 状态** - 首次加载时显示 loading

---

## 7. 实际应用到你的 PricingPlan.tsx

```typescript
// 在你现有的 PricingPlan.tsx 中修改

export const PricingPlan = () => {
  // 1. 添加数据状态
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. 获取数据（只调用一次）
  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        setLoading(false);
      });
  }, []);

  // 3. 修改数据获取方式
  // 原来：const currentCards = PRICING_DATA[planType][category].cards;
  // 现在：const currentCards = allData?.[planType]?.[category]?.[billingPeriod] || [];

  // 其他代码保持不变...
};
```

---

## 8. API 接口示例

```typescript
// backend/api/pricing.ts
export async function GET() {
  const pricingData = {
    directories: {
      'capital-markets': {
        monthly: await getPricingCards('directories', 'capital-markets', 'monthly'),
        yearly: await getPricingCards('directories', 'capital-markets', 'yearly'),
      },
      // ... 其他 categories
    },
    enrichment: {
      'enrichment-credits': {
        monthly: await getPricingCards('enrichment', 'enrichment-credits', 'monthly'),
        yearly: await getPricingCards('enrichment', 'enrichment-credits', 'yearly'),
      },
    },
  };

  return Response.json(pricingData);
}
```
