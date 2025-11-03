import { patch, post } from '../request';

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

export const columnRun = (param: {
  tableId: string;
  recordCount?: number;
  recordIds?: string[];
  fieldId?: string;
  fieldIds?: string[];
}) => {
  return post(`/sdr/prospect/table/${param.tableId}/field/run`, {
    fieldId: param.fieldId,
    fieldIds: param.fieldIds,
    recordCount: param.recordCount,
    recordIds: param.recordIds,
  });
};

export const _saveWebResearchConfig = (
  tableId: string,
  prompt: string,
  schema: string,
  excludeFields: string[][],
  generatePrompt: string,
) => {
  return post<string>('/sdr/prospect/table/field', {
    tableId,
    actionKey: 'use-ai',
    fieldType: 'TEXT',
    fieldName: 'Use AI',
    typeSettings: {
      inputBinding: [
        //configure prompt
        {
          name: 'prompt',
          formulaText: prompt,
        },
        //configure schema
        {
          name: 'answerSchemaType',
          formulaText: schema,
        },
        //generate prompt
        {
          name: 'metaprompt',
          formulaText: generatePrompt,
        },
      ],
      optionalPathsInInputs: {
        prompt: excludeFields,
      },
    },
  });
};

export const updateWebResearchConfig = (param: {
  tableId: string;
  fieldId: string;
  prompt: string;
  schema: string;
  generatePrompt: string;
}) => {
  return patch('/sdr/prospect/table/aiField', {
    tableId: param.tableId,
    fieldId: param.fieldId,
    typeSettings: {
      inputBinding: [
        {
          name: 'prompt',
          formulaText: param.prompt,
        },
        //configure schema
        {
          name: 'answerSchemaType',
          formulaText: param.schema,
        },
        //generate prompt
        {
          name: 'metaprompt',
          formulaText: param.generatePrompt,
        },
      ],
    },
  });
};
