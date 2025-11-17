import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { ProgressBar } from './ProgressBar';

type CreditCategoryProps = {
  title: string;
  used?: number;
  total?: number;
  unlimited?: boolean;
};

export const CreditCategory: FC<CreditCategoryProps> = ({
  title,
  used,
  total,
  unlimited,
}) => {
  return (
    <Stack gap={1}>
      <Typography
        color="#e2c7a3"
        fontSize={14}
        fontWeight={600}
        variant="subtitle2"
      >
        {title}
      </Typography>
      <Stack gap={0.5}>
        <Typography color="#e2c7a3" fontSize={14} variant="body2">
          {unlimited
            ? 'Unlimited access'
            : `${used?.toLocaleString()} used of ${total?.toLocaleString()}`}
        </Typography>
        {!unlimited && used !== undefined && total !== undefined && (
          <ProgressBar total={total} used={used} />
        )}
      </Stack>
    </Stack>
  );
};

