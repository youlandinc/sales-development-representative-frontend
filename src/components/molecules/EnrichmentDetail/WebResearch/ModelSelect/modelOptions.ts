import { ModelGroupItem } from './ModelSelect';

// TODO: Replace with actual icons when available
// import ICON_VERITY from '../assets/icon_verity.svg';
// import ICON_OPENAI from '../assets/icon_openai.svg';
// import ICON_ANTHROPIC from '../assets/icon_anthropic.svg';
// import ICON_GOOGLE from '../assets/icon_google.svg';
// import ICON_XAI from '../assets/icon_xai.svg';
// import ICON_DEEPSEEK from '../assets/icon_deepseek.svg';

export const MODEL_OPTIONS: ModelGroupItem[] = [
  {
    groupLabel: 'Corepass',
    options: [
      {
        value: 'verity_lite',
        label: 'Verity Lite',
        description:
          'A lightweight model optimized for fast, high-precision data extraction.',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
      },
      {
        value: 'verity_core',
        label: 'Verity Core',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description:
          'A balanced, mid-sized model designed for research, synthesis, and high-quality structured reasoning.',
      },
      {
        value: 'verity_max',
        label: 'Verity Max',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description:
          'A large, reasoning-focused model built for deep analysis, traceable logic, and truth-first decision making.',
      },
    ],
  },
  {
    groupLabel: 'OpenAI',
    options: [
      {
        value: 'gpt_5_1',
        label: 'GPT-5.1',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description: 'Most advanced GPT-5 with superior reasoning.',
        inputCredits: 2,
        outputCredits: 8,
      },
      {
        value: 'gpt_5_mini',
        label: 'GPT-5 Mini',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description: 'Efficient and balanced GPT-5 variant.',
        inputCredits: 0.4,
        outputCredits: 1,
      },
      {
        value: 'gpt_5_nano',
        label: 'GPT-5 Nano',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description: 'Fastest & lightest GPT-5.',
        inputCredits: 0.2,
        outputCredits: 0.5,
      },
    ],
  },
  {
    groupLabel: 'Anthropic',
    options: [
      {
        value: 'claude_sonnet_4_5',
        label: 'Claude Sonnet 4.5',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description:
          'Best model for complex agents and coding, highest intelligence across most tasks, superior tool orchestration for long-running autonomous tasks',
        inputCredits: 1,
        outputCredits: 3,
      },
      {
        value: 'claude_haiku_4_5',
        label: 'Claude Haiku 4.5',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description:
          'Near-frontier performance with lightning-fast speed and extended thinking - our fastest and most intelligent Haiku model at the most economical price point',
        inputCredits: 1,
        outputCredits: 3,
      },
      {
        value: 'claude_opus_4_5',
        label: 'Claude Opus 4.5',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description:
          'Maximum intelligence with practical performance for complex specialized tasks',
        inputCredits: 1,
        outputCredits: 3,
      },
      {
        value: 'claude_opus_4_1',
        label: 'Claude Opus 4.1',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
        description:
          'Exceptional intelligence and reasoning for specialized complex tasks',
        inputCredits: 1,
        outputCredits: 3,
      },
    ],
  },
  {
    groupLabel: 'Google',
    options: [
      {
        value: 'gemini_3_pro',
        label: 'Gemini 3 Pro',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
      },
      {
        value: 'gemini_2_5_pro',
        label: 'Gemini 2.5 Pro',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
      },
      {
        value: 'gemini_2_5_flash',
        label: 'Gemini 2.5 Flash',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
      },
      {
        value: 'gemini_2_5_flash_lite',
        label: 'Gemini 2.5 Flash-Lite',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
      },
    ],
  },
  {
    groupLabel: 'xAI',
    options: [
      {
        value: 'grok_4',
        label: 'Grok 4',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
      },
      {
        value: 'grok_4_fast',
        label: 'Grok 4 Fast',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
      },
    ],
  },
  {
    groupLabel: 'DeepSeek',
    options: [
      {
        value: 'deepseek_r2',
        label: 'DeepSeek R2',
        description: 'Reasoning model that displays its chain of thought.',
        inputCredits: 1.5,
        outputCredits: '-',
        logoUrl:
          'https://public-storage-hub.s3.us-west-1.amazonaws.com/reversecontact_9075022371.png',
      },
    ],
  },
];
