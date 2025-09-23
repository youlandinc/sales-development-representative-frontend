import {get, post} from '@/request/request';

export const _findCompanies = (param: Record<string, any>) => {
    return post<{
        companyCount: number;
        companyList: {
            name: null | string;
            description: null | string;
            primaryIndustry: null | string;
            size: null | string;
            type: null | string;
            location: null | string;
            country: null | string;
            linkedUrl: null | string;
            aum: null | string;
            fundType: null | string;
            fundSize: null | string;
            domain: null | string;
            primaryInvestorType: null | string;
        }[];
    }>('/sdr/prospect/find/companies', param);
};

export const _createTableByFindCompanies = (param: Record<string, any>) => {
    return post<string>('/sdr/prospect/table/company', param);
};

export const _fetchIndustries = () => {
    return get<Option[]>('/sdr/prospect/options/industry');
};

export const _fetchFundType = () => {
    return get<Option[]>('/sdr/prospect/options/fund_type');
};
