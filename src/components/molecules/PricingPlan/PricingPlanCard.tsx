import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import { FC, useMemo } from 'react';

import { SDRToast, StyledButton } from '@/components/atoms';
import { TalkToTeamDialog } from './TalkToTeamDialog';

import { useAsyncFn, useSwitch } from '@/hooks';
import { PlanTypeEnum } from '@/types';
import { DirectoriesBizIdEnum } from '@/types/Directories';
import { PaymentType, PlanInfo } from '@/types/pricingPlan';

import { _createPaymentLink } from '@/request/pricingPlan';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { StyledCapitalDesc } from './base';
import { packageTitle, PERIOD_INFO, PRICE_INFO } from './data';
import { CANCEL_URL, SUCCESS_URL } from './data';

import ICON_NORMAL from './assets/icon_normal.svg';
import ICON_PRO from './assets/icon_pro.svg';

interface PricingCardProps {
  plan: PlanInfo;
  paymentType?: PaymentType | string;
  category: string;
}

export const PricingPlanCard: FC<PricingCardProps> = ({
  plan,
  paymentType,
  category,
}) => {
  const router = useRouter();
  const { visible, toggle } = useSwitch();

  //type 为null时，无限制，高亮。
  const isHighlighted = plan.isDefault;

  // 确定按钮文本
  const buttonText = useMemo(() => {
    if (category === DirectoriesBizIdEnum.capital_markets) {
      return 'Request access';
    }
    if (plan.monthlyPrice && plan.yearlyPrice) {
      return 'Choose plan';
    }
    if (plan.isDefault) {
      return 'Talk to our team';
    }
    if (plan.planType === PlanTypeEnum.free) {
      return 'Current plan';
    }
    return 'Request access';
  }, [
    plan.monthlyPrice,
    plan.yearlyPrice,
    category,
    plan.isDefault,
    plan.planType,
  ]);

  // 确定按钮样式;
  const buttonVariant = isHighlighted ? 'contained' : 'outlined';

  const [state, createPaymentLink] = useAsyncFn(async () => {
    try {
      const { data } = await _createPaymentLink({
        successUrl: SUCCESS_URL,
        cancelUrl: CANCEL_URL,
        planType: plan.planType,
        pricingType: paymentType as PaymentType,
      });
      // 这里可以处理重定向逻辑
      if (data) {
        // window.location.href = data.url;
        router.push(data);
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [paymentType, plan.planType]);

  const handleClick = () => {
    if (!plan.monthlyPrice && !plan.yearlyPrice) {
      toggle();
      return;
    }
    createPaymentLink();
  };

  const priceDesc = useMemo(() => {
    if (category === DirectoriesBizIdEnum.capital_markets) {
      return null;
    }
    if (plan.planType === PlanTypeEnum.free && plan.creditType && plan.credit) {
      return (
        <Typography>
          {paymentType === PaymentType.YEARLY ? plan.credit * 12 : plan.credit}{' '}
          {PRICE_INFO[plan.creditType as string] || ''}{' '}
          {paymentType === PaymentType.YEARLY ? 'per year' : 'per month'}
        </Typography>
      );
    }
    if (
      [PlanTypeEnum.institutional, PlanTypeEnum.enterprise].includes(
        plan.planType,
      )
    ) {
      return <Typography>Unlimited verified records</Typography>;
    }

    if (plan.creditType) {
      return (
        <Typography>
          {paymentType === PaymentType.YEARLY && plan.credit
            ? (plan.credit * 12).toLocaleString()
            : plan.credit?.toLocaleString()}{' '}
          {PRICE_INFO[plan.creditType as string] || ''}{' '}
          {PERIOD_INFO[paymentType as PaymentType] || ''}
        </Typography>
      );
    }
    return null;
  }, [category, plan.planType, plan.creditType, plan.credit, paymentType]);

  return (
    <Stack
      sx={{
        width: 384,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative dot pattern overlay */}
      <Icon
        component={plan.isDefault ? ICON_PRO : ICON_NORMAL}
        sx={{ position: 'absolute', top: 0, right: 0, width: 258, height: 310 }}
      />
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
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* <StyledEmailReceived /> */}
          {category === DirectoriesBizIdEnum.capital_markets ? (
            <StyledCapitalDesc
              planType={plan.planType}
              priceAdditionalInfo={plan.priceAdditionalInfo || ''}
            />
          ) : (
            <Stack
              gap={1}
              sx={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                minHeight: 36,
              }}
            >
              {paymentType === 'MONTH' && plan.monthlyPrice && (
                <Typography
                  sx={{
                    fontSize: 36,
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  ${plan.monthlyPrice.toLocaleString()}
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
                  ${plan.yearlyPrice.toLocaleString()}
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
          )}

          {/* Button */}
          <StyledButton
            disabled={plan.planType === PlanTypeEnum.free}
            fullWidth
            loading={state.loading}
            onClick={handleClick}
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

          {priceDesc}

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
            {packageTitle[plan.planType] && (
              <Typography
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.71,
                  fontSize: 14,
                }}
                variant="body2"
              >
                {packageTitle[plan.planType]}
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
        }}
        open={visible}
      />
    </Stack>
  );
};
