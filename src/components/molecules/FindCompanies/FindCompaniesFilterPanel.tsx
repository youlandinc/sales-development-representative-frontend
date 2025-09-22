import { Stack } from '@mui/material';
import {
  CollapsePanel,
  CompanyTypeFilter,
  CustomersFilter,
  LimitedPartnerFilter,
  VentureCapitalFilter,
} from '@/components/molecules';
import { FilterContainer } from '@/components/molecules/FindPeople/FilterItem';
import { StyledButton, StyledTextFieldNumber } from '@/components/atoms';
import { LocationFilter } from '@/components/molecules/FindPeople';

import { computedFilterCount } from '@/utils';
import {
  CompanyFilterKeysType,
  useFindCompaniesStore,
} from '@/stores/useFindCompiesStore';
import { CompanyTypeEnum } from '@/types';

export const FindCompaniesFilterPanel = () => {
  const { filters, setFilters } = useFindCompaniesStore((state) => state);

  return (
    <Stack borderRight={'1px solid #E5E5E5'}>
      <Stack
        gap={3}
        height={'100%'}
        maxWidth={450}
        minWidth={450}
        overflow={'auto'}
        p={3}
      >
        <CompanyTypeFilter />
        {filters.companyType === CompanyTypeEnum.customer && (
          <CustomersFilter />
        )}
        {filters.companyType === CompanyTypeEnum.venture_capital && (
          <VentureCapitalFilter />
        )}
        {filters.companyType === CompanyTypeEnum.limited_partners && (
          <LimitedPartnerFilter />
        )}
        <LocationFilter
          defaultValue={filters}
          filterCount={computedFilterCount([
            filters.locationCountriesInclude,
            filters.locationCountriesExclude,
            filters.locationCitiesInclude,
            filters.locationCitiesExclude,
          ])}
          onChange={(key, value) => {
            setFilters(key as CompanyFilterKeysType, value);
          }}
          type={'find_company'}
        />
        <CollapsePanel
          filterCount={computedFilterCount([
            filters.limit,
            filters.limitPerCompany,
          ])}
          title={'Limit results'}
        >
          <FilterContainer
            subTitle={'1000 record max per search'}
            title={'Limit'}
          >
            <StyledTextFieldNumber
              decimalScale={0}
              isAllowed={({ floatValue }) => {
                return (floatValue || 0) <= 1000;
              }}
              onValueChange={({ floatValue }) => {
                setFilters('limit', floatValue);
              }}
              placeholder={'e.g.10'}
              value={(filters.limit as number) || ''}
            />
          </FilterContainer>
        </CollapsePanel>
      </Stack>
      <Stack
        borderTop={'1px solid #E5E5E5'}
        flexDirection={'row'}
        justifyContent={'flex-end'}
        px={3}
        py={1.5}
      >
        <StyledButton
          // disabled={disabled}
          // loading={state.loading}
          // onClick={createTableByFindPeople}
          size={'medium'}
          sx={{
            width: 92,
          }}
          variant={'contained'}
        >
          Continue
        </StyledButton>
      </Stack>
    </Stack>
  );
};
