import { Stack } from '@mui/material';
import { FC } from 'react';
import { isNumber, isString } from 'lodash-es';
import { useRouter } from 'nextjs-toploader/app';

import {
  SDRToast,
  StyledButton,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { CollapsePanel } from '@/components/molecules';
import {
  FilterContainer,
  FilterSelect,
  FilterSwitch,
  FilterTextField,
} from './FilterItem';

import {
  COMPANY_INDUSTRIES,
  COMPANY_SIZE,
  JOB_TITLE_ALL,
  JOB_TITLE_JOB_FUNCTIONS,
  JOB_TITLE_SENIORITY,
  LOCATION_CITIES_OPTIONS,
  LOCATION_COUNTRIES_OPTIONS,
  LOCATION_REGIONS_OPTIONS,
  LOCATION_STATES_OPTIONS,
} from '@/constant';
import { useFindPeopleStore } from '@/stores/useFindPeopleStore';
import { useAsyncFn } from '@/hooks';
import { _createTableByFindPeople } from '@/request';
import { HttpError } from '@/types';

export const FindPeopleFilterPanel: FC = () => {
  const { filters, setFilters } = useFindPeopleStore((state) => state);
  const router = useRouter();

  const computedFilterCount = (
    t: (Option[] | boolean | string | number | undefined)[] = [],
  ) =>
    t.reduce(
      (pre, cur) =>
        cur == null || cur === 0 || cur === ''
          ? pre
          : Array.isArray(cur)
            ? (pre as number) + cur.length
            : cur === !0 || isNumber(cur) || isString(cur)
              ? (pre as number) + 1
              : pre,
      0,
    ) as number;

  const [state, createTableByFindPeople] = useAsyncFn(async () => {
    try {
      const { data } = await _createTableByFindPeople(filters);
      router.push(`/prospect-enrich/${data}`);
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [filters]);

  // const debounceParam = useDebounce(param, 1000);
  // useEffect(() => {
  //   handleChange?.(debounceParam);
  // }, [JSON.stringify(debounceParam)]);

  return (
    <Stack
      borderRight={'1px solid #E5E5E5'}
      gap={4}
      height={'100%'}
      maxWidth={450}
      minWidth={450}
      overflow={'auto'}
      p={3}
    >
      <CollapsePanel
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
      </CollapsePanel>
      <CollapsePanel
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
              type={'number'}
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
              type={'number'}
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
              type={'number'}
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
              type={'number'}
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
      </CollapsePanel>
      <CollapsePanel
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
        title={'Location'}
      >
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              locationCountriesInclude: value,
            });
          }}
          options={LOCATION_COUNTRIES_OPTIONS}
          placeholder={'e.g. United States, Canada'}
          title={'Countries to include'}
          value={filters.locationCountriesInclude as Option[]}
        />
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              locationCountriesExclude: value,
            });
          }}
          options={LOCATION_COUNTRIES_OPTIONS}
          placeholder={'e.g. France, Spain'}
          title={'Countries to exclude'}
          value={filters.locationCountriesExclude as Option[]}
        />
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              locationRegionsInclude: value,
            });
          }}
          options={LOCATION_REGIONS_OPTIONS}
          placeholder={'e.g. NAM, LATAM'}
          title={'Regions to include'}
          value={filters.locationRegionsInclude as Option[]}
        />
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              locationRegionsExclude: value,
            });
          }}
          options={LOCATION_REGIONS_OPTIONS}
          placeholder={'e.g. APAC, EMEA'}
          title={'Regions to exclude'}
          value={filters.locationRegionsExclude as Option[]}
        />
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              locationCitiesInclude: value,
            });
          }}
          options={LOCATION_CITIES_OPTIONS}
          placeholder={'e.g. San Francisco, London'}
          title={'Cities to include'}
          value={filters.locationCitiesInclude as Option[]}
        />
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              locationCitiesExclude: value,
            });
          }}
          options={LOCATION_CITIES_OPTIONS}
          placeholder={'e.g. New York, Paris'}
          title={'Cities to exclude'}
          value={filters.locationCitiesExclude as Option[]}
        />
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              locationStatesInclude: value,
            });
          }}
          options={LOCATION_STATES_OPTIONS}
          placeholder={'e.g. San Francisco, London'}
          title={'States, provinces, or municipalities to include'}
          value={filters.locationStatesInclude as Option[]}
        />
        <FilterSelect
          onChange={(_, value) => {
            setFilters({
              ...filters,
              locationStatesExclude: value,
            });
          }}
          options={LOCATION_STATES_OPTIONS}
          placeholder={'e.g. New York, Paris'}
          title={'States, provinces, or municipalities to exclude'}
          value={filters.locationStatesExclude as Option[]}
        />
        <FilterSwitch
          checked={(filters.searchRawLocation as boolean) || false}
          label={'Search raw location field'}
          onChange={(_, checked) => {
            setFilters({
              ...filters,
              searchRawLocation: checked,
              locations: [],
              locationsExclude: [],
            });
          }}
        />
        {filters.searchRawLocation && (
          <>
            <FilterTextField
              onChange={(newValue) => {
                setFilters({
                  ...filters,
                  locations: newValue,
                });
              }}
              placeholder={'e.g. San Francisco, London'}
              title={'Keywords to include for raw location field'}
              value={filters.locations as Option[]}
            />
            <FilterTextField
              onChange={(newValue) => {
                setFilters({
                  ...filters,
                  locationsExclude: newValue,
                });
              }}
              placeholder={'e.g. New York, Paris'}
              title={'Keywords to exclude for raw location field'}
              value={filters.locationsExclude as Option[]}
            />
          </>
        )}
      </CollapsePanel>
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
              type={'number'}
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
              type={'number'}
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
              type={'number'}
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
              type={'number'}
              value={(filters.maxFollowerCount as number) || ''}
            />
          </Stack>
        </FilterContainer>
      </CollapsePanel>

      <CollapsePanel
        filterCount={computedFilterCount([
          filters.languages,
          filters.schoolNames,
        ])}
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
      </CollapsePanel>
      <CollapsePanel title={'Education'}>
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
      </CollapsePanel>
      <CollapsePanel title={'Companies'}></CollapsePanel>
      <CollapsePanel title={'Exclude people'}></CollapsePanel>
      <CollapsePanel
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
        <FilterContainer subTitle={'100 record max per search'} title={'Limit'}>
          <StyledTextFieldNumber
            decimalScale={0}
            isAllowed={({ floatValue }) => {
              return (floatValue || 0) <= 100;
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
          subTitle={'100 record max per search'}
          title={'Maximum: 100'}
        >
          <StyledTextFieldNumber
            decimalScale={0}
            isAllowed={({ floatValue }) => {
              return (floatValue || 0) <= 100;
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
      </CollapsePanel>
      <StyledButton
        loading={state.loading}
        onClick={createTableByFindPeople}
        variant={'outlined'}
      >
        Continue
      </StyledButton>
    </Stack>
  );
};
