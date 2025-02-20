import { Fragment, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  LibraryOffersEditCard,
  LibraryOffersInfoCard,
} from '@/components/molecules';
import { useAsyncFn } from '@/hooks';

import { HttpError } from '@/types';
import { _createOffer, _deleteOffer } from '@/request/library/offers';
import { useLibraryStore } from '@/stores/useLibraryStore';

export const LibraryOffersMain = () => {
  const {
    offerList,
    addOffer,
    isAdd,
    editId,
    setEditId,
    setIsAdd,
    fetchOffersInfo,
    deleteOffer,
  } = useLibraryStore((state) => state);

  // const [index, setIndex] = useState(Infinity);

  const [, fetchData] = useAsyncFn(async () => {
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

  const [, del] = useAsyncFn(async (id: number) => {
    try {
      deleteOffer(id);
      await _deleteOffer(id);
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
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
          disabled={isAdd}
          loading={createState.loading}
          onClick={createOffer}
          size={'medium'}
          sx={{ px: '12px !important', py: '6px !important', width: 136 }}
        >
          Create new offer
        </StyledButton>
      </Stack>
      <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3}>
        {offerList.map((offer) => (
          <Fragment key={offer.id}>
            {editId === offer.id ? (
              isAdd ? (
                <LibraryOffersEditCard
                  handleCancel={async () => {
                    setEditId(Infinity);
                    setIsAdd(false);
                    await del(offer.id);
                  }}
                  id={offer.id}
                  painPoints={[]}
                  productDescription={''}
                  productName={''}
                  productUrl={''}
                  proofPoints={[]}
                  solutions={[]}
                />
              ) : (
                <LibraryOffersEditCard
                  handleCancel={async () => {
                    setEditId(Infinity);
                  }}
                  handleDelete={async () => {
                    await del(offer.id);
                  }}
                  id={offer.id}
                  painPoints={offer.painPoints}
                  productDescription={offer.productDescription}
                  productName={offer.productName}
                  productUrl={offer.productUrl}
                  proofPoints={offer.proofPoints}
                  solutions={offer.solutions}
                />
              )
            ) : (
              <LibraryOffersInfoCard
                handleEdit={() => {
                  setEditId(offer.id);
                }}
                id={offer.id}
                painPoints={offer.painPoints}
                productDescription={offer.productDescription}
                productName={offer.productName}
                productUrl={offer.productUrl}
                proofPoints={offer.proofPoints}
                solutions={offer.solutions}
              />
            )}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};
