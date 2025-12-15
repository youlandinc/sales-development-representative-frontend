import { get, patch, post } from '../request';
import { FetchWebResearchModelListResponse } from '@/types/enrichment/webResearch';

export const generatePrompt = (api: string, param: Record<string, any>) => {
  //TODO
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${api}`, {
    // return fetch(`${api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param),
  });
};

export const columnRun = (param: {
  tableId: string;
  recordCount?: number;
  recordIds?: string[];
  fieldId?: string;
  fieldIds?: string[];
}) => {
  return post(`/sdr/table/field/${param.tableId}/run`, {
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
  return post<string>('/sdr/table/field/add', {
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
  return patch('/sdr/table/field/aiField', {
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

export const _fetchWebResearchModelList = () => {
  return get<FetchWebResearchModelListResponse>('/aiResearch/model/list');
};
