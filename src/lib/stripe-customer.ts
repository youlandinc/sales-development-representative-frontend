import Stripe from 'stripe';
import { prisma } from '@/lib/prisma'; // 你的 Prisma 实例

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * 获取或创建用户的 Stripe Customer ID
 * 如果用户已有 Customer ID，直接返回
 * 如果没有，创建新的 Customer 并保存到数据库
 */
export async function getOrCreateStripeCustomer(
  userId: string,
): Promise<string> {
  // 1. 从数据库查询用户
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // 2. 如果已有 Customer ID，直接返回
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // 3. 创建新的 Stripe Customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: {
      userId: user.id,
    },
  });

  // 4. 保存到数据库
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * 从数据库获取用户的 Stripe Customer ID
 * 如果没有，返回 null
 */
export async function getStripeCustomerId(
  userId: string,
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  return user?.stripeCustomerId || null;
}

/**
 * 通过 Stripe Customer ID 查找用户
 */
export async function getUserByStripeCustomerId(
  customerId: string,
): Promise<{ id: string; email: string } | null> {
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
    select: { id: true, email: true },
  });

  return user;
}
