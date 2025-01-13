'use client';
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  forwardRef,
  use,
  useEffect,
  useState,
} from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { createUseStyles } from 'react-jss';

// Default theme variables
const theme = {
  '--input': '#e2e8f0', // slate-200
  '--ring': '#94a3b8', // slate-400
  '--background': '#ffffff', // white
  '--foreground': '#0f172a', // slate-900
};

const useStyles = createUseStyles({
  '@global': {
    ':root': theme,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:has(:disabled)': {
      opacity: 0.5,
    },
  },
  input: {
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
  group: {
    display: 'flex',
    alignItems: 'center',
  },
  slot: {
    position: 'relative',
    display: 'flex',
    height: '48px',
    width: '48px',
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: '1px solid var(--input)',
    borderBottom: '1px solid var(--input)',
    borderRight: '1px solid var(--input)',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.2s',
    backgroundColor: 'var(--background)',
    color: '#202939',
    '&:first-child': {
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
      borderLeft: '1px solid var(--input)',
    },
    '&:last-child': {
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
    },
  },
  activeSlot: {
    zIndex: 10,
    boxShadow: '0 0 0 1px var(--ring), 0 0 0 1px var(--background)',
  },
  caret: {
    pointerEvents: 'none',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    inset: 0,
  },
  caretBlink: {
    height: '1rem',
    width: '1px',
    backgroundColor: 'var(--foreground)',
    animation: '$caretBlink 1s step-end infinite',
  },
  '@keyframes caretBlink': {
    'from, to': {
      opacity: 1,
    },
    '50%': {
      opacity: 0,
    },
  },
});

export const StyledOTP = forwardRef<
  ComponentRef<typeof OTPInput>,
  ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const classes = useStyles();

  return isClient ? (
    <OTPInput
      className={`${classes.input} ${className}`}
      containerClassName={`${classes.container} ${containerClassName}`}
      ref={ref}
      {...props}
    />
  ) : null;
});

export const StyledOTPGroup = forwardRef<
  ComponentRef<'div'>,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const classes = useStyles();
  return (
    <div className={`${classes.group} ${className}`} ref={ref} {...props} />
  );
});

export const StyledOTPSlot = forwardRef<
  ComponentRef<'div'>,
  ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
  const classes = useStyles();
  const inputOTPContext = use(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      className={`${classes.slot} ${isActive ? classes.activeSlot : ''} ${className}`}
      ref={ref}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className={classes.caret}>
          <div className={classes.caretBlink} />
        </div>
      )}
    </div>
  );
});
