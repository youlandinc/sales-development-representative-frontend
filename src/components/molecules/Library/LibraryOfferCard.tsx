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
  const {
    isAdd,
    setEditId,
    setIsAdd,
    deleteOffer,
    editId,
    setIsEdit,
    offerList,
  } = useLibraryStore((state) => state);

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

  if (isAdd && editId === id) {
    return (
      <LibraryOffersEditCard
        handleCancel={async () => {
          setEditId(Infinity);
          setIsAdd(false);
          await del(id);
        }}
        id={id}
        painPoints={offerList?.[0]?.painPoints || []}
        productDescription={''}
        productName={''}
        productUrl={''}
        proofPoints={offerList?.[0]?.proofPoints || []}
        solutions={offerList?.[0]?.solutions || []}
      />
    );
  }

  if (isEdit) {
    return (
      <LibraryOffersEditCard
        handleCancel={async () => {
          setEditId(Infinity);
          setIsEdit(false);
          close();
        }}
        handleDelete={async () => {
          await del(id);
        }}
        handleSave={() => {
          close();
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
        setIsEdit(true);
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
