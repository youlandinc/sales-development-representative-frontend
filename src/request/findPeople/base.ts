import { post } from '@/request/request';

export const _fetchFindPeople = (param: { limit: number }) => {
  return post<{
    peopleCount: number;
    peopleList: {
      id: string;
      name: string;
      companyName: string;
      jobTitle: string;
      linkedinUrl: string;
      location: string;
    }[];
  }>('/sdr/prospect/find/people', param);
};

export const _createTableByFindPeople = (param: Record<string, any>) => {
  return post<string>('/sdr/prospect/table/people', param);
};
