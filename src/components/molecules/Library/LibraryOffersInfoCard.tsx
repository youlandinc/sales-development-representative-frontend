import { FC } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';
import { LibraryCard, LibraryChip } from '@/components/molecules';

import { useSwitch } from '@/hooks';

import { IOfferListItem, ITag } from '@/stores/useLibraryStore';
import { PREVIEW_IMAGE_URL } from '@/constant';

export enum modeEnum {
  add = 'add',
  // edit = 'edit',
}

export type ChipsCardProps = {
  title: string;
  chips: ITag[];
};
export const ChipsCard: FC<ChipsCardProps> = ({ title, chips }) => {
  return (
    <Stack gap={1.5}>
      <Typography component={'div'} fontWeight={600}>
        {title}
      </Typography>
      <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1.5}>
        {chips.map((item, index) => (
          <LibraryChip
            description={item.description}
            id={item.id}
            key={index}
            name={item.name}
          />
        ))}
      </Stack>
    </Stack>
  );
};

type LibraryOffersCardProps = IOfferListItem & {
  handleEdit?: () => void;
};
export const LibraryOffersInfoCard: FC<LibraryOffersCardProps> = ({
  productName,
  productDescription,
  productUrl,
  painPoints,
  solutions,
  proofPoints,
  handleEdit,
}) => {
  const { visible, close } = useSwitch(true);

  return (
    <LibraryCard
      sx={{ width: '30%' }}
      title={
        <Typography component={'div'} fontWeight={600} lineHeight={1.2}>
          {productName}
        </Typography>
      }
    >
      <Stack alignItems={'space-between'} gap={1.5} height={'100%'}>
        <Box height={'14rem'} maxWidth={'100%'} overflow={'hidden'}>
          {visible && <Skeleton height={'100%'} variant={'rectangular'} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={'picture'}
            height={'auto'}
            onLoad={() => {
              close();
            }}
            src={`${PREVIEW_IMAGE_URL}${productUrl}`}
            style={{ objectFit: 'cover' }}
            width={'100%'}
          />
        </Box>
        <Typography flex={1} variant={'body3'}>
          {productDescription}
        </Typography>
        <ChipsCard chips={painPoints} title={'Pain points'} />
        <ChipsCard chips={solutions} title={'Solutions'} />
        <ChipsCard chips={proofPoints} title={'Proof points'} />
        <StyledButton
          color={'info'}
          onClick={handleEdit}
          size={'medium'}
          sx={{ width: 'fit-content', alignSelf: 'flex-end' }}
          variant={'outlined'}
        >
          Edit offer
        </StyledButton>
      </Stack>
    </LibraryCard>
  );
};
