import { FC } from 'react';

import { CollapsePanel } from '@/components/molecules';

import {
  FilterSelect,
  FilterSwitch,
  FilterTextField,
} from '@/components/molecules/FindPeople/FilterItem';
import {
  LOCATION_CITIES_OPTIONS,
  LOCATION_COUNTRIES_OPTIONS,
  LOCATION_REGIONS_OPTIONS,
  LOCATION_STATES_OPTIONS,
} from '@/constant';

type LocationFilterProps = {
  filterCount?: number;
  defaultValue: Record<string, any>;
  onChange?: (key: string, value: any) => void;
  type?: 'find_people' | 'find_company';
};

export const LocationFilter: FC<LocationFilterProps> = ({
  filterCount,
  defaultValue,
  onChange,
  type = 'find_people',
}) => {
  return (
    <CollapsePanel filterCount={filterCount} title={'Location'}>
      <FilterSelect
        onChange={(_, value) => {
          onChange?.('locationCountriesInclude', value);
        }}
        options={LOCATION_COUNTRIES_OPTIONS}
        placeholder={'e.g. United States, Canada'}
        title={'Countries to include'}
        value={defaultValue.locationCountriesInclude as Option[]}
      />
      <FilterSelect
        onChange={(_, value) => {
          onChange?.('locationCountriesExclude', value);
        }}
        options={LOCATION_COUNTRIES_OPTIONS}
        placeholder={'e.g. France, Spain'}
        title={'Countries to exclude'}
        value={defaultValue.locationCountriesExclude as Option[]}
      />
      {type === 'find_people' && (
        <>
          <FilterSelect
            onChange={(_, value) => {
              onChange?.('locationRegionsInclude', value);
            }}
            options={LOCATION_REGIONS_OPTIONS}
            placeholder={'e.g. NAM, LATAM'}
            title={'Regions to include'}
            value={defaultValue.locationRegionsInclude as Option[]}
          />
          <FilterSelect
            onChange={(_, value) => {
              onChange?.('locationRegionsExclude', value);
            }}
            options={LOCATION_REGIONS_OPTIONS}
            placeholder={'e.g. APAC, EMEA'}
            title={'Regions to exclude'}
            value={defaultValue.locationRegionsExclude as Option[]}
          />
        </>
      )}
      <FilterSelect
        onChange={(_, value) => {
          onChange?.('locationCitiesInclude', value);
        }}
        options={LOCATION_CITIES_OPTIONS}
        placeholder={'e.g. San Francisco, London'}
        title={'Cities to include'}
        value={defaultValue.locationCitiesInclude as Option[]}
      />
      <FilterSelect
        onChange={(_, value) => {
          onChange?.('locationCitiesExclude', value);
        }}
        options={LOCATION_CITIES_OPTIONS}
        placeholder={'e.g. New York, Paris'}
        title={'Cities to exclude'}
        value={defaultValue.locationCitiesExclude as Option[]}
      />
      {type === 'find_people' && (
        <>
          <FilterSelect
            onChange={(_, value) => {
              onChange?.('locationStatesInclude', value);
            }}
            options={LOCATION_STATES_OPTIONS}
            placeholder={'e.g. San Francisco, London'}
            title={'States, provinces, or municipalities to include'}
            value={defaultValue.locationStatesInclude as Option[]}
          />
          <FilterSelect
            onChange={(_, value) => {
              onChange?.('locationStatesExclude', value);
            }}
            options={LOCATION_STATES_OPTIONS}
            placeholder={'e.g. New York, Paris'}
            title={'States, provinces, or municipalities to exclude'}
            value={defaultValue.locationStatesExclude as Option[]}
          />
          <FilterSwitch
            checked={(defaultValue.searchRawLocation as boolean) || false}
            label={'Search raw location field'}
            onChange={(_, checked) => {
              onChange?.('searchRawLocation', checked);
              onChange?.('locations', []);
              onChange?.('locationsExclude', []);
            }}
          />
          {defaultValue.searchRawLocation && (
            <>
              <FilterTextField
                onChange={(newValue) => {
                  onChange?.('locations', newValue);
                }}
                placeholder={'e.g. San Francisco, London'}
                title={'Keywords to include for raw location field'}
                value={defaultValue.locations as Option[]}
              />
              <FilterTextField
                onChange={(newValue) => {
                  onChange?.('locationsExclude', newValue);
                }}
                placeholder={'e.g. New York, Paris'}
                title={'Keywords to exclude for raw location field'}
                value={defaultValue.locationsExclude as Option[]}
              />
            </>
          )}
        </>
      )}
    </CollapsePanel>
  );
};
