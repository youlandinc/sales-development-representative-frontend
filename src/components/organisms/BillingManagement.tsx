'use client';

import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

/**
 * 账单管理组件 - 集成 Stripe Customer Portal
 */
export const BillingManagement = () => {
  const [loading, setLoading] = useState(false);

  // 方式 1: 跳转到 Stripe Customer Portal（推荐）
  const handleOpenCustomerPortal = async () => {
    try {
      setLoading(true);

      // 调用后端 API 创建 Portal Session
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { url } = await response.json();

      // 跳转到 Stripe 托管的客户门户
      window.location.href = url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to open customer portal:', error);
      alert('无法打开账单管理页面，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap={3} sx={{ p: 3 }}>
      <Typography variant="h5">账单管理</Typography>

      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack gap={2}>
          <Typography variant="h6">管理您的订阅和账单</Typography>
          <Typography color="text.secondary" variant="body2">
            点击下方按钮进入账单管理页面，您可以：
          </Typography>
          <Stack component="ul" gap={1} sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2">查看和下载发票</Typography>
            </li>
            <li>
              <Typography variant="body2">更新支付方式</Typography>
            </li>
            <li>
              <Typography variant="body2">升级或降级订阅计划</Typography>
            </li>
            <li>
              <Typography variant="body2">取消订阅</Typography>
            </li>
            <li>
              <Typography variant="body2">更新账单信息</Typography>
            </li>
          </Stack>

          <Button
            disabled={loading}
            onClick={handleOpenCustomerPortal}
            sx={{ mt: 2 }}
            variant="contained"
          >
            {loading ? '加载中...' : '管理账单和订阅'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
