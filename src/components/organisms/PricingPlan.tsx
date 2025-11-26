import { Box, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useMemo, useState } from 'react';
import useSWR from 'swr';

import { SDRToast } from '@/components/atoms';
import { PricingPlanCard } from '@/components/molecules';

import { _fetchAllPlan } from '@/request/pricingPlan';

export const PricingPlan = () => {
  const [planType, setPlanType] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('MONTH');

  const { data, isLoading } = useSWR(
    'pricing-plan',
    async () => {
      try {
        const res = await _fetchAllPlan();
        if (res.data) {
          // 调试：查看后端返回的键顺序
          const defaultKey = Object.keys(res.data)[0];
          const defaultCategory = res.data[defaultKey][0].category;
          setPlanType(Object.keys(res.data)[0]);
          setCategory(defaultCategory);
        }

        return res;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    { revalidateOnFocus: false },
  );

  const handlePlanTypeChange = (newValue: string) => {
    setPlanType(newValue);
    setCategory(data?.data?.[newValue]?.[0]?.category || '');
  };

  const handleCategoryChange = (_: SyntheticEvent, newValue: string) => {
    setCategory(newValue);
  };

  // 直接获取和过滤 mockData，不转换
  const getCurrentPlans = () => {
    return (
      data?.data?.[planType]?.find((item) => item.category === category)
        ?.plans || []
    );
  };

  const currentPlans = getCurrentPlans();

  const getPaymentType = useMemo(() => {
    const paymentDetail =
      data?.data?.[planType]?.find((item) => item.category === category)
        ?.pricingOptions || [];
    if (paymentDetail && paymentDetail.length > 0) {
      setPaymentType('MONTH');
    } else {
      setPaymentType('');
    }
    return paymentDetail;
  }, [category, planType, data]);

  return (
    <Stack
      sx={{
        bgcolor: 'background.default',
        gap: 3,
        width: '100%',
        pb: 3,
      }}
    >
      {/* Header Section */}
      <Stack gap={3} sx={{ alignItems: 'center' }} width="100%">
        <Typography color="text.primary" variant="h4">
          Choose your plan
        </Typography>

        {/* Plan Type Toggle */}
        <Stack
          direction="row"
          gap={1.25}
          sx={{
            bgcolor: '#F8F8FA',
            borderRadius: 2,
            p: 0.5,
            boxShadow: '0px 1px 1px 0px rgba(46, 46, 46, 0.25)',
          }}
        >
          {(isLoading
            ? Array.from(new Array(2))
            : Object.keys(data?.data || {})
          ).map((item, index) => (
            <Box
              key={item || index}
              onClick={() => handlePlanTypeChange(item)}
              sx={{
                width: 128,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                bgcolor: planType === item ? '#363440' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor:
                    planType === item ? '#363440' : 'rgba(54, 52, 64, 0.05)',
                },
              }}
            >
              {item ? (
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    textAlign: 'center',
                    color: planType === item ? 'white' : '#6F6C7D',
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </Typography>
              ) : (
                <Skeleton />
              )}
            </Box>
          ))}
        </Stack>
      </Stack>
      <Stack sx={{ gap: 3, width: 'fit-content', mx: 'auto', minWidth: 1200 }}>
        {/* Category Tabs */}
        <Stack
          sx={{
            borderBottom: '1px solid #EFE9FB',
            width: '100%',
            mx: 'auto',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Tabs
            onChange={handleCategoryChange}
            sx={{
              minHeight: 32,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: 14,
                fontWeight: 400,
                color: 'text.secondary',
                minHeight: 'auto',
                height: 'auto',
                px: 1.5,
                py: 1.5,
                lineHeight: 1.2,
                '&.Mui-selected': {
                  color: '#363440',
                  fontWeight: 600,
                },
              },
            }}
            value={category}
          >
            {(data?.data?.[planType] || []).map((cat) => (
              <Tab
                key={cat.category}
                label={cat.categoryName}
                value={cat.category}
              />
            ))}
          </Tabs>
          {getPaymentType.length > 0 && (
            <Stack
              sx={{
                flexDirection: 'row',
                gap: 1.25,
                height: 'fit-content',
                border: '1px solid #EFE9FB',
                p: '2px',
                borderRadius: '50px',
              }}
            >
              {getPaymentType.map((item) => (
                <Typography
                  key={item.type}
                  onClick={() => setPaymentType(item.type as string)}
                  sx={{
                    fontWeight: 600,
                    color:
                      item.type === paymentType ? '#FFFFFF' : 'text.secondary',
                    bgcolor:
                      item.type === paymentType ? '#363440' : 'transparent',
                    borderRadius: '20px',
                    p: 1,
                    lineHeight: 1,
                    cursor: 'pointer',
                  }}
                  variant={'body3'}
                >
                  {item.planDateTypeName}
                </Typography>
              ))}
            </Stack>
          )}
        </Stack>

        {currentPlans.length > 0 && (
          <Stack
            direction="row"
            gap={3}
            sx={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              mx: 'auto',
              flexWrap: 'wrap',
            }}
          >
            {currentPlans.map((plan, index) => (
              <PricingPlanCard
                category={category}
                key={index}
                paymentType={paymentType}
                plan={plan}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
