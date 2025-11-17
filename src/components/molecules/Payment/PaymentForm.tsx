'use client';

import { FormEvent, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {
  StyledButton,
  StyledSelect,
  StyledTextField,
} from '@/components/atoms';

import ICON_CVC from './assets/icon_cvc.svg';

// Initialize Stripe - You'll need to set your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY || '',
);

interface PaymentFormProps {
  email?: string;
  onSubmit?: (data: PaymentFormData) => void | Promise<void>;
}

export interface PaymentFormData {
  email: string;
  cardholderName: string;
  country: string;
  zip: string;
}

const CARD_NUMBER_OPTIONS = {
  showIcon: true, // Enable automatic card brand icon
  style: {
    base: {
      fontSize: '13.3px',
      color: 'rgba(26, 26, 26, 0.9)',
      fontFamily: 'Inter, sans-serif',
      // lineHeight: '18.2px',
      '::placeholder': {
        color: 'rgba(26, 26, 26, 0.6)',
        fontFamily: 'Inter, sans-serif',
      },
    },
    invalid: {
      color: '#DE6449',
      iconColor: '#DE6449',
    },

    disableLink: true,
  },
};

const CARD_EXPIRY_OPTIONS = {
  style: {
    base: {
      fontSize: '13.3px',
      color: 'rgba(26, 26, 26, 0.9)',
      fontFamily: 'Inter, sans-serif',
      '::placeholder': {
        color: 'rgba(26, 26, 26, 0.6)',
        fontFamily: 'Inter, sans-serif',
      },
    },
  },
};

const CARD_CVC_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: 'rgba(26, 26, 26, 0.9)',
      fontFamily: 'Inter, sans-serif',
      // lineHeight: 'normal',
      '::placeholder': {
        color: 'rgba(26, 26, 26, 0.6)',
        fontFamily: 'Inter, sans-serif',
      },
    },
  },
};

const COUNTRIES = [
  { label: 'United States', value: 'US', key: 'US' },
  { label: 'Canada', value: 'CA', key: 'CA' },
  { label: 'United Kingdom', value: 'GB', key: 'GB' },
  { label: 'Australia', value: 'AU', key: 'AU' },
  // Add more countries as needed
];

