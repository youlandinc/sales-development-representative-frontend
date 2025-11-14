import { ProcessCreateTypeEnum } from '@/types';

export const titleTail = (
  campaignType: ProcessCreateTypeEnum | undefined | null | string,
) => {
  switch (campaignType) {
    case ProcessCreateTypeEnum.ai_table:
      return 'Use saved table';
    case ProcessCreateTypeEnum.csv:
      return 'Upload CSV';
    case ProcessCreateTypeEnum.crm:
      return 'Use CRM list';
    //case ProcessCreateTypeEnum.filter:
    //  return 'Filter and select audience';
    //case ProcessCreateTypeEnum.agent:
    //  return 'Agent';
    //case ProcessCreateTypeEnum.saved_list:
    //  return 'Use saved list';
    default:
      return '';
  }
};
