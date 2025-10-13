import { useEffect } from 'react';
import { CollapsePanel } from '@/components/molecules';
import { FilterSelect } from '@/components/molecules/FindPeople/FilterItem';

import { computedFilterCount } from '@/utils';
import { ASSETS_UNDER_MANAGEMENT } from '@/constant';
import { useFindCompaniesStore } from '@/stores/useFindPeopleCompanyStore/useFindCompaniesStore';

export const LimitedPartnerFilter = () => {
  const {
    filters,
    setFilters,
    industriesOpts,
    fundTypeOpts,
    fetchIndustries,
    fetchFundType,
  } = useFindCompaniesStore((state) => state);

  useEffect(() => {
    fetchIndustries();
    fetchFundType();
  }, [fetchIndustries]);

  return (
    <CollapsePanel
      defaultOpen
      filterCount={computedFilterCount([
        filters.companyIndustriesInclude,
        filters.companyIndustriesExclude,
        filters.aum,
      ])}
      title={'Company attributes'}
    >
      <FilterSelect
        onChange={(_, value) => {
          setFilters('companyIndustriesInclude', value);
        }}
        options={industriesOpts}
        placeholder={'e.g. Capital Markets'}
        title={'Firm type (to include)'}
        value={filters.companyIndustriesInclude as Option[]}
      />
      <FilterSelect
        onChange={(_, value) => {
          setFilters('companyIndustriesExclude', value);
        }}
        options={industriesOpts}
        placeholder={'e.g. Private Equity'}
        title={'Firm type (to exclude)'}
        value={filters.companyIndustriesExclude as Option[]}
      />
      <FilterSelect
        onChange={(_, value) => {
          setFilters('fundType', value);
        }}
        options={fundTypeOpts}
        placeholder={'e.g. Hedge funds'}
        title={'Fund type'}
        value={filters.fundType as Option[]}
      />
      <FilterSelect
        onChange={(_, value) => {
          setFilters('aum', value);
        }}
        options={ASSETS_UNDER_MANAGEMENT}
        placeholder={'e.g. $50M - 100M'}
        title={'Assets under management'}
        value={filters.aum as Option[]}
      />
    </CollapsePanel>
  );
};
