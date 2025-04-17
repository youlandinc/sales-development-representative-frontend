import { FC, useEffect, useState } from 'react';
import { Drawer, Fade, Icon, Slider, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { WORD_COUNT_OPTIONS } from '@/constant';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';

import {
  HttpError,
  ResponseCampaignMessagingStep,
  ResponseCampaignMessagingStepFormBody,
} from '@/types';
import {
  _updateStepEmailBody,
  _updateStepEmailBodyInstructions,
} from '@/request';

import ICON_CLOSE from './assets/icon_close.svg';
import ICON_TRASH from './assets/icon_trash.svg';

interface CampaignProcessDrawerBodyProps {
  onClose: () => void;
  container: Element | null;
  visible: boolean;
  formData: ResponseCampaignMessagingStepFormBody;
  previewLeadId?: string | number;
  onChangeTemplate: (value: any) => void;
}

export const CampaignProcessDrawerBody: FC<CampaignProcessDrawerBodyProps> = ({
  onClose,
  container,
  visible,
  formData,
  previewLeadId,
  onChangeTemplate,
}) => {
  const { messagingSteps, setMessagingSteps } = useDialogStore();

  const [insideFormData, setInsideFormData] = useState(formData);

  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const onClickToGenerate = async () => {
    if (insideFormData.bodyExamples.every((item) => !item)) {
      return;
    }

    const postData = {
      suggestedWordCount: insideFormData.bodyWordCount || 0,
      contentExamples: insideFormData.bodyExamples,
    };

    setGenerating(true);
    try {
      const { data } = await _updateStepEmailBodyInstructions(postData);
      setInsideFormData({
        ...insideFormData,
        bodyInstructions: data,
      });

      const temp = JSON.parse(JSON.stringify(messagingSteps));
      const target = temp.findIndex(
        (item: ResponseCampaignMessagingStep) =>
          item.stepId === insideFormData.stepId,
      );

      temp[target] = {
        ...temp[target],
        bodyInstructions: data,
      };
      setMessagingSteps(temp);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setGenerating(false);
    }
  };

  const onClickToRegenerate = async () => {
    if (!previewLeadId) {
      return;
    }
    const postData = {
      stepId: insideFormData.stepId,
      instructions: insideFormData.bodyInstructions || '',
      examples: insideFormData.bodyExamples,
      wordCount: insideFormData.bodyWordCount || 0,
      callToAction: insideFormData.bodyCallToAction || '',
      previewLeadId,
    };

    setRegenerating(true);
    try {
      const { data } = await _updateStepEmailBody(postData);
      const temp = JSON.parse(JSON.stringify(messagingSteps));
      const target = temp.findIndex(
        (item: ResponseCampaignMessagingStep) =>
          item.stepId === insideFormData.stepId,
      );

      temp[target] = {
        ...temp[target],
        ...data,
        ...insideFormData,
      };

      onChangeTemplate(data);

      setMessagingSteps(temp);
      onClose();
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => {
    setInsideFormData(formData);
  }, [formData]);

  return (
    <Drawer
      anchor={'right'}
      container={container}
      keepMounted
      open={visible}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: '1200px !important',
          px: 3,
          py: 6,
        },
      }}
    >
      <Stack gap={3}>
        <Stack flexDirection={'row'}>
          <Typography variant={'h5'}>Email body prompt</Typography>
          <Icon
            component={ICON_CLOSE}
            onClick={onClose}
            sx={{
              width: 16,
              height: 16,
              ml: 'auto',
              cursor: 'pointer',
            }}
          />
        </Stack>

        <Stack gap={1.5}>
          <Typography variant={'subtitle1'}>
            Suggested word count : {insideFormData.bodyWordCount}
          </Typography>
          <Slider
            marks={WORD_COUNT_OPTIONS}
            max={400}
            min={100}
            onChange={(_, v) => {
              setInsideFormData({
                ...insideFormData,
                bodyWordCount: v as number,
              });
            }}
            step={1}
            sx={{
              height: 4,
              '& .MuiSlider-thumb': {
                height: 20,
                width: 20,
                bgcolor: '#6E4EFB',
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'inherit',
                },
                '&::before': {
                  display: 'none',
                },
              },
              '& .MuiSlider-rail': {
                bgcolor: '#6E4EFB',
                opacity: 0.32,
              },
              '& .MuiSlider-track': {
                bgcolor: '#6E4EFB',
              },
              '.MuiSlider-mark': {
                width: 4,
                height: 4,
                borderRadius: '50%',
                transform: 'translateY(-50%)',
              },
            }}
            value={insideFormData.bodyWordCount || 100}
            valueLabelDisplay={'auto'}
          />
        </Stack>

        <Stack gap={1.5}>
          <Stack alignItems={'flex-end'} flexDirection={'row'}>
            <Typography variant={'subtitle1'}>Instructions</Typography>
            <StyledButton
              color={'info'}
              disabled={
                regenerating ||
                generating ||
                insideFormData.bodyExamples.every((item) => !item)
              }
              loading={generating}
              onClick={() => onClickToGenerate()}
              size={'medium'}
              sx={{ ml: 'auto', width: 200 }}
              variant={'outlined'}
            >
              Generate from examples
            </StyledButton>
          </Stack>
          <StyledTextField
            disabled={generating || regenerating}
            minRows={6}
            multiline
            onChange={(e) => {
              setInsideFormData({
                ...insideFormData,
                bodyInstructions: e.target.value,
              });
            }}
            placeholder={
              'Generate different email content based on the provided information.'
            }
            value={insideFormData.bodyInstructions || ''}
          />
        </Stack>

        <Stack gap={1.5}>
          <Typography variant={'subtitle1'}>Call-to-action</Typography>

          <StyledTextField
            minRows={4}
            multiline
            onChange={(e) => {
              setInsideFormData({
                ...insideFormData,
                bodyCallToAction: e.target.value,
              });
            }}
            placeholder={'Enter the link to schedule a demo meeting.'}
            value={insideFormData.bodyCallToAction}
          />
        </Stack>

        {insideFormData.bodyExamples.map((item, index) => (
          <Fade in={true} key={index}>
            <Stack gap={1.5}>
              <Stack alignItems={'flex-end'} flexDirection={'row'} height={32}>
                <Typography variant={'subtitle1'}>
                  Example #{index + 1}
                </Typography>
                {index !== insideFormData.bodyExamples.length - 1 ? (
                  <Icon
                    component={ICON_TRASH}
                    onClick={() => {
                      setInsideFormData({
                        ...insideFormData,
                        bodyExamples: insideFormData.bodyExamples.filter(
                          (_, child) => child !== index,
                        ),
                      });
                    }}
                    sx={{
                      width: 20,
                      height: 20,
                      cursor: 'pointer',
                      ml: 'auto',
                    }}
                  />
                ) : (
                  <StyledButton
                    color={'info'}
                    onClick={() => {
                      setInsideFormData({
                        ...insideFormData,
                        bodyExamples: [...insideFormData.bodyExamples, ''],
                      });
                    }}
                    size={'medium'}
                    sx={{ ml: 'auto' }}
                    variant={'outlined'}
                  >
                    Add example
                  </StyledButton>
                )}
              </Stack>

              <StyledTextField
                disabled={generating || regenerating}
                minRows={4}
                multiline
                onChange={(e) => {
                  setInsideFormData({
                    ...insideFormData,
                    bodyExamples: insideFormData.bodyExamples.map(
                      (item, child) => {
                        if (child === index) {
                          return e.target.value;
                        }
                        return item;
                      },
                    ),
                  });
                }}
                placeholder={'Generate similar content based on the template.'}
                value={item}
              />
            </Stack>
          </Fade>
        ))}

        <Stack flexDirection={'row'} gap={3}>
          <StyledButton
            disabled={regenerating || generating}
            loading={regenerating}
            onClick={() => onClickToRegenerate()}
            sx={{ width: 204 }}
          >
            + Close & regenerate
          </StyledButton>
          <StyledButton
            color={'info'}
            disabled={regenerating || generating}
            onClick={onClose}
            variant={'outlined'}
          >
            Close & disregard
          </StyledButton>
        </Stack>
      </Stack>
    </Drawer>
  );
};
