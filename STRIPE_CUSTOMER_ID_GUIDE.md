# 如何获取和管理 Stripe Customer ID

## 概述

`stripeCustomerId` 是连接你的用户和 Stripe 客户的关键标识符。每个用户在 Stripe 中对应一个 Customer 对象。

---

## 完整流程图

```
用户注册
    ↓
创建 Stripe Customer
    ↓
保存 stripeCustomerId 到数据库
    ↓
用户订阅/支付时使用这个 ID
    ↓
管理账单时使用这个 ID
```

---

## 方式 1: 用户注册时创建（推荐）

### 优点
- ✅ 用户一创建就有 Customer ID
- ✅ 后续操作无需再创建
- ✅ 数据一致性好

### 实现

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { email, name, password } = await req.json();
  
  try {
    // 1. 创建你的用户
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: await hashPassword(password),
      },
    });
    
    // 2. 在 Stripe 创建 Customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id, // 关联你的用户 ID
      },
    });
    
    // 3. 更新用户，保存 Stripe Customer ID
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        stripeCustomerId: customer.id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

---

## 方式 2: 首次支付时创建

### 优点
- ✅ 只为付费用户创建
- ✅ 节省 Stripe API 调用

### 实现

```typescript
// app/api/create-checkout-session/route.ts
import { getOrCreateStripeCustomer } from '@/lib/stripe-customer';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  
  // 获取或创建 Stripe Customer ID
  const customerId = await getOrCreateStripeCustomer(user.id);
  
  // 创建 Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId, // 使用 Customer ID
    line_items: [
      {
        price: 'price_xxx',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
```

---

## 方式 3: 从 Webhook 获取

### Checkout 完成后

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(/* ... */);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // 🎯 从 session 获取 Customer ID
      const customerId = session.customer as string;
      const customerEmail = session.customer_email;
      
      // 保存到数据库
      await prisma.user.update({
        where: { email: customerEmail },
        data: { stripeCustomerId: customerId },
      });
      
      break;
    }
    
    case 'customer.created': {
      const customer = event.data.object;
      
      // 🎯 从 customer 对象获取
      const customerId = customer.id;
      const userId = customer.metadata.userId;
      
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      }
      
      break;
    }
  }
  
  return new Response(JSON.stringify({ received: true }));
}
```

---

## 工具函数（推荐使用）

### 创建 `/src/lib/stripe-customer.ts`

```typescript
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * 获取或创建 Stripe Customer ID
 * 如果用户已有，直接返回；如果没有，创建新的
 */
export async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error('User not found');

  // 已有 Customer ID，直接返回
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // 创建新的 Customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user.id },
  });

  // 保存到数据库
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * 从数据库获取 Customer ID
 */
export async function getStripeCustomerId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  return user?.stripeCustomerId || null;
}
```

---

## 使用示例

### 1. 创建 Checkout Session

```typescript
// app/api/create-checkout-session/route.ts
import { getOrCreateStripeCustomer } from '@/lib/stripe-customer';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  
  // 🎯 获取 Customer ID
  const customerId = await getOrCreateStripeCustomer(user.id);
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    // ... 其他配置
  });

  return NextResponse.json({ url: session.url });
}
```

### 2. 创建 Customer Portal Session

```typescript
// app/api/create-customer-portal-session/route.ts
import { getStripeCustomerId } from '@/lib/stripe-customer';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  
  // 🎯 获取 Customer ID
  const customerId = await getStripeCustomerId(user.id);
  
  if (!customerId) {
    return NextResponse.json(
      { error: 'No Stripe customer found' },
      { status: 404 }
    );
  }
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
  });

  return NextResponse.json({ url: session.url });
}
```

### 3. 获取订阅信息

```typescript
// app/api/subscriptions/route.ts
import { getStripeCustomerId } from '@/lib/stripe-customer';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  
  // 🎯 获取 Customer ID
  const customerId = await getStripeCustomerId(user.id);
  
  if (!customerId) {
    return NextResponse.json({ subscriptions: [] });
  }
  
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });

  return NextResponse.json(subscriptions);
}
```

---

## 数据库 Schema

### Prisma Schema

```prisma
// prisma/schema.prisma

model User {
  id               String   @id @default(cuid())
  email            String   @unique
  name             String?
  password         String
  
  // 🎯 Stripe Customer ID
  stripeCustomerId String?  @unique @map("stripe_customer_id")
  
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")
  
  subscriptions    Subscription[]
  invoices         Invoice[]

  @@map("users")
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @map("user_id")
  user                 User     @relation(fields: [userId], references: [id])
  
  stripeSubscriptionId String   @unique @map("stripe_subscription_id")
  stripePriceId        String   @map("stripe_price_id")
  stripeProductId      String   @map("stripe_product_id")
  
  status               String
  currentPeriodStart   DateTime @map("current_period_start")
  currentPeriodEnd     DateTime @map("current_period_end")
  
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  @@map("subscriptions")
}
```

### SQL Migration

```sql
-- 添加 stripe_customer_id 字段
ALTER TABLE users 
ADD COLUMN stripe_customer_id VARCHAR(255) UNIQUE;

-- 创建索引
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
```

---

## 常见问题

### Q1: 什么时候创建 Customer？

**推荐：用户注册时**
- 优点：数据完整，后续操作简单
- 缺点：所有用户都会创建（包括未付费用户）

**备选：首次支付时**
- 优点：只为付费用户创建
- 缺点：需要额外的逻辑处理

### Q2: 如何处理已有用户？

```typescript
// 批量为已有用户创建 Customer
async function migrateExistingUsers() {
  const users = await prisma.user.findMany({
    where: { stripeCustomerId: null },
  });

  for (const user of users) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }
}
```

### Q3: Customer ID 丢失怎么办？

```typescript
// 通过 email 在 Stripe 查找 Customer
async function findCustomerByEmail(email: string) {
  const customers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0].id;
  }

  return null;
}
```

---

## 完整流程示例

### 1. 用户注册

```typescript
POST /api/auth/register
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "xxx"
}

// 后端处理：
// 1. 创建 User
// 2. 创建 Stripe Customer
// 3. 保存 stripeCustomerId
```

### 2. 用户订阅

```typescript
POST /api/create-checkout-session

// 后端处理：
// 1. 获取 user.stripeCustomerId
// 2. 创建 Checkout Session with customer: customerId
// 3. 返回 session.url
```

### 3. 管理账单

```typescript
POST /api/create-customer-portal-session

// 后端处理：
// 1. 获取 user.stripeCustomerId
// 2. 创建 Portal Session with customer: customerId
// 3. 返回 session.url
```

---

## 总结

### 获取 stripeCustomerId 的方法

1. ✅ **从数据库读取** - `user.stripeCustomerId`
2. ✅ **用户注册时创建** - 注册时调用 `stripe.customers.create()`
3. ✅ **首次支付时创建** - Checkout 时创建
4. ✅ **从 Webhook 获取** - `checkout.session.completed` 事件

### 推荐方案

```typescript
// 使用工具函数
import { getOrCreateStripeCustomer } from '@/lib/stripe-customer';

const customerId = await getOrCreateStripeCustomer(user.id);
```

这样可以确保：
- 如果用户已有 Customer ID，直接返回
- 如果没有，自动创建并保存
- 代码简洁，易于维护
