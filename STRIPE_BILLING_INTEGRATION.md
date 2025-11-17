# Stripe 账单系统集成指南

## 概述

Stripe 提供完整的账单系统，可以无缝对接到你的平台。有两种集成方式：

1. **Customer Portal（推荐）** - Stripe 托管的现成界面
2. **自定义 API** - 完全自建界面

---

## 方式 1: Customer Portal（最简单）

### 特点
- ✅ **零前端开发** - Stripe 提供完整 UI
- ✅ **自动更新** - Stripe 维护和更新
- ✅ **安全可靠** - PCI 合规
- ✅ **可定制品牌** - Logo、颜色、功能配置

### 后端实现

```typescript
// app/api/create-customer-portal-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    // 1. 获取当前登录用户
    const user = await getCurrentUser(req); // 你的用户认证逻辑
    
    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'User not found or no Stripe customer' },
        { status: 401 }
      );
    }

    // 2. 创建 Customer Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account/billing`,
    });

    // 3. 返回 Portal URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
```

### 前端实现

```typescript
// components/BillingManagement.tsx
'use client';

import { Button } from '@mui/material';
import { useState } from 'react';

export const BillingManagement = () => {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
      });
      const { url } = await response.json();
      window.location.href = url; // 跳转到 Stripe Portal
    } catch (error) {
      alert('无法打开账单管理页面');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleManageBilling} disabled={loading}>
      {loading ? '加载中...' : '管理账单'}
    </Button>
  );
};
```

### Dashboard 配置

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 进入 **Settings** → **Customer portal**
3. 配置功能：
   - ✅ 发票历史
   - ✅ 更新支付方式
   - ✅ 订阅管理（升级/降级/取消）
   - ✅ 账单信息更新
4. 自定义品牌：
   - 上传 Logo
   - 设置品牌颜色
   - 自定义按钮文本

---

## 方式 2: 自定义 API 集成

### 获取订阅信息

```typescript
// app/api/subscriptions/route.ts
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  
  // 获取用户的所有订阅
  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: 'all',
    expand: ['data.default_payment_method'],
  });

  return NextResponse.json(subscriptions);
}
```

### 获取发票列表

```typescript
// app/api/invoices/route.ts
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  
  const invoices = await stripe.invoices.list({
    customer: user.stripeCustomerId,
    limit: 100,
  });

  return NextResponse.json(invoices);
}
```

### 下载发票 PDF

```typescript
// app/api/invoices/[id]/download/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const invoice = await stripe.invoices.retrieve(params.id);
  
  // Stripe 提供的 PDF URL
  if (invoice.invoice_pdf) {
    return NextResponse.redirect(invoice.invoice_pdf);
  }
  
  return NextResponse.json({ error: 'PDF not available' }, { status: 404 });
}
```

### 更新订阅

```typescript
// app/api/subscriptions/[id]/route.ts
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { priceId } = await req.json();
  
  const subscription = await stripe.subscriptions.retrieve(params.id);
  
  // 更新订阅项目
  const updated = await stripe.subscriptions.update(params.id, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId, // 新的价格 ID
      },
    ],
    proration_behavior: 'create_prorations', // 按比例计费
  });

  return NextResponse.json(updated);
}
```

### 取消订阅

```typescript
// app/api/subscriptions/[id]/cancel/route.ts
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { cancelAtPeriodEnd } = await req.json();
  
  if (cancelAtPeriodEnd) {
    // 在当前计费周期结束时取消
    const subscription = await stripe.subscriptions.update(params.id, {
      cancel_at_period_end: true,
    });
    return NextResponse.json(subscription);
  } else {
    // 立即取消
    const subscription = await stripe.subscriptions.cancel(params.id);
    return NextResponse.json(subscription);
  }
}
```

---

## 完整的用户流程

### 1. 用户订阅流程

```
用户选择计划
    ↓
创建 Checkout Session
    ↓
用户完成支付
    ↓
Webhook: checkout.session.completed
    ↓
保存 Stripe Customer ID 到数据库
    ↓
创建订阅记录
```

### 2. 账单管理流程

```
用户点击"管理账单"
    ↓
创建 Customer Portal Session
    ↓
跳转到 Stripe Portal
    ↓
用户管理订阅/支付方式/查看发票
    ↓
Webhook: customer.subscription.updated
    ↓
更新数据库订阅状态
    ↓
用户点击"返回"
    ↓
返回你的平台
```

---

## Webhook 事件监听

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // 处理不同的事件
  switch (event.type) {
    case 'customer.subscription.created':
      // 订阅创建
      await handleSubscriptionCreated(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      // 订阅更新（升级/降级）
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      // 订阅取消
      await handleSubscriptionDeleted(event.data.object);
      break;
      
    case 'invoice.paid':
      // 发票支付成功
      await handleInvoicePaid(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      // 发票支付失败
      await handleInvoicePaymentFailed(event.data.object);
      break;
      
    case 'customer.updated':
      // 客户信息更新
      await handleCustomerUpdated(event.data.object);
      break;
  }

  return new Response(JSON.stringify({ received: true }));
}
```

---

## 数据库设计

```typescript
// prisma/schema.prisma

model User {
  id              String   @id @default(cuid())
  email           String   @unique
  stripeCustomerId String? @unique // Stripe Customer ID
  subscriptions   Subscription[]
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String
  user                 User     @relation(fields: [userId], references: [id])
  
  stripeSubscriptionId String   @unique
  stripePriceId        String
  stripeProductId      String
  
  status               String   // active, canceled, past_due, etc.
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean  @default(false)
  
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

model Invoice {
  id               String   @id @default(cuid())
  userId           String
  stripeInvoiceId  String   @unique
  
  amount           Int      // 金额（美分）
  currency         String
  status           String   // paid, open, void, uncollectible
  pdfUrl           String?
  hostedUrl        String?
  
  createdAt        DateTime @default(now())
}
```

---

## 推荐方案

### 对于大多数场景：使用 Customer Portal

**优点：**
- 🚀 快速集成（1-2 小时）
- 💰 零维护成本
- 🔒 安全合规
- 📱 移动端友好
- 🎨 可自定义品牌

**适用场景：**
- SaaS 订阅业务
- 需要客户自助管理
- 团队资源有限
- 快速上线

### 对于特殊需求：自定义 API

**适用场景：**
- 需要深度定制 UI
- 复杂的业务逻辑
- 需要在平台内完成所有操作
- 有充足的开发资源

---

## 总结

✅ **Stripe 有完整的账单系统**
✅ **可以完全对接到你的平台**
✅ **推荐使用 Customer Portal（最简单）**
✅ **也可以使用 API 完全自定义**

选择 Customer Portal，你只需要：
1. 创建一个 API 端点生成 Portal Session
2. 前端添加一个按钮跳转
3. 在 Stripe Dashboard 配置功能和品牌

就这么简单！🎉
