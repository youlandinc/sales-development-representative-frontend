import { Typography } from '@mui/material';
import { FC } from 'react';

const TYPOGRAPHY_STYLES = {
  fontSize: 22,
  lineHeight: '36px',
  color: 'text.secondary',
  minHeight: 36,
} as const;

interface SimpleTextHeaderProps {
  text: string;
}

export const SimpleTextHeader: FC<SimpleTextHeaderProps> = ({ text }) => (
  <Typography sx={TYPOGRAPHY_STYLES}>{text}</Typography>
);
