import { FC, ReactNode, useEffect, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  ChipsCardProps,
  LibraryCard,
  LibraryChip,
  LibraryChipEditDialog,
  modeEnum,
  StyledVerticalTextField,
} from '@/components/molecules';

import { useAsyncFn, useSwitch } from '@/hooks';

import {
  IOfferListItem,
  ITag,
  useLibraryStore,
} from '@/stores/useLibraryStore';

import ICON_DELETE from './assets/icon_delete.svg';
import {
  _addTag,
  _deleteTag,
  _editOffer,
  _editTag,
} from '@/request/library/offers';

import { HttpError } from '@/types';
import { LibraryTypeOfferTagTypeEnum } from '@/types/enum';

type ChipsEditCardProps = ChipsCardProps & {
  offerId: number;
  handleEdit?: (param: ITag) => void;
  handleDelete?: () => void;
  handleAddTag?: (param: ITag) => void;
  type: LibraryTypeOfferTagTypeEnum;
};
const ChipEditCard: FC<ChipsEditCardProps> = ({
  title,
  chips,
  offerId,
  type,
}) => {
  const { visible, open, close } = useSwitch();
  const { fetchOffersInfo, deleteTag } = useLibraryStore((state) => state);

  const [editState, editTag] = useAsyncFn(async (param: ITag) => {
    try {
      await _editTag(param);
      await fetchOffersInfo();
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  const [addState, addTag] = useAsyncFn(
    async (param: ITag) => {
      try {
        await _addTag({
          offerId: param.id,
          name: param.name,
          description: param.description,
          type,
        });
        await fetchOffersInfo();
      } catch (error) {
        close();
        const { message, header, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [offerId, type],
  );

  const [, del] = useAsyncFn(async (id: number) => {
    try {
      deleteTag(id);
      await _deleteTag(id);
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  return (
    <>
      <Stack gap={1.5}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Typography component={'div'} fontWeight={600}>
            {title}
          </Typography>
          <StyledButton
            onClick={open}
            size={'medium'}
            sx={{ width: 'fit-content' }}
            variant={'text'}
          >
            Add
          </StyledButton>
        </Stack>
        <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1}>
          {chips.map((item, index) => (
            <LibraryChip
              description={item.description}
              handleDelete={del}
              handleSave={editTag}
              id={item.id}
              isDelete
              key={index}
              loading={editState.loading}
              name={item.name}
            />
          ))}
        </Stack>
      </Stack>
      <LibraryChipEditDialog
        description={''}
        handleSave={addTag}
        header={'Add pain point'}
        loading={addState.loading}
        name={''}
        onClose={close}
        open={visible}
        uid={offerId}
      />
    </>
  );
};

type LibraryOffersEditCardProps = IOfferListItem & {
  handleCancel?: () => void;
  handleSave?: (
    param: Pick<IOfferListItem, 'productName' | 'productUrl' | 'id'>,
  ) => void;
  footer?: ReactNode;
  mode?: modeEnum;
  loading?: boolean;
  handleDelete?: (offerId: number) => void;
};
export const LibraryOffersEditCard: FC<LibraryOffersEditCardProps> = ({
  productName,
  productDescription,
  productUrl,
  painPoints,
  solutions,
  proofPoints,
  handleCancel,
  footer,
  id,
  handleDelete,
}) => {
  const { setEditId, fetchOffersInfo, setIsAdd } = useLibraryStore(
    (state) => state,
  );

  const [libName, setLibName] = useState('');
  const [desc, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const [editState, editOffer] = useAsyncFn(
    async (
      param: Pick<
        IOfferListItem,
        'productName' | 'productUrl' | 'id' | 'productDescription'
      >,
    ) => {
      try {
        await _editOffer(param);
        await fetchOffersInfo();
        setEditId(Infinity);
        setIsAdd(false);
      } catch (error) {
        close();
        const { message, header, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      }
    },
  );

  const [extractState, extract] = useAsyncFn(async () => {
    let str = '';
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            module: 'OFFER_INTRODUCTION',
            params: {
              companyName: libName,
              companyPage: `https://${url}`,
            },
          }),
        },
      );
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        const readStream = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              close();
              return;
            }
            // decode
            const data = decoder
              .decode(value)
              .replace(/data:/g, '')
              .replace(/\n/g, '');

            str = str + data;
            setDescription(str);
            // continue read stream
            readStream();
          });
        };
        readStream();
      }
    } catch (error) {
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [libName, url]);

  useEffect(() => {
    setDescription(productDescription);
    setLibName(productName);
    setUrl(productUrl);
  }, [productName, productDescription, productUrl]);

  return (
    <LibraryCard sx={{ width: '30%' }}>
      <Stack gap={1.5} height={'100%'}>
        <StyledVerticalTextField
          label={'Product name'}
          onChange={(e) => setLibName(e.target.value)}
          required
          toolTipTittle={
            "Provide your company's website URL. This link will be included in emails to direct users to learn more about your business."
          }
          value={libName}
        />
        <StyledVerticalTextField
          label={'Product page'}
          onChange={(e) => setUrl(e.target.value)}
          required
          slotProps={{
            input: {
              startAdornment: 'https://',
              endAdornment: (
                <StyledButton
                  loading={extractState.loading}
                  onClick={extract}
                  size={'small'}
                  sx={{ px: '4px !important', width: 88 }}
                  variant={'text'}
                >
                  Smart extract
                </StyledButton>
              ),
            },
          }}
          toolTipTittle={
            "Provide your company's website URL. This link will be included in emails to direct users to learn more about your business."
          }
          value={url}
        />
        <Box flex={1}>
          <StyledVerticalTextField
            label={'Description'}
            multiline
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={10}
            sx={{
              '& .MuiOutlinedInput-input': {
                p: 0,
                height: 'auto !important',
              },
            }}
            toolTipTittle={
              "Provide your company's website URL. This link will be included in emails to direct users to learn more about your business."
            }
            value={desc}
          />
        </Box>
        <ChipEditCard
          chips={painPoints}
          offerId={id}
          title={'Pain points'}
          type={LibraryTypeOfferTagTypeEnum.pain_points}
        />
        <ChipEditCard
          chips={solutions}
          offerId={id}
          title={'Solutions'}
          type={LibraryTypeOfferTagTypeEnum.solutions}
        />
        <ChipEditCard
          chips={proofPoints}
          offerId={id}
          title={'Proof points'}
          type={LibraryTypeOfferTagTypeEnum.proof_points}
        />
        {footer ? (
          footer
        ) : (
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <StyledButton
              size={'medium'}
              sx={{
                width: 'fit-content',
                p: '0 !important',
                height: 'fit-content !important',
                fontSize: 0,
              }}
              variant={'text'}
            >
              {handleDelete ? (
                <Icon
                  component={ICON_DELETE}
                  onClick={() => {
                    handleDelete(id);
                  }}
                  sx={{ width: 20, height: 20 }}
                />
              ) : null}
            </StyledButton>
            <Stack flexDirection={'row'} gap={1.5}>
              <StyledButton
                color={'info'}
                onClick={handleCancel}
                size={'medium'}
                sx={{ width: 'fit-content' }}
                variant={'outlined'}
              >
                Cancel
              </StyledButton>
              <StyledButton
                loading={editState.loading}
                onClick={async () => {
                  await editOffer({
                    id,
                    productName: libName,
                    productUrl: url,
                    productDescription: desc,
                  });
                }}
                size={'medium'}
                sx={{ width: 66 }}
                variant={'outlined'}
              >
                Save
              </StyledButton>
            </Stack>
          </Stack>
        )}
      </Stack>
    </LibraryCard>
  );
};
