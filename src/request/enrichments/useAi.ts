import { post } from '../request';

export const generatePrompt = (api: string, param: Record<string, any>) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param),
  }); /*  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sdr/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      module: 'COLUMN_ENRICHMENT_PROMPT',
      params: {
        useInput: "help me to find user's email and phone number",
        columns:
          'First Name,Last Name,Full Name,Job Title, Location,Company Name,LinkedIn Profile,University',
      },
    }),
  });*/
};

export const columnRun = (fieldId: string, recordCount: number) => {
  return post('/sdr/prospect/table/field/run', {
    fieldId,
    recordCount,
  });
};

export const _saveWebResearchConfig = (
  tableId: string,
  prompt: string,
  schema: string,
) => {
  return post<string>('/sdr/prospect/table/field', {
    tableId,
    actionKey: 'use-ai',
    fieldType: 'TEXT',
    fieldName: 'Use AI',
    typeSettings: {
      inputBinding: [
        {
          name: 'prompt',
          formulaText: prompt,
        },
        {
          name: 'answerSchemaType',
          formulaText: schema,
        },
      ],
    },
  });
};
