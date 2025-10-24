import { useCallback, useEffect } from 'react';

export const useKeyDown = ({ activeStep }: { activeStep: number }) => {
  const keydownEvent = useCallback(
    (e: KeyboardEvent) => {
      const confirmButton: (HTMLElement & { disabled?: boolean }) | null =
        document.getElementById(
          `account-custom-payment-link-email-button-confirm-${activeStep}`,
        );
      const cancelButton: (HTMLElement & { disabled?: boolean }) | null =
        document.getElementById(
          `account-custom-payment-link-email-button-cancel-${activeStep}`,
        );

      if (!confirmButton) {
        return;
      }

      if (e.key === 'Enter') {
        if (!confirmButton.disabled) {
          confirmButton.click();
        }
      }

      if (e.key === 'Escape') {
        if (cancelButton) {
          cancelButton.click();
        }
      }
    },
    [activeStep],
  );

  useEffect(() => {
    document.addEventListener('keydown', keydownEvent, false);
    return () => {
      document.removeEventListener('keydown', keydownEvent, false);
    };
  }, [keydownEvent]);
};
