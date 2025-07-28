import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Box, Icon, Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';

import { SDRToast, StyledButton } from '@/components/atoms';
import {
  LibraryCard,
  LibraryCardProps,
  LibraryChip,
} from '@/components/molecules';

import { useAsyncFn } from '@/hooks';

import { _editTag, _fetchCompanyInfo } from '@/request/library/offers';
import { HttpError } from '@/types';

import ICON_BUILDINGS from './assets/icon_buildings.svg';

import { ITag, useLibraryStore } from '@/stores/useLibraryStore';
import { PREVIEW_IMAGE_URL } from '@/constant';

const LibraryCompanyCard: FC<PropsWithChildren<LibraryCardProps>> = ({
  children,
  ...rest
}) => {
  return (
    <LibraryCard sx={{ width: '33%' }} {...rest}>
      <Stack gap={1.5}>{children}</Stack>
    </LibraryCard>
  );
};

export const LibraryCompanyMain = () => {
  const { updateCompanyInfo, companyPage, sellIntroduction } = useLibraryStore(
    (state) => state,
  );

  const router = useRouter();
  const [imgLoading, setImgLoading] = useState(true);

  const [state, fetchCompanyInfo] = useAsyncFn(async () => {
    try {
      const res = await _fetchCompanyInfo();
      updateCompanyInfo('companyName', res.data.companyName || '');
      updateCompanyInfo('companyPage', res.data.companyPage || '');
      updateCompanyInfo('sellIntroduction', res.data.sellIntroduction || '');
      return res;
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  const [editState, editTag] = useAsyncFn(async (param: ITag) => {
    try {
      await _editTag(param);
      await fetchCompanyInfo();
    } catch (error) {
      close();
      const { message, header, variant } = error as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    fetchCompanyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap={3}>
      <LibraryCard
        icon={
          <Icon component={ICON_BUILDINGS} sx={{ width: 20, height: 20 }} />
        }
        title={
          <Stack alignItems={'center'} flexDirection={'row'} gap={3}>
            <Typography fontWeight={600} lineHeight={1.2}>
              Company overview
            </Typography>
            <StyledButton
              color={'info'}
              onClick={() => {
                router.push('/library/company');
              }}
              size={'medium'}
              sx={{
                px: '12px !important',
                py: '6px !important',
                fontSize: '12px !important',
                lineHeight: 1,
                height: 'auto !important',
              }}
              variant={'outlined'}
            >
              Edit
            </StyledButton>
          </Stack>
        }
      >
        <Stack flexDirection={'row'} gap={1.25} width={'100%'}>
          <Typography
            flex={1}
            lineHeight={1.7}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '15',
              display: '-webkit-box',
            }}
            variant={'body2'}
          >
            {sellIntroduction}
          </Typography>
          <Box
            flex={1.5}
            maxHeight={'18rem'}
            maxWidth={'50%'}
            minHeight={300}
            overflow={'hidden'}
          >
            {imgLoading && <Skeleton height={'100%'} variant={'rectangular'} />}
            {companyPage !== '' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={'picture'}
                height={'auto'}
                onLoad={() => {
                  setImgLoading(false);
                }}
                src={`${PREVIEW_IMAGE_URL}${companyPage}`}
                style={{ objectFit: 'cover' }}
                width={'100%'}
              />
            )}
          </Box>
        </Stack>
      </LibraryCard>
      <Stack flexDirection={'row'} gap={3}>
        <LibraryCompanyCard
          icon={
            <Icon component={ICON_BUILDINGS} sx={{ width: 20, height: 20 }} />
          }
          title={'Pain points'}
        >
          {state.loading ? (
            <>
              <Skeleton height={20} />
              <Skeleton height={20} width={'50%'} />
            </>
          ) : (
            <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1.5}>
              {state.value?.data?.painPoints.map((item, index) => (
                <LibraryChip
                  description={item.description}
                  handleSave={editTag}
                  id={item.id}
                  key={index}
                  loading={editState.loading}
                  name={item.name}
                />
              ))}
            </Stack>
          )}
        </LibraryCompanyCard>
        <LibraryCompanyCard
          icon={
            <Icon component={ICON_BUILDINGS} sx={{ width: 20, height: 20 }} />
          }
          title={'Solutions'}
        >
          {state.loading ? (
            <>
              <Skeleton height={20} />
              <Skeleton height={20} width={'50%'} />
            </>
          ) : (
            <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1.5}>
              {state.value?.data?.solutions.map((item, index) => (
                <LibraryChip
                  description={item.description}
                  handleSave={editTag}
                  id={item.id}
                  key={index}
                  loading={editState.loading}
                  name={item.name}
                />
              ))}
            </Stack>
          )}
        </LibraryCompanyCard>
        <LibraryCompanyCard
          icon={
            <Icon component={ICON_BUILDINGS} sx={{ width: 20, height: 20 }} />
          }
          title={'Proof points'}
        >
          {state.loading ? (
            <>
              <Skeleton height={20} />
              <Skeleton height={20} width={'50%'} />
            </>
          ) : (
            <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1.5}>
              {state.value?.data?.proofPoints.map((item, index) => (
                <LibraryChip
                  description={item.description}
                  handleSave={editTag}
                  id={item.id}
                  key={index}
                  loading={editState.loading}
                  name={item.name}
                />
              ))}
            </Stack>
          )}
        </LibraryCompanyCard>
      </Stack>
    </Stack>
  );
};
