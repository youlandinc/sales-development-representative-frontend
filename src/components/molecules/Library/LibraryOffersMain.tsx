import { useEffect } from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';

import { SDRToast, StyledButton } from '@/components/atoms';
import { LibraryOfferCard } from '@/components/molecules';
import { useAsyncFn } from '@/hooks';

import { HttpError } from '@/types';
import { _createOffer } from '@/request/library/offers';
import { useLibraryStore } from '@/stores/useLibraryStore';

export const LibraryOffersMain = () => {
  const {
    offerList,
    addOffer,
    isAdd,
    fetchOffersInfo,
    isEdit,
    setIsEdit,
    setIsAdd,
  } = useLibraryStore((state) => state);

  const [state, fetchData] = useAsyncFn(async () => {
    try {
      await fetchOffersInfo();
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  const [createState, createOffer] = useAsyncFn(async () => {
    try {
      const { data } = await _createOffer();
      addOffer(data);
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
    return () => {
      setIsEdit(false);
      setIsAdd(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={3}>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Typography variant={'body2'}>
          This is an overview of all offers stored about your business
        </Typography>
        <StyledButton
          disabled={isAdd || isEdit}
          loading={createState.loading}
          onClick={createOffer}
          size={'medium'}
          sx={{ px: '12px !important', py: '6px !important', width: 136 }}
        >
          Create new offer
        </StyledButton>
      </Stack>
      <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3}>
        {state.loading ? (
          <Stack
            alignItems={'center'}
            height={'calc(100vh - 280px)'}
            justifyContent={'center'}
            width={'100%'}
          >
            <CircularProgress size={20} />
          </Stack>
        ) : (
          offerList.map((offer) => (
            <LibraryOfferCard
              id={offer.id}
              key={offer.id}
              painPoints={offer.painPoints}
              productDescription={offer.productDescription}
              productName={offer.productName}
              productUrl={offer.productUrl}
              proofPoints={offer.proofPoints}
              solutions={offer.solutions}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
};