const PaymentFormInner = ({ email, onSubmit }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [emailValue, setEmailValue] = useState(email || '');
  const [cardholderName, setCardholderName] = useState('');
  const [country, setCountry] = useState('US');
  const [zip, setZip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment method
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumberElement,
          billing_details: {
            name: cardholderName,
            email: emailValue,
            address: {
              country: country,
              postal_code: zip,
            },
          },
        });

      if (pmError) {
        // Handle payment method error
        setIsProcessing(false);
        return;
      }

      if (onSubmit && paymentMethod) {
        await onSubmit({
          email: emailValue,
          cardholderName,
          country,
          zip,
        });
      }
    } catch {
      // Handle payment error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Stack autoComplete="off" component="form" gap={3} onSubmit={handleSubmit}>
      {/* Contact Information */}
      <Stack gap={1}>
        <Typography
          sx={{
            fontSize: 14.5,
            fontWeight: 500,
            color: 'rgba(26, 26, 26, 0.9)',
            lineHeight: 1.43,
          }}
        >
          Contact information
        </Typography>
        {/* Email Display (Read-only) */}
        <Box
          sx={{
            bgcolor: '#F7F7F7',
            borderRadius: '6px',
            boxShadow:
              '0px 0px 0px 1px #E0E0E0, 0px 2px 4px 0px rgba(0,0,0,0.07), 0px 1px 1.5px 0px rgba(0,0,0,0.05)',
            p: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            minHeight: 51,
          }}
        >
          <Typography
            sx={{
              fontSize: '12.8px',
              fontWeight: 500,
              color: 'rgba(26, 26, 26, 0.7)',
              lineHeight: '16.9px',
              minWidth: 'fit-content',
            }}
          >
            Email
          </Typography>
          <Typography
            sx={{
              fontSize: '13.3px',
              fontWeight: 400,
              color: 'rgba(26, 26, 26, 0.9)',
              lineHeight: '18.2px',
              flex: 1,
            }}
          >
            {emailValue || 'fanpeiran9@gmail.com'}
          </Typography>
        </Box>
      </Stack>

      {/* Payment Method */}
      <Stack gap={1.5}>
        <Typography
          sx={{
            fontSize: 14.8,
            fontWeight: 500,
            color: 'rgba(26, 26, 26, 0.9)',
            lineHeight: 1.43,
          }}
        >
          Payment method
        </Typography>

        {/* Card Information */}
        <Stack gap={1}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: 'rgba(26, 26, 26, 0.7)',
              lineHeight: 1.4,
            }}
          >
            Card information
          </Typography>
          <Stack>
            {/* Card Number Field */}
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: '6px 6px 0 0',
                boxShadow:
                  '0px 0px 0px 1px #E0E0E0, 0px 2px 4px 0px transparent, 0px 1px 1.5px 0px rgba(0,0,0,0.05)',
                p: '10px 12px',
                minHeight: 36,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '50%',
                  '& .StripeElement': {
                    width: '100%',
                  },
                  '& input': {
                    fontSize: '13.3px !important',
                    color: 'rgba(26, 26, 26, 0.9) !important',
                    fontFamily: 'Inter, sans-serif !important',
                  },
                }}
              >
                <CardNumberElement options={CARD_NUMBER_OPTIONS} />
              </Box>
            </Box>

            {/* Expiration and CVC Fields */}
            <Stack direction="row" gap={0}>
              <Box
                sx={{
                  width: '50%',
                  bgcolor: 'white',
                  borderRadius: '0 0 0 6px',
                  boxShadow:
                    '0px 0px 0px 1px #E0E0E0, 0px 2px 4px 0px rgba(0,0,0,0.07), 0px 1px 1.5px 0px rgba(0,0,0,0.05)',
                  p: '10px 12px',
                  minHeight: 36,
                  display: 'flex',
                  alignItems: 'center',
                  '& .StripeElement': {
                    width: '100%',
                  },
                  '& input': {
                    fontSize: '13.3px !important',
                    color: 'rgba(26, 26, 26, 0.6) !important',
                    fontFamily: 'Inter, sans-serif !important',
                  },
                }}
              >
                <CardExpiryElement options={CARD_EXPIRY_OPTIONS} />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  bgcolor: 'white',
                  borderRadius: '0 0 6px 0',
                  boxShadow:
                    '0px 0px 0px 1px #E0E0E0, 0px 2px 4px 0px rgba(0,0,0,0.07), 0px 1px 1.5px 0px rgba(0,0,0,0.05)',
                  p: '10px 12px',
                  minHeight: 36,
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  '& .StripeElement': {
                    width: '100%',
                  },
                  '& input': {
                    fontSize: '14px !important',
                    color: 'rgba(26, 26, 26, 0.6) !important',
                    fontFamily: 'Inter, sans-serif !important',
                  },
                }}
              >
                <CardCvcElement options={CARD_CVC_OPTIONS} />
                <Icon component={ICON_CVC} sx={{ width: 30, height: 20 }} />
              </Box>
            </Stack>
          </Stack>
        </Stack>

        {/* Cardholder Name */}
        <Stack>
          <Typography
            sx={{
              fontSize: 12.2,
              fontWeight: 500,
              color: 'rgba(26, 26, 26, 0.7)',
              lineHeight: 1.4,
            }}
          >
            Cardholder name
          </Typography>
          <StyledTextField
            autoComplete="off"
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Full name on card"
            required
            size="medium"
            /*  sx={{
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                boxShadow:
                  '0px 0px 0px 1px #E0E0E0, 0px 2px 4px 0px rgba(0,0,0,0.07), 0px 1px 1.5px 0px rgba(0,0,0,0.05)',
                '& fieldset': {
                  border: 'none',
                },
                '& .MuiInputBase-input': {
                  fontSize: '13.3px',
                  color: 'rgba(26, 26, 26, 0.6)',
                },
              },
            }} */
            value={cardholderName}
          />
        </Stack>

        {/* Country and ZIP */}
        <Stack gap={1}>
          <Typography
            sx={{
              fontSize: 11.9,
              fontWeight: 500,
              color: 'rgba(26, 26, 26, 0.7)',
              lineHeight: 1.4,
            }}
          >
            Country or region
          </Typography>
          <Stack gap={0}>
            <StyledSelect
              IconComponent={() => (
                <KeyboardArrowDownIcon
                  sx={{
                    width: 12,
                    height: 12,
                    color: 'rgba(26, 26, 26, 0.9)',
                    mr: 1.5,
                  }}
                />
              )}
              onChange={(e) => setCountry(e.target.value as string)}
              options={COUNTRIES}
              placeholder=""
              sx={{
                bgcolor: 'white',
                borderRadius: '6px 6px 0 0',
                boxShadow:
                  '0px 0px 0px 1px #E0E0E0, 0px 2px 4px 0px rgba(0,0,0,0.07), 0px 1px 1.5px 0px rgba(0,0,0,0.05)',
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    border: 'none',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '13.1px',
                    color: 'rgba(26, 26, 26, 0.9)',
                    py: '10px',
                  },
                },
                '& .MuiInputLabel-root': {
                  display: 'none',
                },
              }}
              value={country}
            />
            <StyledTextField
              autoComplete="off"
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP"
              required
              size="medium"
              sx={{
                bgcolor: 'white',
                borderRadius: '0 0 6px 6px',
                boxShadow:
                  '0px 0px 0px 1px #E0E0E0, 0px 2px 4px 0px rgba(0,0,0,0.07), 0px 1px 1.5px 0px rgba(0,0,0,0.05)',
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    border: 'none',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    color: 'rgba(26, 26, 26, 0.6)',
                  },
                },
              }}
              value={zip}
            />
          </Stack>
        </Stack>
      </Stack>

      {/* Subscribe Button */}
      <StyledButton
        disabled={isProcessing || !stripe}
        fullWidth
        size="medium"
        sx={{
          bgcolor: '#B0ADBD',
          color: 'white',
          '&:hover': {
            bgcolor: '#B0ADBD',
          },
          '&.Mui-disabled': {
            bgcolor: '#B0ADBD',
            opacity: 0.6,
          },
        }}
        type="submit"
        variant="contained"
      >
        {isProcessing ? 'Processing...' : 'Subscribe'}
      </StyledButton>
      {/* <PaymentElement /> */}
      {/* Disclaimer */}
      <Typography
        sx={{
          fontSize: 12.1,
          fontWeight: 400,
          color: 'rgba(26, 26, 26, 0.7)',
          lineHeight: 1.4,
          textAlign: 'center',
        }}
      >
        By subscribing, you authorize Corepass to charge you according to the
        terms until you cancel.
      </Typography>
    </Stack>
  );
};

export const PaymentForm = ({ email, onSubmit }: PaymentFormProps) => {
  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <Elements options={elementsOptions} stripe={stripePromise}>
      <PaymentFormInner email={email} onSubmit={onSubmit} />
    </Elements>
  );
};
