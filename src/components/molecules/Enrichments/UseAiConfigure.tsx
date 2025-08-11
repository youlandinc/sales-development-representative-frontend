import {
  FormControlLabel,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import {
  StyledButton,
  StyledSelect,
  StyledTextField,
} from '@/components/atoms';
import {
  CollapseCard,
  SlateEditor,
  TiptapEditor,
} from '@/components/molecules';

import { useThrottleFn } from '@/hooks';

import { generatePrompt } from '@/request/enrichments/useAi';
import { MoreHoriz } from '@mui/icons-material';
import ICON_SPARKLE from './assets/icon_sparkle.svg';
import ICON_TEXT from './assets/icon_text.svg';
import ICON_WARNING from './assets/icon_warning.svg';
// import { useCompletion } from '@ai-sdk/react';

const initialValue = {
  type: 'object',
  properties: {
    CEO: {
      type: 'string',
      description: "Full name of the CEO or 'No CEO or LinkedIn profile found'",
    },
    LinkedIn_Profile: {
      type: 'string',
      description:
        "LinkedIn profile URL of the CEO or 'No CEO or LinkedIn profile found'",
    },
  },
  required: ['CEO', 'LinkedIn_Profile'],
};

export const UseAiConfigure = () => {
  const [outPuts, setOutPuts] = useState<'fields' | 'json'>('fields');
  const DEFAULT_PROMOT =
    '#CONTEXT#\nYou are tasked with finding a Java engineer associated with a given company or website, and extracting their professional profile and email address.\n\n#OBJECTIVE#\nIdentify a Java engineer related to {{Enrich Company}}, {{Domain}}, or {{Url}}, and extract their professional profile link (such as LinkedIn) and email address.\n\n#INSTRUCTIONS#\n1. Use the provided {{Enrich Company}}, {{Domain}}, or {{Url}} to search for employees or team members who are Java engineers (titles may include "Java Engineer," "Java Developer," or similar).\n2. Search LinkedIn, company team pages, or other professional directories for profiles matching the criteria.\n3. Extract the profile URL (preferably LinkedIn) and the email address if publicly available.\n4. If multiple Java engineers are found, return the first relevant result.\n5. If no Java engineer or email is found, return "No Java engineer found" or "No email found" as appropriate.\n\n#EXAMPLES#\nInput:\n  Enrich Company: Acme Corp\n  Domain: acmecorp.com\n  Url: https://acmecorp.com\n\nExpected Output:\n  Java Engineer Name: John Doe\n';
  const insertWithPlaceholders = (editor: any, text: string) => {
    // editor.commands.setContent('');

    const placeholderRegex = /{{(.*?)}}/g;
    let match;
    let lastIndex = 0;
    const paragraphs: any[] = [];
    let currentParagraphNodes: any[] = [];

    function flushParagraph() {
      if (currentParagraphNodes.length > 0) {
        paragraphs.push({
          type: 'paragraph',
          content: currentParagraphNodes,
        });
        currentParagraphNodes = [];
      }
    }

    while ((match = placeholderRegex.exec(text)) !== null) {
      const preText = text.slice(lastIndex, match.index);
      const lines = preText.split(/\r?\n/);

      lines.forEach((line, index) => {
        if (line) {
          currentParagraphNodes.push({ type: 'text', text: line });
        }
        if (index < lines.length - 1) {
          flushParagraph();
        }
      });

      // 插入 placeholder 占位符
      currentParagraphNodes.push({
        type: 'custom-placeholder',
        attrs: { label: match[1].trim() },
      });

      lastIndex = placeholderRegex.lastIndex;
    }

    // 处理最后一段（剩余文字）
    const remaining = text.slice(lastIndex);
    const remainingLines = remaining.split(/\r?\n/);
    remainingLines.forEach((line, index) => {
      if (line) {
        currentParagraphNodes.push({ type: 'text', text: line });
      }
      if (index < remainingLines.length - 1) {
        flushParagraph();
      }
    });

    flushParagraph(); // 收尾
    // 插入到 editor 中
    return paragraphs;
    // paragraphs.forEach((paragraph) => {
    //   editor.commands.insertContent(paragraph);
    // });
  };
  const defaultValue = insertWithPlaceholders(null, DEFAULT_PROMOT);

  // const {
  //   data: s,
  //   completion: a,
  //   isLoading: i,
  //   complete: r,
  // } = useCompletion({
  //   api: '/sdr/ai/generate',
  //   credentials: 'include',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: {
  //     module: 'COLUMN_ENRICHMENT_PROMPT',
  //     params: {
  //       useInput: "help me to find user's email and phone number",
  //       columns:
  //         'First Name,Last Name,Full Name,Job Title, Location,Company Name,LinkedIn Profile,University',
  //     },
  //   },
  //   // onError: (l) => n(l),
  //   // onFinish: (l, c) => t(l, c),
  //   streamProtocol: 'data',
  // });
  const [text, setText] = useState('');
  const fn = useThrottleFn((text: string) => {
    setText(text);
  }, 300);
  useEffect(() => {
    generatePrompt().then((response) => {
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let str = '';
        const readStream = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              return;
            }
            // decode
            const data = decoder.decode(value).replace(/data:/g, '');
            str = str + data;
            console.log(str);
            fn(str);
            // continue read stream
            readStream();
          });
        };
        readStream();
      }
    });
  }, []);

  return (
    <Stack gap={4}>
      <Typography>{text}</Typography>
      <Stack>
        <Typography fontWeight={700} variant={'subtitle1'}>
          Prompt
        </Typography>
        <TiptapEditor defaultValue={defaultValue} />
      </Stack>
      {/*outputs*/}
      <CollapseCard title={'Define outputs'}>
        <Stack gap={1.5}>
          <RadioGroup
            onChange={(e) => {
              setOutPuts((e.target as HTMLInputElement).value as any);
            }}
            value={outPuts}
          >
            <FormControlLabel
              control={<Radio />}
              label={'Fields'}
              value={'fields'}
            />
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <FormControlLabel
                control={<Radio />}
                label={'JSON Schema'}
                value={'json'}
              />
              <StyledButton
                color={'info'}
                size={'small'}
                startIcon={<Icon component={ICON_SPARKLE} />}
                variant={'outlined'}
              >
                Generate from prompt
              </StyledButton>
            </Stack>
          </RadioGroup>
          {outPuts === 'fields' && (
            <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
              <StyledTextField />
              <StyledSelect
                options={[
                  {
                    label: 'Text',
                    value: 'text',
                    key: 'text',
                  },
                ]}
                placeholder={'Text'}
                startAdornment={
                  <Icon component={ICON_TEXT} sx={{ width: 12, height: 12 }} />
                }
              />
              <MoreHoriz
                sx={{
                  fontSize: 20,
                  color: 'text.primary',
                  cursor: 'pointer',
                }}
              />
            </Stack>
          )}
          {outPuts === 'json' && (
            <SlateEditor
              initialValue={
                initialValue || {
                  type: 'object',
                  properties: {
                    response: {
                      type: 'string',
                    },
                  },
                  required: ['response'],
                }
              }
            />
          )}
        </Stack>
      </CollapseCard>
      {/*Run settings*/}
      <CollapseCard title={'Run settings'}>
        <Stack gap={1.5}>
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Typography variant={'subtitle1'}>Auto-update</Typography>
              <Tooltip
                title={
                  'Disable or enable automatic runs of this column on table updates.'
                }
              >
                <Icon component={ICON_WARNING} sx={{ width: 12, height: 12 }} />
              </Tooltip>
            </Stack>
            <Switch checked={true} />
          </Stack>
          {/*<Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>*/}
          {/*  <Typography variant={'subtitle1'}>Only run if</Typography>*/}
          {/*  <Tooltip title={'Only run if this formula resolves to true.'}>*/}
          {/*    <Icon component={ICON_WARNING} sx={{ width: 12, height: 12 }} />*/}
          {/*  </Tooltip>*/}
          {/*</Stack>*/}
          {/*<SlateEditor initialValue={{}} style={{ padding: '4px' }} />*/}
        </Stack>
      </CollapseCard>
    </Stack>
  );
};
