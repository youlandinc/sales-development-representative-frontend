import ICON_SUGGESTIONS from '../../assets/dialog/headerActions/icon_suggestions.svg';
import ICON_WORK_EMAIL from '../../assets/dialog/headerActions/icon_suggestions_work_email.svg';
import ICON_PHONE_NUMBER from '../../assets/dialog/headerActions/icon_suggestions_phone_number.svg';
import ICON_AI from '../../assets/dialog/icon_sparkle.svg';

export const ENRICHMENTS_SUGGESTION_CHILDREN = [
  {
    icon: ICON_WORK_EMAIL,
    title: 'Work Email',
    description:
      'Discover new prospects that match your ideal customer profile.',
  },
  {
    icon: ICON_PHONE_NUMBER,
    title: 'Phone Number',
    description:
      'Keep your prospect information accurate and up-to-date with the latest details.',
  },
];

export const ENRICHMENTS_AI_CHILDREN = [
  {
    icon: 'spark',
    title: 'Generate personalized outreach',
    description:
      'Create tailored messages for your prospects using AI-driven insights.',
  },
];

export const ENRICHMENTS_MENUS = [
  {
    icon: ICON_SUGGESTIONS,
    title: 'Suggestions',
    children: ENRICHMENTS_SUGGESTION_CHILDREN,
  },
  {
    icon: ICON_AI,
    title: 'AI',
    children: ENRICHMENTS_AI_CHILDREN,
  },
];
