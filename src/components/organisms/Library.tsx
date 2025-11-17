import { Box, Fade, Stack, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';
import { LibraryCompanyMain, LibraryOffersMain } from '@/components/molecules';

import {
  LibraryContainerTypeEnum,
  useLibraryStore,
} from '@/stores/useLibraryStore';

export const Library = () => {
  // const [activeBtn, setActiveBtn] = useState<'company' | 'offers'>('company');
  const { libraryContainerType, setLibraryContainerType } = useLibraryStore(
    (state) => state,
  );

  return (
    <Fade in>
      <Stack gap={3}>
        <Typography variant={'h5'}>Library</Typography>
        <Stack
          flexDirection={'row'}
          gap={1}
          sx={{
            '& .active': {
              // bgcolor: '#F8F8FA !important',
              // color: '#6E4EFB !important',
              borderColor: 'primary.hover',
            },
          }}
        >
          <StyledButton
            className={
              libraryContainerType === LibraryContainerTypeEnum.company
                ? 'active'
                : ''
            }
            color={'info'}
            onClick={() =>
              setLibraryContainerType(LibraryContainerTypeEnum.company)
            }
            size={'medium'}
            sx={{ px: '12px !important', py: '8px !important' }}
            variant={'outlined'}
          >
            Company
          </StyledButton>
          <StyledButton
            className={
              libraryContainerType === LibraryContainerTypeEnum.offers
                ? 'active'
                : ''
            }
            color={'info'}
            onClick={() =>
              setLibraryContainerType(LibraryContainerTypeEnum.offers)
            }
            size={'medium'}
            sx={{ px: '12px !important', py: '8px !important' }}
            variant={'outlined'}
          >
            Offers
          </StyledButton>
        </Stack>
        {libraryContainerType === LibraryContainerTypeEnum.company && (
          <Fade in>
            <Box>
              <LibraryCompanyMain />
            </Box>
          </Fade>
        )}
        {libraryContainerType === LibraryContainerTypeEnum.offers && (
          <Fade in={libraryContainerType === LibraryContainerTypeEnum.offers}>
            <Box>
              <LibraryOffersMain />
            </Box>
          </Fade>
        )}
      </Stack>
    </Fade>
  );
};
