import { Box, Stack, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';
import { TalkToTeamDialog } from './TalkToTeamDialog';

import { useSwitch } from '@/hooks';
import { PlanInfo } from '@/types/pricingPlan';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMemo } from 'react';

interface PricingCardComponentProps {
  plan: PlanInfo; // 改为接受 mockData 结构
  paymentType?: 'MONTH' | 'YEAR';
}

export const PricingPlanCard = ({
  plan,
  paymentType,
}: PricingCardComponentProps) => {
  const { visible, toggle } = useSwitch();

  //type 为null时，无限制，高亮。
  const isHighlighted = plan.isDefault;

  // 确定按钮文本
  const buttonText = useMemo(() => {
    if (paymentType) {
      return 'Choose plan';
    }
    return 'Request access';
  }, [paymentType]);

  // 确定按钮样式;
  const buttonVariant = isHighlighted ? 'contained' : 'outlined';

  return (
    <Stack
      sx={{
        width: 384,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          bgcolor: isHighlighted ? '#363440' : '#EAE9EF',
          p: 3,
          borderRadius: '24px 24px 0 0',
        }}
      >
        <Typography
          sx={{
            color: isHighlighted ? 'white' : 'text.primary',
            lineHeight: 1.2,
          }}
          variant="h4"
        >
          {plan.planName}
        </Typography>
      </Box>

      {/* Card Body */}
      <Box
        sx={{
          bgcolor: isHighlighted ? '#363440' : '#EAE9EF',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <Stack
          sx={{
            bgcolor: 'background.default',
            border: `1px solid ${isHighlighted ? '#363440' : '#DFDEE6'}`,
            borderRadius: 6,
            p: 3,
            gap: 3,
            minHeight: 496,
          }}
        >
          {/* Subtitle - 从 paymentDetail[0].priceAdditionalInfo 获取 */}
          <Stack
            gap={1}
            sx={{ flexDirection: 'row', alignItems: 'flex-end', minHeight: 36 }}
          >
            {paymentType === 'MONTH' && plan.monthlyPrice && (
              <Typography
                sx={{
                  fontSize: 36,
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                ${plan.monthlyPrice}
              </Typography>
            )}
            {paymentType === 'YEAR' && plan.yearlyPrice && (
              <Typography
                sx={{
                  fontSize: 36,
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                ${plan.yearlyPrice}
              </Typography>
            )}

            {plan.monthlyPrice || plan.yearlyPrice ? (
              <Typography fontSize={15} lineHeight={1.5}>
                per month
              </Typography>
            ) : null}
            {plan.priceAdditionalInfo && (
              <Typography
                sx={{
                  fontSize: 24,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'text.secondary',
                  ml: 1,
                }}
              >
                {plan.priceAdditionalInfo}
              </Typography>
            )}
          </Stack>

          {/* Button */}
          <StyledButton
            fullWidth
            onClick={toggle}
            size="medium"
            sx={{
              bgcolor:
                buttonVariant === 'contained' ? '#363440' : 'transparent',
              color: buttonVariant === 'contained' ? 'white' : 'text.primary',
              borderColor:
                buttonVariant === 'outlined' ? '#DFDEE6' : 'transparent',
              '&:hover': {
                bgcolor:
                  buttonVariant === 'contained' ? '#363440' : 'transparent',
              },
            }}
            variant={buttonVariant}
          >
            {buttonText}
          </StyledButton>

          {plan.priceDesc && <Typography>{plan.priceDesc}</Typography>}

          {/* Divider */}
          <Box
            sx={{
              height: '1px',
              bgcolor: '#DFDEE6',
              width: '100%',
            }}
          />

          {/* Features List - 从 packages 数组获取 */}
          <Stack gap={1.5}>
            {plan.packageTitle && (
              <Typography
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.71,
                  fontSize: 14,
                }}
                variant="body2"
              >
                {plan.packageTitle}
              </Typography>
            )}
            {plan.packages.map((pkg, idx) => (
              <Stack alignItems="flex-start" direction="row" gap={1} key={idx}>
                <CheckCircleIcon
                  sx={{
                    width: 24,
                    height: 24,
                    color: '#363440',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                />
                <Typography
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.71,
                    fontSize: 14,
                  }}
                  variant="body2"
                >
                  {pkg}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>
      <TalkToTeamDialog
        onClose={toggle}
        onGoToDirectories={() => {
          // Navigate to directories page
          // You can implement navigation logic here
          console.log('Navigate to directories');
        }}
        open={visible}
      />
    </Stack>
  );
};
