'use client';

import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useMemo, useState } from 'react';
import useSWR from 'swr';

import { SDRToast, StyledButtonGroup } from '@/components/atoms';
import { PricingPlanCard } from '@/components/molecules';

import { _fetchAllPlan } from '@/request/pricingPlan';
import { mockData } from '@/data/mockPricingData';

export const PricingPlan = () => {
  const [planType, setPlanType] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('MONTH');

  const { data } = useSWR(
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

        return { ...res, data: mockData };
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    { revalidateOnFocus: false },
  );

  const handlePlanTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
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
      data?.data?.[planType as keyof typeof mockData]?.find(
        (item) => item.category === category,
      )?.paymentDetail || [];
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
        <Box
          sx={{
            borderRadius: 2,
            p: 0.25,
            display: 'inline-flex',
            width: 'auto',
          }}
        >
          <StyledButtonGroup
            onChange={handlePlanTypeChange}
            options={Object.keys(data?.data || {}).map((item) => ({
              label: item,
              value: item,
            }))}
            sx={{
              bgcolor: 'transparent',
              '& .MuiToggleButton-root': {
                width: 144,
                height: 40,
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                border: 'none',
                bgcolor: 'transparent',
                color: '#363440',
                px: 1,
                py: 1,
                '&.Mui-selected': {
                  bgcolor: '#363440',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#363440',
                  },
                },
                '&:hover': {
                  bgcolor: 'transparent',
                },
              },
              '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                marginLeft: 0,
                borderLeft: 'none',
              },
              '& .MuiToggleButtonGroup-grouped.Mui-selected': {
                borderRadius: 2,
              },
            }}
            value={planType}
          />
        </Box>
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
              // '& .MuiTabs-indicator': {
              //   display: 'none',
              // },
              // '& .MuiTabs-flexContainer': {
              //   gap: 0,
              //   '& .MuiButtonBase-root': {
              //     position: 'relative',
              //     '&.Mui-selected::after': {
              //       content: '""',
              //       position: 'absolute',
              //       bottom: 0,
              //       left: 0,
              //       right: 0,
              //       height: '2px',
              //       bgcolor: '#363440',
              //     },
              //   },
              // },
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
                  onClick={() => setPaymentType(item.type)}
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
