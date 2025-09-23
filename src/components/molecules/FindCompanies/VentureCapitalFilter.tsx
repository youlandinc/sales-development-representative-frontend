import { useEffect } from 'react';

import { FilterSelect } from '@/components/molecules/FindPeople/FilterItem';
import { CollapsePanel } from '@/components/molecules';

import { ASSETS_UNDER_MANAGEMENT } from '@/constant';
import { useFindCompaniesStore } from '@/stores/useFindCompiesStore';
import { computedFilterCount } from '@/utils';

export const VentureCapitalFilter = () => {
  const { filters, setFilters, industriesOpts, fetchIndustries } =
    useFindCompaniesStore((state) => state);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  return (
    <CollapsePanel
      defaultOpen
      filterCount={computedFilterCount([
        filters.companyIndustriesInclude,
        filters.companyIndustriesExclude,
        filters.fundingAmount,
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
