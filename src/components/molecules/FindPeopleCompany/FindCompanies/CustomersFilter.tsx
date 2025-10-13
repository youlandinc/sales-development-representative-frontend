import {
  FilterSelect,
  FilterTextField,
} from '../Common';
import { CollapsePanel } from '@/components/molecules';

import { computedFilterCount } from '@/utils';
import { COMPANY_INDUSTRIES, COMPANY_SIZE, FUNDING_AMOUNT } from '@/constant';
import { useFindCompaniesStore } from '@/stores/useFindPeopleCompanyStore/useFindCompaniesStore';

export const CustomersFilter = () => {
  const { filters, setFilters } = useFindCompaniesStore((state) => state);

  return (
    <CollapsePanel
      defaultOpen
      filterCount={computedFilterCount([
        filters.companyIndustriesInclude,
        filters.companyIndustriesExclude,
        filters.companySizes,
        filters.companyDescriptionKeywords,
        filters.companyDescriptionKeywordsExclude,
        filters.fundingAmount,
      ])}
      title={'Company attributes'}
    >
      <FilterSelect
        onChange={(_, value) => {
          setFilters('companyIndustriesInclude', value);
        }}
        options={COMPANY_INDUSTRIES}
        placeholder={'e.g. Software development'}
        title={'Industries to include'}
        value={filters.companyIndustriesInclude as Option[]}
      />
      <FilterSelect
        onChange={(_, value) => {
          setFilters('companyIndustriesExclude', value);
        }}
        options={COMPANY_INDUSTRIES}
        placeholder={'e.g. Advertising services'}
        title={'Industries to exclude'}
        value={filters.companyIndustriesExclude as Option[]}
      />
      <FilterSelect
        onChange={(_, value) => {
          setFilters('companySizes', value);
        }}
        options={COMPANY_SIZE}
        placeholder={'e.g. 11-50 employees'}
        title={'Company sizes'}
        value={filters.companySizes as Option[]}
      />
      <FilterSelect
        onChange={(_, value) => {
          setFilters('fundingAmount', value);
        }}
        options={FUNDING_AMOUNT}
        placeholder={'e.g. $5M - $10M'}
        title={'Funding amount'}
        value={filters.fundingAmount as Option[]}
      />

      <FilterTextField
        onChange={(value) => {
          setFilters('companyDescriptionKeywords', value);
        }}
        placeholder={'e.g. sales, data, outbound'}
        title={'Description keywords to include'}
        value={filters.companyDescriptionKeywords as Option[]}
      />
      <FilterTextField
        onChange={(value) => {
          setFilters('companyDescriptionKeywordsExclude', value);
        }}
        placeholder={'e.g. agency, marketing'}
        title={'Description keywords to exclude'}
        value={filters.companyDescriptionKeywordsExclude as Option[]}
      />
    </CollapsePanel>
  );
};
