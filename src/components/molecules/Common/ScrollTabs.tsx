import React, { useEffect, useState } from 'react';
import { Box, Stack, Tabs, tabsClasses } from '@mui/material';
import { CommonReceiptCardHeader } from '@/components/molecules';
import { StyledButton } from '@/components/atoms';
import { useClassNameObserver } from '@/hooks/useClassNameObserver';

export const ScrollTabs = () => {
  const [btns, setBtns] = useState<HTMLElement[] | null>(null);

  const [preDisabled, setPreDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    const elements = document.getElementsByClassName(
      'custom-scroll-btn',
    ) as unknown as HTMLElement[];
    setBtns(elements);
  }, []);

  useClassNameObserver(btns?.[0], (className) => {
    setPreDisabled(className.includes('Mui-disabled'));
  });
  useClassNameObserver(btns?.[1], (className) => {
    setNextDisabled(className.includes('Mui-disabled'));
  });

  return (
    <Stack>
      <Box>
        <Tabs
          aria-label="visible arrows tabs example"
          scrollButtons
          slotProps={{
            startScrollButtonIcon: {
              sx: { display: 'none' },
            },
            endScrollButtonIcon: {
              sx: { display: 'none' },
            },
          }}
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
            minHeight: 'auto',
          }}
          TabIndicatorProps={{
            sx: {
              display: 'none',
            },
          }}
          TabScrollButtonProps={{
            className: 'custom-scroll-btn',
            sx: {
              width: 0,
            },
          }}
          value={0}
          variant="scrollable"
        >
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
          <CommonReceiptCardHeader
            avatarName={'R'}
            email={'Johnny Appleseed'}
            sx={{ width: 200, flexShrink: 0 }}
          />
        </Tabs>
      </Box>
      <StyledButton
        color={'info'}
        disabled={preDisabled}
        onClick={() => {
          btns?.[0]?.click();
        }}
        size={'medium'}
        sx={{
          px: '12px !important',
          py: '6px !important',
          fontSize: '12px !important',
          lineHeight: 1,
          height: 'auto !important',
        }}
        variant={'outlined'}
      >
        pre
      </StyledButton>
      <StyledButton
        color={'info'}
        disabled={nextDisabled}
        onClick={() => {
          btns?.[1]?.click();
        }}
        size={'medium'}
        sx={{
          px: '12px !important',
          py: '6px !important',
          fontSize: '12px !important',
          lineHeight: 1,
          height: 'auto !important',
        }}
        variant={'outlined'}
      >
        next
      </StyledButton>
    </Stack>
  );
};

export default ScrollTabs;
