import { FC } from 'react';

import { SDRToast } from '@/components/atoms';
import {
  LibraryOffersEditCard,
  LibraryOffersInfoCard,
} from '@/components/molecules';

import { IOfferListItem, useLibraryStore } from '@/stores/useLibraryStore';
import { useAsyncFn, useSwitch } from '@/hooks';

import { _deleteOffer } from '@/request/library/offers';
import { HttpError } from '@/types';

type LibraryOfferCardProps = IOfferListItem;

export const LibraryOfferCard: FC<LibraryOfferCardProps> = ({
  id,
  painPoints,
  proofPoints,
  solutions,
  productUrl,
  productName,
  productDescription,
}) => {
  const { isAdd, setEditId, setIsAdd, deleteOffer, editId } = useLibraryStore(
    (state) => state,
  );

  const { visible: isEdit, close, open } = useSwitch();

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

  if (isAdd && id === editId) {
    return (
      <LibraryOffersEditCard
        handleCancel={async () => {
          setEditId(Infinity);
          setIsAdd(false);
          await del(id);
        }}
        id={id}
        painPoints={[]}
        productDescription={''}
        productName={''}
        productUrl={''}
        proofPoints={[]}
        solutions={[]}
      />
    );
  }

  if (isEdit) {
    return (
      <LibraryOffersEditCard
        handleCancel={async () => {
          close();
          setEditId(Infinity);
        }}
        handleDelete={async () => {
          await del(id);
        }}
        id={id}
        painPoints={painPoints}
        productDescription={productDescription}
        productName={productName}
        productUrl={productUrl}
        proofPoints={proofPoints}
        solutions={solutions}
      />
    );
  }

  return (
    <LibraryOffersInfoCard
      handleEdit={() => {
        open();
      }}
      id={id}
      painPoints={painPoints}
      productDescription={productDescription}
      productName={productName}
      productUrl={productUrl}
      proofPoints={proofPoints}
      solutions={solutions}
    />
  );
};
