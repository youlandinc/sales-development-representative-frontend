import { FC } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';

import {
  ProcessCreateChatEnum,
  ResponseCampaignProcessChatServer,
} from '@/types';

import ICON_LOADING from '../assets/icon_loading.svg';

import ICON_EARTH from '../assets/icon_earth.svg';
import ICON_LINKEDIN from '../assets/icon_linkedin.svg';

import ICON_CHAT_LOGO from '../assets/icon_chat_logo.svg';

import ICON_CHAT_THINKING from '../assets/icon_chat_thinking.svg';
import ICON_CHAT_PLAN from '../assets/icon_chat_plan.svg';
import ICON_CHAT_AFTER_PLAN from '../assets/icon_chat_after_plan.svg';
import ICON_CHAT_SEARCH from '../assets/icon_chat_search.svg';
import ICON_CHAT_COMPLETED from '../assets/icon_chat_completed.svg';

export interface ChatServerCardProps {
  source: string;
  id: string | number;
  data: ResponseCampaignProcessChatServer[];
  isFake?: boolean;
}

const STEP_HASH = (step: ProcessCreateChatEnum) => {
  switch (step) {
    case ProcessCreateChatEnum.thinking:
      return ICON_CHAT_THINKING;
    case ProcessCreateChatEnum.create_plan:
      return ICON_CHAT_PLAN;
    case ProcessCreateChatEnum.search:
      return ICON_CHAT_SEARCH;
    case ProcessCreateChatEnum.completed:
      return ICON_CHAT_COMPLETED;
    default: {
      return ICON_CHAT_AFTER_PLAN;
    }
  }
};

export const ChatServerCard: FC<ChatServerCardProps> = ({ data, isFake }) => {
  const sortedData = data.sort((a, b) => a.sort - b.sort);

  return (
    <Stack flexDirection={'row'} gap={1} height={'auto'} width={'100%'}>
      <Icon
        component={ICON_CHAT_LOGO}
        sx={{ width: 16, height: 16, flexShrink: 0 }}
      />
      <Stack gap={1}>
        {isFake ? (
          <Icon
            component={ICON_LOADING}
            sx={{
              width: 20,
              height: 20,
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          />
        ) : (
          sortedData.map((item, index) => (
            <Fade in={true} key={`${item.id}-${index}`} timeout={300}>
              <Stack flex={1} flexDirection={'row'} gap={1}>
                <Stack flexDirection={'row'} flexShrink={0}>
                  <Stack gap={0.5}>
                    <Icon
                      component={STEP_HASH(item.step)}
                      sx={{ width: 20, height: 20, flexShrink: 0 }}
                    />
                    {item.step !== ProcessCreateChatEnum.completed &&
                      index !== sortedData.length - 1 && (
                        <Stack
                          alignSelf={'center'}
                          bgcolor={'#D0CEDA'}
                          flex={1}
                          width={'1px'}
                        />
                      )}
                  </Stack>
                </Stack>

                <Stack gap={0.5}>
                  <Typography
                    color={'#6F6C7D'}
                    lineHeight={1}
                    mt={0.25}
                    variant={'body2'}
                  >
                    {item.title || 'I am title'}
                  </Typography>
                  <Stack pb={2} pt={1.5}>
                    {item.step !== ProcessCreateChatEnum.search ? (
                      <>
                        {item.content && (
                          <Typography color={'#6F6C7D'} variant={'body2'}>
                            {item.content}
                          </Typography>
                        )}
                        {item.labels && (
                          <Stack
                            flexDirection={'row'}
                            flexWrap={'wrap'}
                            gap={1}
                          >
                            {item.labels.map((label, labelIndex) => (
                              <Typography
                                bgcolor={'#F7F4FD'}
                                borderRadius={1}
                                color={'#6F6C7D'}
                                key={`${label}-${item.id}-${index}-${labelIndex}`}
                                px={1.25}
                                py={0.25}
                                variant={'body3'}
                              >
                                {label}
                              </Typography>
                            ))}
                          </Stack>
                        )}
                      </>
                    ) : (
                      <>
                        <Stack flexDirection={'row'} gap={0.5}>
                          <Icon
                            component={ICON_LINKEDIN}
                            sx={{ width: 16, height: 16 }}
                          />
                          <Typography color={'#6F6C7D'} variant={'body3'}>
                            Searching Linkedin
                          </Typography>
                        </Stack>
                        <Stack flexDirection={'row'} gap={0.5} mt={1.5}>
                          <Icon
                            component={ICON_EARTH}
                            sx={{ width: 16, height: 16 }}
                          />
                          <Typography color={'#6F6C7D'} variant={'body3'}>
                            Doing deep internet research
                          </Typography>
                        </Stack>
                      </>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Fade>
          ))
        )}
      </Stack>
    </Stack>
  );
};
