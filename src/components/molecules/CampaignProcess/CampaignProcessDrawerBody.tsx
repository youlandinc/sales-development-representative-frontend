import { ActionDispatch, FC, useState } from 'react';
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
  dispatchForm: ActionDispatch<any>;
  previewLeadId?: string | number;
}

export const CampaignProcessDrawerBody: FC<CampaignProcessDrawerBodyProps> = ({
  onClose,
  container,
  visible,
  formData,
  dispatchForm,
  previewLeadId,
}) => {
  const { messagingSteps, setMessagingSteps } = useDialogStore();

  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const onClickToGenerate = async () => {
    if (formData.bodyExamples.every((item) => !item)) {
      return;
    }

    const postData = {
      suggestedWordCount: formData.bodyWordCount || 0,
      contentExamples: formData.bodyExamples,
    };

    setGenerating(true);
    try {
      const { data } = await _updateStepEmailBodyInstructions(postData);
      dispatchForm({
        type: 'update',
        key: 'bodyInstructions',
        value: data,
      });

      const temp = JSON.parse(JSON.stringify(messagingSteps));
      const target = temp.findIndex(
        (item: ResponseCampaignMessagingStep) =>
          item.stepId === formData.stepId,
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
      stepId: formData.stepId,
      instructions: formData.bodyInstructions || '',
      examples: formData.bodyExamples,
      wordCount: formData.bodyWordCount || 0,
      callToAction: formData.bodyCallToAction || '',
      previewLeadId,
    };

    setRegenerating(true);
    try {
      const { data } = await _updateStepEmailBody(postData);
      const temp = JSON.parse(JSON.stringify(messagingSteps));
      const target = temp.findIndex(
        (item: ResponseCampaignMessagingStep) =>
          item.stepId === formData.stepId,
      );

      temp[target] = {
        ...temp[target],
        ...data,
        ...formData,
      };
      setMessagingSteps(temp);
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setRegenerating(false);
    }
  };

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
          minWidth: '800px !important',
          px: 3,
          py: 6,
        },
      }}
    >
      <Stack gap={3}>
        <Stack flexDirection={'row'}>
          <Typography variant={'subtitle1'}>Email body prompt</Typography>
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
          <Typography variant={'subtitle2'}>Suggested word count</Typography>
          <Slider
            marks={WORD_COUNT_OPTIONS}
            max={300}
            min={0}
            onChange={(_, v) => {
              dispatchForm({
                type: 'update',
                key: 'bodyWordCount',
                value: v,
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
                '&[data-index="11"]': {
                  display: 'none',
                },
              },
            }}
            value={formData.bodyWordCount || 0}
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
                formData.bodyExamples.every((item) => !item)
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
              dispatchForm({
                type: 'update',
                key: 'bodyInstructions',
                value: e.target.value,
              });
            }}
            placeholder={
              'Generate different email content based on the provided information.'
            }
            value={formData.bodyInstructions || ''}
          />
        </Stack>

        <Stack gap={1.5}>
          <Typography variant={'subtitle1'}>Call-to-action</Typography>

          <StyledTextField
            minRows={4}
            multiline
            onChange={(e) => {
              dispatchForm({
                type: 'update',
                key: 'bodyCallToAction',
                value: e.target.value,
              });
            }}
            placeholder={'Enter the link to schedule a demo meeting.'}
            value={formData.bodyCallToAction}
          />
        </Stack>

        {formData.bodyExamples.map((item, index) => (
          <Fade in={true} key={index}>
            <Stack gap={1.5}>
              <Stack alignItems={'flex-end'} flexDirection={'row'} height={32}>
                <Typography variant={'subtitle1'}>
                  Example #{index + 1}
                </Typography>
                {index !== formData.bodyExamples.length - 1 ? (
                  <Icon
                    component={ICON_TRASH}
                    onClick={() => {
                      dispatchForm({
                        type: 'removeItem',
                        index,
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
                      dispatchForm({
                        type: 'addItem',
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
                  dispatchForm({
                    type: 'updateItem',
                    value: e.target.value,
                    index,
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
