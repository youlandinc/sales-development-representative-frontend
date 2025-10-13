import { Stack } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import { FC, useEffect } from 'react';

import {
  SDRToast,
  StyledButton,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { CollapsePanel, CompanyTypeFilter } from '@/components/molecules';
import { FilterContainer, FilterSelect, FilterTextField } from './FilterItem';

import { COMPANY_INDUSTRIES } from '@/constant';
import { _createTableByFindPeople } from '@/request';

import { useAsyncFn } from '@/hooks';
import {
  DEFAULT_FILTER,
  useFindPeopleStore,
} from '@/stores/useFindPeopleCompanyStore/useFindPeopleStore';
import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import { FilterElementTypeEnum, FilterItem, HttpError } from '@/types';

import { computedFilterCount, handleParam } from '@/utils';

type FindPeopleFilterPanelProps = {
  disabled?: boolean;
};

export const FindPeopleFilterPanel: FC<FindPeopleFilterPanelProps> = ({
  disabled,
}) => {
  const { filters, setFilters } = useFindPeopleStore((state) => state);
  const { filters: tempFilters } = useFindPeopleCompanyStore((state) => state);
  const router = useRouter();

  const [state, createTableByFindPeople] = useAsyncFn(async () => {
    try {
      const { data } = await _createTableByFindPeople(handleParam(filters));
      router.push(`/prospect-enrich/${data}`);
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [filters]);

  const computedComponent = (
    type: FilterElementTypeEnum,
    params: FilterItem,
  ) => {
    if (type === FilterElementTypeEnum.select) {
      return (
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              companyIndustriesInclude: value,
            });
          }}
          options={COMPANY_INDUSTRIES}
          placeholder={'e.g. Software development'}
          title={params.formLabel}
          value={filters.companyIndustriesInclude as Option[]}
        />
      );
    }
    if (type === FilterElementTypeEnum.input && params.inputType === 'NUMBER') {
      return (
        <FilterContainer subTitle={params.description} title={params.formLabel}>
          <StyledTextFieldNumber
            decimalScale={0}
            isAllowed={({ floatValue }) => {
              return (floatValue || 0) <= 1000;
            }}
            onValueChange={({ floatValue }) => {
              setFilters({
                ...filters,
                limit: floatValue,
              });
            }}
            placeholder={'e.g.10'}
            value={(filters.limit as number) || ''}
          />
        </FilterContainer>
      );
    }
    if (type === FilterElementTypeEnum.input && params.inputType === 'TEXT') {
      return <FilterTextField title={params.formLabel} />;
    }
    if (type === FilterElementTypeEnum.checkbox) {
      return <FilterTextField title={params.formLabel} />;
    }
    if (type === FilterElementTypeEnum.radio) {
      return <FilterTextField title={params.formLabel} />;
    }
    if (type === FilterElementTypeEnum.between) {
      return <FilterTextField title={params.formLabel} />;
    }
    return null;
  };

  useEffect(() => {
    return () => {
      setFilters(DEFAULT_FILTER);
    };
  }, []);

  console.log(tempFilters);

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
        <CompanyTypeFilter title={'Contact category'} />
        <>
          {Object.entries(tempFilters).map(([title, value], index) => (
            <CollapsePanel
              defaultOpen
              filterCount={computedFilterCount([
                filters.companyIndustriesInclude,
                filters.companyIndustriesExclude,
                filters.companySizes,
                filters.companyDescriptionKeywords,
                filters.companyDescriptionKeywordsExclude,
              ])}
              title={title}
            >
              {value.map((i, k) => computedComponent(i.formType, i))}
            </CollapsePanel>
          ))}
        </>
        {/* <CollapsePanel
          defaultOpen
          filterCount={computedFilterCount([
            filters.companyIndustriesInclude,
            filters.companyIndustriesExclude,
            filters.companySizes,
            filters.companyDescriptionKeywords,
            filters.companyDescriptionKeywordsExclude,
          ])}
          title={'Company attributes'}
        >
          <FilterSelect
            onChange={(_, value) => {
              setFilters({
                ...filters,
                companyIndustriesInclude: value,
              });
            }}
            options={COMPANY_INDUSTRIES}
            placeholder={'e.g. Software development'}
            title={'Industries to include'}
            value={filters.companyIndustriesInclude as Option[]}
          />
          <FilterSelect
            onChange={(_, value) => {
              setFilters({
                ...filters,
                companyIndustriesExclude: value,
              });
            }}
            options={COMPANY_INDUSTRIES}
            placeholder={'e.g. Advertising services'}
            title={'Industries to exclude'}
            value={filters.companyIndustriesExclude as Option[]}
          />
          <FilterSelect
            onChange={(_, value) => {
              setFilters({
                ...filters,
                companySizes: value,
              });
            }}
            options={COMPANY_SIZE}
            placeholder={'e.g. 11-50 employees'}
            title={'Company sizes'}
            value={filters.companySizes as Option[]}
          />
          <FilterTextField
            onChange={(value) => {
              setFilters({
                ...filters,
                companyDescriptionKeywords: value,
              });
            }}
            placeholder={'e.g. sales, data, outbound'}
            title={'Description keywords to include'}
            value={filters.companyDescriptionKeywords as Option[]}
          />
          <FilterTextField
            onChange={(value) => {
              setFilters({
                ...filters,
                companyDescriptionKeywordsExclude: value,
              });
            }}
            placeholder={'e.g. agency, marketing'}
            title={'Description keywords to exclude'}
            value={filters.companyDescriptionKeywordsExclude as Option[]}
          />
        </CollapsePanel>
        <CollapsePanel
          filterCount={computedFilterCount([
            filters.jobTitleSeniorityLevels,
            filters.jobFunctions,
            filters.jobTitleKeywords,
            filters.jobTitleExcludeKeywords,
            filters.jobDescriptionKeywords,
            filters.jobTitleExactKeywordMatch,
          ])}
          title={'Job title'}
        >
          <FilterSelect
            onChange={(_, value) => {
              setFilters({
                ...filters,
                jobTitleSeniorityLevels: value,
              });
            }}
            options={JOB_TITLE_SENIORITY}
            placeholder={'e.g. C-suite, Manager'}
            title={'Seniority'}
            value={filters.jobTitleSeniorityLevels as Option[]}
          />
          <FilterSelect
            onChange={(_, value) => {
              setFilters({
                ...filters,
                jobFunctions: value,
              });
            }}
            options={JOB_TITLE_JOB_FUNCTIONS}
            placeholder={'e.g. Sales, Engineering'}
            title={'Job functions'}
            value={filters.jobFunctions as Option[]}
          />
          <FilterSelect
            onChange={(_, value) => {
              setFilters({
                ...filters,
                jobTitleKeywords: value,
              });
            }}
            options={JOB_TITLE_ALL}
            placeholder={'e.g. CEO, VP, Director'}
            title={'Job titles to include'}
            value={filters.jobTitleKeywords as Option[]}
          />
          <FilterSelect
            onChange={(_, value) => {
              setFilters({
                ...filters,
                jobTitleExcludeKeywords: value,
              });
            }}
            options={JOB_TITLE_ALL}
            placeholder={'e.g. CEO, VP, Director'}
            title={'Job titles to exclude'}
            value={filters.jobTitleExcludeKeywords as Option[]}
          />
          <FilterSwitch
            checked={filters.jobTitleExactKeywordMatch as boolean}
            description={
              'Toggle this on to only show exact matches for your keywords. Similar and translated titles won\'t appear (e.g. "Frontend Engineer" and "Ingénieur logicel" for "Software Developer").'
            }
            label={'Exact keyword match'}
            onChange={(_, value) => {
              setFilters({
                ...filters,
                jobTitleExactKeywordMatch: value,
              });
            }}
          />
        </CollapsePanel> */}
        {/*        <CollapsePanel
          filterCount={computedFilterCount([
            filters.currentRoleMinMonthsSinceStartDate,
            filters.currentRoleMaxMonthsSinceStartDate,
            filters.maxExperienceCount,
            filters.experienceCount,
            filters.jobDescriptionKeywords,
          ])}
          title={'Experience'}
        >
          <FilterContainer title={'Months in current role'}>
            <Stack flexDirection={'row'} gap={1}>
              <StyledTextFieldNumber
                decimalScale={0}
                onValueChange={({ floatValue }) => {
                  setFilters({
                    ...filters,
                    currentRoleMinMonthsSinceStartDate: floatValue,
                  });
                }}
                placeholder={'min'}
                value={
                  (filters.currentRoleMinMonthsSinceStartDate as number) || ''
                }
              />
              <StyledTextFieldNumber
                decimalScale={0}
                onValueChange={({ floatValue }) => {
                  setFilters({
                    ...filters,
                    currentRoleMaxMonthsSinceStartDate: floatValue,
                  });
                }}
                placeholder={'max'}
                value={
                  (filters.currentRoleMaxMonthsSinceStartDate as number) || ''
                }
              />
            </Stack>
          </FilterContainer>
          <FilterContainer title={'Number of experiences'}>
            <Stack flexDirection={'row'} gap={1}>
              <StyledTextFieldNumber
                decimalScale={0}
                onValueChange={({ floatValue }) => {
                  setFilters({
                    ...filters,
                    experienceCount: floatValue,
                  });
                }}
                placeholder={'min'}
                value={(filters.experienceCount as number) || ''}
              />
              <StyledTextFieldNumber
                decimalScale={0}
                onValueChange={({ floatValue }) => {
                  setFilters({
                    ...filters,
                    maxExperienceCount: floatValue,
                  });
                }}
                placeholder={'max'}
                value={(filters.maxExperienceCount as number) || ''}
              />
            </Stack>
          </FilterContainer>
          <FilterTextField
            onChange={(newValue) => {
              setFilters({
                ...filters,
                jobDescriptionKeywords: newValue,
              });
            }}
            placeholder={'e.g. product roadmap, manager, growth team'}
            title={'Experience description keywords'}
            value={filters.jobDescriptionKeywords as Option[]}
          />
        </CollapsePanel>*/}
        {/*  <LocationFilter
          defaultValue={filters}
          filterCount={computedFilterCount([
            filters.locationCountriesInclude,
            filters.locationCountriesExclude,
            filters.locationRegionsInclude,
            filters.locationRegionsExclude,
            filters.locationCitiesInclude,
            filters.locationCitiesExclude,
            filters.locationStatesInclude,
            filters.locationStatesExclude,
            filters.searchRawLocation,
            filters.locations,
            filters.locationsExclude,
          ])}
          onChange={(key, value) => {
            setFilters({
              ...filters,
              [key]: value,
            });
          }}
        />
        <CollapsePanel
          filterCount={computedFilterCount([
            filters.names,
            filters.profileKeywords,
            filters.headlineKeywords,
            filters.aboutKeywords,
            filters.connectionCount,
            filters.maxConnectionCount,
            filters.followerCount,
            filters.maxFollowerCount,
          ])}
          title={'Profile'}
        >
          <FilterTextField
            onChange={(newValue) => {
              setFilters({
                ...filters,
                names: newValue,
              });
            }}
            placeholder={'e.g. Jane Doe, John Doe'}
            title={'Names'}
            value={filters.names as Option[]}
          />
          <FilterTextField
            onChange={(newValue) => {
              setFilters({
                ...filters,
                profileKeywords: newValue,
              });
            }}
            placeholder={'e.g. Python, data science'}
            subTitle={
              'Keywords anywhere in profile (headline, about section, experience descriptions, certifications, etc.)'
            }
            title={'Profile keywords'}
            value={filters.profileKeywords as Option[]}
          />
          <FilterTextField
            onChange={(newValue) => {
              setFilters({
                ...filters,
                headlineKeywords: newValue,
              });
            }}
            placeholder={'e.g. founder, vice president, CEO'}
            title={'Headline keywords'}
            value={filters.headlineKeywords as Option[]}
          />
          <FilterTextField
            onChange={(newValue) => {
              setFilters({
                ...filters,
                aboutKeywords: newValue,
              });
            }}
            placeholder={'e.g. NLP, LLM, PhD'}
            title={'About section keywords'}
            value={filters.aboutKeywords as Option[]}
          />
          <FilterContainer title={'Number of connections'}>
            <Stack flexDirection={'row'} gap={1}>
              <StyledTextFieldNumber
                decimalScale={0}
                onValueChange={({ floatValue }) => {
                  setFilters({
                    ...filters,
                    connectionCount: floatValue,
                  });
                }}
                placeholder={'min'}
                value={(filters.connectionCount as number) || ''}
              />
              <StyledTextFieldNumber
                decimalScale={0}
                onValueChange={({ floatValue }) => {
                  setFilters({
                    ...filters,
                    maxConnectionCount: floatValue,
                  });
                }}
                placeholder={'max'}
                value={(filters.maxConnectionCount as number) || ''}
              />
            </Stack>
          </FilterContainer>
          <FilterContainer title={'Number of followers'}>
            <Stack flexDirection={'row'} gap={1}>
              <StyledTextFieldNumber
                decimalScale={0}
                onValueChange={({ floatValue }) => {
                  setFilters({
                    ...filters,
                    followerCount: floatValue,
                  });
                }}
                placeholder={'min'}
                value={(filters.followerCount as number) || ''}
              />
              <StyledTextFieldNumber
                decimalScale={0}
                onValueChange={({ floatValue }) => {
                  setFilters({
                    ...filters,
                    maxFollowerCount: floatValue,
                  });
                }}
                placeholder={'max'}
                value={(filters.maxFollowerCount as number) || ''}
              />
            </Stack>
          </FilterContainer>
        </CollapsePanel> */}

        {/*   <CollapsePanel
          filterCount={computedFilterCount([filters.languages])}
          title={'Languages'}
        >
          <FilterTextField
            onChange={(newValue) => {
              setFilters({
                ...filters,
                languages: newValue,
              });
            }}
            placeholder={'e.g. English, French, Spanish'}
            title={'Languages'}
            value={filters.languages as Option[]}
          />
        </CollapsePanel>*/}
        {/*   <CollapsePanel
          filterCount={computedFilterCount([filters.schoolNames])}
          title={'Education'}
        >
          <FilterTextField
            onChange={(newValue) => {
              setFilters({
                ...filters,
                schoolNames: newValue,
              });
            }}
            placeholder={'e.g. McGill University, McMaster University'}
            title={'School names'}
            value={filters.schoolNames as Option[]}
          />
        </CollapsePanel>*/}
        {/*<CollapsePanel title={'Companies'}>
          <RadioGroup defaultValue={'male'}>
            <FormControlLabel
              control={<Radio />}
              label={'SDR table of companies'}
              slotProps={{
                typography: {
                  fontSize: 12,
                },
              }}
              value={'male'}
            />
            <FormControlLabel
              control={<Radio />}
              label={'List of company identifiers'}
              slotProps={{
                typography: {
                  fontSize: 12,
                },
              }}
              value={'other'}
            />
          </RadioGroup>

          <FilterSelect
            disabled
            options={[]}
            placeholder={'Select company table'}
            popupIcon={
              <Icon component={ICON_FOLDER} sx={{ width: 16, height: 16 }} />
            }
            title={'Company table'}
          />
          <FilterSelect
            options={[]}
            placeholder={'e.g. McGill University, McMaster University'}
            title={'Company identifiers'}
          />
        </CollapsePanel>*/}
        {/*       <CollapsePanel title={'Exclude people'}>
          <FilterSelect
            disabled
            options={[]}
            placeholder={'Select people table'}
            popupIcon={
              <Icon component={ICON_FOLDER} sx={{ width: 16, height: 16 }} />
            }
            title={'Table'}
          />
          <FilterSelect
            options={[]}
            placeholder={'Select a view'}
            title={'View'}
          />
          <FilterSelect
            options={[]}
            placeholder={'Start typing or select a column'}
            title={'Personal LinkedIn URLs'}
          />
        </CollapsePanel>*/}
        {/* <CollapsePanel
          filterCount={computedFilterCount([filters.includePastExperiences])}
          title={'Past experiences'}
        >
          <FilterSwitch
            checked={filters.includePastExperiences as boolean}
            description={
              'Match companies, title, and experience filters against past  experiences'
            }
            label={'Include past experiences'}
            onChange={(_, checked) => {
              setFilters({
                ...filters,
                includePastExperiences: checked,
              });
            }}
          />
        </CollapsePanel>
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
                setFilters({
                  ...filters,
                  limit: floatValue,
                });
              }}
              placeholder={'e.g.10'}
              value={(filters.limit as number) || ''}
            />
          </FilterContainer>
          <FilterContainer
            subTitle={'Maximum: 1000'}
            title={'Limit per company'}
          >
            <StyledTextFieldNumber
              decimalScale={0}
              isAllowed={({ floatValue }) => {
                return (floatValue || 0) <= 1000;
              }}
              onValueChange={({ floatValue }) => {
                setFilters({
                  ...filters,
                  limitPerCompany: floatValue,
                });
              }}
              placeholder={'e.g.10'}
              value={(filters.limitPerCompany as number) || ''}
            />
          </FilterContainer>
        </CollapsePanel> */}
      </Stack>
      <Stack
        borderTop={'1px solid #E5E5E5'}
        flexDirection={'row'}
        justifyContent={'flex-end'}
        px={3}
        py={1.5}
      >
        <StyledButton
          disabled={disabled}
          loading={state.loading}
          onClick={createTableByFindPeople}
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
