import { ActionDispatch, FC, useState } from 'react';
import { Drawer, Fade, Icon, Stack, Typography } from '@mui/material';

import { useDialogStore } from '@/stores/useDialogStore';

import { SDRToast, StyledButton, StyledTextField } from '@/components/atoms';

import {
  HttpError,
  ResponseCampaignMessagingStep,
  ResponseCampaignMessagingStepFormSubject,
} from '@/types';
import {
  _updateStepEmailSubject,
  _updateStepEmailSubjectInstructions,
} from '@/request';

import ICON_CLOSE from './assets/icon_close.svg';
import ICON_TRASH from './assets/icon_trash.svg';

interface CampaignProcessDrawerSubjectProps {
  onClose: () => void;
  container: Element | null;
  visible: boolean;
  formData: ResponseCampaignMessagingStepFormSubject;
  dispatchForm: ActionDispatch<any>;
  previewLeadId?: string | number;
  onChangeTemplate: (value: any) => void;
}

export const CampaignProcessDrawerSubject: FC<
  CampaignProcessDrawerSubjectProps
> = ({
  onClose,
  container,
  visible,
  formData,
  dispatchForm,
  previewLeadId,
  onChangeTemplate,
}) => {
  const { messagingSteps, setMessagingSteps } = useDialogStore();

  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const onClickToGenerate = async () => {
    const postData = {
      subjectExamples: formData.subjectExamples,
    };

    setGenerating(true);
    try {
      const { data } = await _updateStepEmailSubjectInstructions(postData);
      dispatchForm({
        type: 'update',
        key: 'subjectInstructions',
        value: data,
      });

      const temp = JSON.parse(JSON.stringify(messagingSteps));
      const target = temp.findIndex(
        (item: ResponseCampaignMessagingStep) =>
          item.stepId === formData.stepId,
      );

      temp[target] = {
        ...temp[target],
        subjectInstructions: data,
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
      instructions: formData.subjectInstructions || '',
      examples: formData.subjectExamples,
      previewLeadId,
    };

    setRegenerating(true);
    try {
      const { data } = await _updateStepEmailSubject(postData);

      const temp = JSON.parse(JSON.stringify(messagingSteps));
      const index = temp.findIndex(
        (item: ResponseCampaignMessagingStep) =>
          item.stepId === formData.stepId,
      );

      temp[index] = {
        ...messagingSteps[index],
        ...data,
        ...formData,
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
          <Typography variant={'h5'}>Subject line prompt</Typography>
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
          <Stack alignItems={'flex-end'} flexDirection={'row'}>
            <Typography variant={'subtitle1'}>Instructions</Typography>
            <StyledButton
              color={'info'}
              disabled={
                generating ||
                regenerating ||
                formData.subjectExamples.every((item) => !item)
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
                key: 'subjectInstructions',
                value: e.target.value,
              });
            }}
            placeholder={
              'Generate different email content based on the provided information.'
            }
            value={formData.subjectInstructions}
          />
        </Stack>

        {formData.subjectExamples.map((item, index) => (
          <Fade in={true} key={`subject-${index}`}>
            <Stack gap={1.5}>
              <Stack alignItems={'flex-end'} flexDirection={'row'} height={32}>
                <Typography variant={'subtitle1'}>
                  Example #{index + 1}
                </Typography>
                {index !== formData.subjectExamples.length - 1 ? (
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
