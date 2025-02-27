import { FC, useEffect, useState } from 'react';
import {
  Avatar,
  Collapse,
  Drawer,
  DrawerProps,
  Icon,
  Stack,
  Typography,
} from '@mui/material';

import {
  SDRToast,
  StyledButton,
  StyledShadowContent,
} from '@/components/atoms';

import { useAsyncFn } from '@/hooks';

import {
  HttpError,
  LeadsInfoCampaignsData,
  ModuleEnum,
  ResponseLeadsInfo,
} from '@/types';
import { _fetchLeadsInfoByLeadId } from '@/request';

import ICON_NEXT from '@/components/molecules/Leads/assets/icon_next.svg';
import ICON_COMPANY from '@/components/molecules/Leads/assets/icon_company.svg';
import ICON_PERSON from '@/components/molecules/Leads/assets/icon_person.svg';
import ICON_LINKEDIN from './assets/icon_linkedin.svg';
import ICON_CLOSE from './assets/icon_close.svg';
import { UFormatDate } from '@/utils';

type CommonCampaignUserInfoProps = DrawerProps & {
  leadId: number;
};

export const CommonCampaignUserInfo: FC<CommonCampaignUserInfoProps> = ({
  open,
  onClose,
  leadId,
}) => {
  const [researchInfo, setResearchInfo] = useState('');
  const [personalResearchLoading, setPersonalResearchLoading] = useState(false);

  const onClickToClose = () => {
    setItemDetails(undefined);
    setFetchLoading(false);
    setExpendInfo(false);
    setExpendCampaigns(false);
    setCampaignsData([]);
    onClose?.({}, 'backdropClick');
  };

  const [itemDetails, setItemDetails] = useState<
    ResponseLeadsInfo | undefined
  >();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [expendInfo, setExpendInfo] = useState<boolean>(true);
  const [activeInfo, setActiveInfo] = useState<'company' | 'person'>('company');
  const [expendCampaigns, setExpendCampaigns] = useState<boolean>(false);
  const [campaignsData, setCampaignsData] = useState<LeadsInfoCampaignsData[]>(
    [],
  );

  const avatarName = (firstName: string, lastName: string) => {
    const target = (firstName?.[0] ?? '') + (lastName?.[0] ?? '') || '';
    const result = target.match(/[a-zA-Z]+/g);
    return result ? result[0] : '';
  };

  const [, fetchLeadsInfo] = useAsyncFn(async () => {
    if (!leadId) {
      return;
    }
    setFetchLoading(true);

    try {
      const { data } = await _fetchLeadsInfoByLeadId(leadId);
      const { campaigns } = data;
      setItemDetails(data);

      setCampaignsData(campaigns);
      setExpendCampaigns(true);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
      onClickToClose();
    } finally {
      setFetchLoading(false);
    }
  }, [leadId]);

  const onClickToFetchPersonalResearch = async (id: string | number) => {
    setPersonalResearchLoading(true);
    let str = '';
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        module: ModuleEnum.personal_research,
        params: {
          leadId: id,
        },
      }),
    })
      .then((response) => {
        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');

          const readStream = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                setPersonalResearchLoading(false);
                return;
              }
              // decode
              const data = decoder.decode(value).replace(/data:/g, '');
              //.replace(/\n/g, '');

              str = str + data;
              setResearchInfo(str);

              // continue read stream
              readStream();
            });
          };

          readStream();
        }
      })
      .catch((error) => {
        const { message, header, variant } = error as HttpError;
        SDRToast({ message, header, variant });
      });
  };

  const firstName = itemDetails?.name?.split(' ')?.[0] ?? '';
  const lastName = itemDetails?.name?.split(' ')?.[1] ?? '';

  useEffect(() => {
    open && fetchLeadsInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Drawer
      anchor={'right'}
      onClose={onClickToClose}
      open={open}
      PaperProps={{ sx: { px: 3, py: 6, width: (1300 * 100) / 1920 + '%' } }}
    >
      <Stack minWidth={'50%'} pb={6} pt={3} px={3}>
        <Stack
          flex={1}
          flexDirection={'row'}
          position={'sticky'}
          py={3}
          sx={{ background: 'white', zIndex: 9999 }}
          top={0}
        >
          <Stack flex={1} flexDirection={'row'} gap={2}>
            <Avatar
              src={itemDetails?.avatar || ''}
              sx={{
                bgcolor: '#dedede',
                width: 40,
                height: 40,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {avatarName(firstName, lastName)}
            </Avatar>

            <Stack>
              <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: 'fit-content',
                    maxWidth: '100%',
                  }}
                  variant={'subtitle2'}
                >
                  {itemDetails?.name}
                </Typography>
                <Icon
                  component={ICON_LINKEDIN}
                  sx={{ width: 18, height: 18 }}
                />
              </Stack>

              <Stack
                color={'text.secondary'}
                flexDirection={'row'}
                fontSize={14}
                gap={0.5}
              >
                <Typography
                  color={'text.secondary'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: 'fit-content',
                    maxWidth: '100%',
                    fontSize: 'inherit',
                  }}
                >
                  {itemDetails?.jobTitle}
                </Typography>
                @
                <Typography
                  alignSelf={'center'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: 'inherit',
                  }}
                >
                  {itemDetails?.company}
                </Typography>
              </Stack>
            </Stack>

            <Icon
              component={ICON_CLOSE}
              onClick={() => onClickToClose()}
              sx={{ width: 24, height: 24, ml: 'auto', cursor: 'pointer' }}
            />
          </Stack>
        </Stack>

        <Stack
          bgcolor={'#ffffff'}
          border={'1px solid #DFDEE6'}
          borderRadius={4}
          p={2}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={2}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpendInfo(!expendInfo);
            }}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Icon
              component={ICON_NEXT}
              sx={{
                width: 18,
                height: 18,
                transform: expendInfo ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform .3s',
                '& path': {
                  fill: '#2A292E',
                },
              }}
            />

            <StyledButton
              color={'info'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveInfo('company');
              }}
              size={'small'}
              sx={{
                color:
                  activeInfo !== 'company'
                    ? '#6F6C7D !important'
                    : '#2A292E !important',
              }}
              variant={activeInfo === 'company' ? 'outlined' : 'text'}
            >
              <Icon
                component={ICON_COMPANY}
                sx={{
                  width: 18,
                  height: 18,
                  mr: 0.4,
                  '& path': {
                    fill: activeInfo === 'company' ? '#2A292E' : '#6F6C7D',
                  },
                }}
              />
              Company research
            </StyledButton>
            <StyledButton
              color={'info'}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveInfo('person');
                if (
                  typeof itemDetails?.previewLeadId === 'string' &&
                  !researchInfo &&
                  !personalResearchLoading
                ) {
                  await onClickToFetchPersonalResearch(
                    itemDetails.previewLeadId,
                  );
                }
              }}
              size={'small'}
              sx={{
                color:
                  activeInfo !== 'person'
                    ? '#6F6C7D !important'
                    : '#2A292E !important',
              }}
              variant={activeInfo === 'person' ? 'outlined' : 'text'}
            >
              <Icon
                component={ICON_PERSON}
                sx={{
                  width: 18,
                  height: 18,
                  mr: 0.5,
                  '& path': {
                    fill: activeInfo === 'person' ? '#2A292E' : '#6F6C7D',
                  },
                }}
              />
              Personal research
            </StyledButton>
          </Stack>

          <Collapse in={expendInfo}>
            <Stack gap={1} mt={2}>
              <Typography color={'text.secondary'} variant={'subtitle3'}>
                Overview
              </Typography>
              <Typography variant={'body3'}>
                {activeInfo === 'company'
                  ? itemDetails?.companyResearch
                  : researchInfo}
              </Typography>
            </Stack>
          </Collapse>
        </Stack>

        <Stack
          bgcolor={'#ffffff'}
          border={'1px solid #DFDEE6'}
          borderRadius={4}
          mt={3}
          p={2}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={2}
            onClick={(e) => {
              if (fetchLoading) {
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              setExpendCampaigns(!expendCampaigns);
            }}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Icon
              component={ICON_NEXT}
              sx={{
                width: 18,
                height: 18,
                transform: expendCampaigns ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform .3s',
                '& path': {
                  fill: '#2A292E',
                },
              }}
            />

            <Typography variant={'body2'}>Campaigns</Typography>
          </Stack>

          <Collapse in={expendCampaigns}>
            <Stack gap={1} mt={2}>
              {campaignsData.map((campaign, index) => (
                <Stack
                  borderBottom={
                    index !== campaignsData.length - 1
                      ? '1px solid #E5E5E5'
                      : 'unset'
                  }
                  gap={1.5}
                  key={`${campaign.sentOn}-${index}`}
                  p={1.5}
                >
                  <Stack flexDirection={'row'} fontSize={12} gap={1}>
                    Step {index + 1}
                    <Typography color={'text.secondary'} fontSize={'inherit'}>
                      {UFormatDate(campaign.sentOn, 'MMM dd, yyyy')}
                    </Typography>
                  </Stack>
                  <Typography variant={'subtitle3'}>
                    {campaign.subject}
                  </Typography>
                  <StyledShadowContent html={campaign.content} />
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </Stack>
      </Stack>
    </Drawer>
  );
};
