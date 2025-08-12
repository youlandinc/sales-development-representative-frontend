import { FC, useState } from 'react';
import { Box, Collapse, Icon, Stack, Typography } from '@mui/material';
import useSWR from 'swr';

import { useDialogStore } from '@/stores/useDialogStore';

import { COMPANY_HEADCOUNT_OPTIONS, COMPANY_REVENUE_OPTIONS } from './data';
import { SDRToast } from '@/components/atoms';
import { StyledSearchSelect, StyledSelectWithCustom } from './index';

import { HttpError, SearchWithFlagData, SelectWithCustomProps } from '@/types';
import { _fetchFilterOptions } from '@/request';

import ICON_ARROW_DOWN from './assets/icon_arrow_down.svg';

export enum TreeNodeRenderTypeEnum {
  search_with_flag = 'SEARCH_WITH_FLAG',
  search_select = 'SEARCH_SELECT',
  select_with_custom = 'SELECT_WITH_CUSTOM',
}

interface TreeNode {
  label: string;
  collapse: boolean;
  children: {
    label: string;
    value: string;
    placeholder: string;
    defaultPlaceholder: string;
    type: TreeNodeRenderTypeEnum;
    options: TOption[];
  }[];
}

export const CampaignProcessContentFilter: FC = () => {
  const { filterFormData, setFilterFormData } = useDialogStore();

  const [renderData, setRenderData] = useState<TreeNode[]>(RENDER_DATA);

  const { isLoading } = useSWR(
    'filter',
    async () => {
      try {
        const { data } = await _fetchFilterOptions();
        const mergedData = renderData.map((section) => ({
          ...section,
          children: section.children.map((child) => {
            if (child.type !== TreeNodeRenderTypeEnum.select_with_custom) {
              return {
                ...child,
                options: data?.[child.value] || [],
              };
            }
            return child;
          }),
        }));
        setRenderData(mergedData);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <Stack gap={3} height={'100%'} overflow={'auto'} width={'100%'}>
      {renderData.map((item, index) => (
        <Box
          border={'1px solid #DFDEE6'}
          borderRadius={2}
          key={`filter-${index}`}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() => {
              const target = JSON.parse(JSON.stringify(item));
              target.collapse = !target.collapse;
              setRenderData(
                renderData.map((section, sectionIndex) =>
                  sectionIndex === index ? target : section,
                ),
              );
            }}
            p={1.5}
            width={'100%'}
          >
            <Typography variant={'subtitle1'}>{item.label}</Typography>
            <Icon
              component={ICON_ARROW_DOWN}
              sx={{
                transform: `rotate(${item.collapse ? '180deg' : '0deg'})`,
                transition: 'all .3s',
                height: 16,
                width: 16,
              }}
            />
          </Stack>

          <Collapse in={item.collapse}>
            {item.children.map((child, childIndex) => (
              <Stack
                gap={3}
                key={`${item.label}-${child.label}-${index}-${childIndex}`}
                pb={childIndex === item.children.length - 1 ? 3 : 0}
                pt={childIndex === 0 ? 0 : 1.5}
                px={3}
              >
                <Stack gap={1}>
                  <Typography variant={'subtitle2'}>{child.label}</Typography>
                  {child.type === TreeNodeRenderTypeEnum.select_with_custom ? (
                    <StyledSelectWithCustom
                      inputValue={
                        (filterFormData?.[child.value] as SelectWithCustomProps)
                          .inputValue
                      }
                      onClear={() => {
                        setFilterFormData({
                          ...filterFormData,
                          [child.value]: {
                            ...filterFormData?.[child.value],
                            selectValue: '',
                          },
                        });
                      }}
                      onSelectChange={(e) => {
                        setFilterFormData({
                          ...filterFormData,
                          [child.value]: {
                            ...filterFormData?.[child.value],
                            selectValue: e.target.value,
                          },
                        });
                      }}
                      options={child.options}
                      placeholder={child.defaultPlaceholder}
                      selectValue={
                        (filterFormData?.[child.value] as SelectWithCustomProps)
                          .selectValue
                      }
                    />
                  ) : (
                    <StyledSearchSelect
                      disabled={isLoading}
                      id={`${item.label}-${child.label}-${index}-${childIndex}`}
                      onDelete={(value) => {
                        setFilterFormData({
                          ...filterFormData,
                          [child.value]: (
                            filterFormData?.[
                              child.value
                            ] as SearchWithFlagData[]
                          )?.filter((item: any) => item.value !== value),
                        });
                      }}
                      onInputKeyDown={(data) => {
                        setFilterFormData({
                          ...filterFormData,
                          [child.value]: data,
                        });
                      }}
                      onReset={() => {
                        setFilterFormData({
                          ...filterFormData,
                          [child.value]: [],
                        });
                      }}
                      onSelect={(data) => {
                        setFilterFormData({
                          ...filterFormData,
                          [child.value]: data,
                        });
                      }}
                      options={child.options}
                      placeholder={
                        (filterFormData?.[child.value] as SearchWithFlagData[])
                          .length > 0
                          ? child.placeholder
                          : child.defaultPlaceholder
                      }
                      type={child.type}
                      value={
                        (filterFormData?.[
                          child.value
                        ] as SearchWithFlagData[]) || []
                      }
                    />
                  )}
                </Stack>
              </Stack>
            ))}
          </Collapse>
        </Box>
      ))}
    </Stack>
  );
};

const RENDER_DATA: TreeNode[] = [
  {
    label: 'Contact Details',
    collapse: true,
    children: [
      {
        label: 'Job Title',
        value: 'jobTitle',
        placeholder: 'Add job title(s)…',
        defaultPlaceholder: 'Select job title(s)…',
        type: TreeNodeRenderTypeEnum.search_with_flag,
        options: [],
      },
      {
        label: 'University Name',
        value: 'universityName',
        placeholder: 'Add one or more universities…',
        defaultPlaceholder: 'Select one or more universities…',
        type: TreeNodeRenderTypeEnum.search_select,
        options: [],
      },
    ],
  },
  {
    label: 'Company Criteria',
    collapse: true,
    children: [
      {
        label: 'Company Headcount',
        value: 'companyHeadcount',
        placeholder: 'Add one or more headcount ranges…',
        defaultPlaceholder: 'Select one or more headcount ranges…',
        type: TreeNodeRenderTypeEnum.select_with_custom,
        options: COMPANY_HEADCOUNT_OPTIONS,
      },
      {
        label: 'Industry',
        value: 'industry',
        placeholder: 'Add one or more industries…',
        defaultPlaceholder: 'Select industry/industries…',
        type: TreeNodeRenderTypeEnum.search_select,
        options: [],
      },
      {
        label: 'Current Company',
        value: 'currentCompany',
        placeholder: 'Add one or more companies…',
        defaultPlaceholder: 'Select one or more companies…',
        type: TreeNodeRenderTypeEnum.search_select,
        options: [],
      },
    ],
  },
  {
    label: 'Location',
    collapse: true,
    children: [
      {
        label: 'Person Location',
        value: 'personLocation',
        placeholder: 'Add one or more locations…',
        defaultPlaceholder: 'Select one or more locations…',
        type: TreeNodeRenderTypeEnum.search_select,
        options: [],
      },
    ],
  },
  {
    label: 'Company Growth',
    collapse: true,
    children: [
      {
        label: 'Company Revenue',
        value: 'companyRevenue',
        placeholder: 'Add one or more revenue ranges…',
        defaultPlaceholder: 'Select one or more revenue ranges…',
        type: TreeNodeRenderTypeEnum.select_with_custom,
        options: COMPANY_REVENUE_OPTIONS,
      },
    ],
  },
  {
    label: 'Keywords',
    collapse: true,
    children: [
      {
        label: 'Industry',
        value: 'industry',
        placeholder: 'Add one or more industries…',
        defaultPlaceholder: 'Select one or more industries…',
        type: TreeNodeRenderTypeEnum.search_select,
        options: [],
      },
      {
        label: 'Skills',
        value: 'skills',
        placeholder: 'Add one or more skills…',
        defaultPlaceholder: 'Select all relevant skills…',
        type: TreeNodeRenderTypeEnum.search_select,
        options: [],
      },
    ],
  },
];

//const RENDER_DATA = [
//  {
//    label: 'Contact Details',
//    collapse: false,
//    children: [
//      {
//        label: 'Job Title',
//        value: 'jobTitle',
//        type: TreeNodeRenderTypeEnum.search_select,
//        options: [],
//      },
//      //{
//      //  label: 'Department',
//      //  key: 'department',
//      //  type: TreeNodeRenderTypeEnum.select,
//      //  options: [],
//      //},
//      //{
//      //  label: 'Seniority Level',
//      //  value: 'seniorityLevel',
//      //  type: TreeNodeRenderTypeEnum.select,
//      //  options: [],
//      //},
//      {
//        label: 'University Name',
//        value: 'universityName',
//        type: TreeNodeRenderTypeEnum.select,
//        options: [],
//      },
//    ],
//  },
//  {
//    label: 'Company Criteria',
//    collapse: false,
//    children: [
//      {
//        label: 'Company Headcount',
//        value: 'companyHeadcount',
//        type: TreeNodeRenderTypeEnum.select,
//        options: [],
//      },
//      {
//        label: 'Industry',
//        value: 'industry',
//        type: TreeNodeRenderTypeEnum.select,
//        options: [],
//      },
//      {
//        label: 'Current Company',
//        value: 'currentCompany',
//        type: TreeNodeRenderTypeEnum.select,
//        options: [],
//      },
//    ],
//  },
//  {
//    label: 'Location',
//    collapse: false,
//    children: [
//      {
//        label: 'Person Location',
//        value: 'personLocation',
//        type: TreeNodeRenderTypeEnum.select,
//        options: [],
//      },
//      //{
//      //  label: 'Company HQ',
//      //  value: 'companyHQ',
//      //  type: TreeNodeRenderTypeEnum.select,
//      //  options: [],
//      //},
//    ],
//  },
//  {
//    label: 'Company Growth',
//    collapse: false,
//    children: [
//      {
//        label: 'Company Revenue',
//        value: 'companyRevenue',
//        type: TreeNodeRenderTypeEnum.select,
//        children: [{}, {}],
//      },
//      //{
//      //  label: 'Yearly Headcount Growth',
//      //  value: 'yearlyHeadcountGrowth',
//      //  type: TreeNodeRenderTypeEnum.select,
//      //  children: [{}, {}],
//      //},
//    ],
//  },
//  //{
//  //  label: 'Technology',
//  //  collapse: false,
//  //  children: [
//  //    {
//  //      label: 'Software',
//  //      value: 'software',
//  //      type: TreeNodeRenderTypeEnum.select,
//  //      options: [],
//  //    },
//  //    {
//  //      label: 'Domain',
//  //      value: 'domain',
//  //      type: TreeNodeRenderTypeEnum.select,
//  //      options: [],
//  //    },
//  //  ],
//  //},
//  {
//    label: 'Keywords',
//    collapse: false,
//    children: [
//      {
//        label: 'Industry',
//        value: 'industry',
//        type: TreeNodeRenderTypeEnum.select,
//        options: [],
//      },
//      {
//        label: 'Skills',
//        value: 'skills',
//        type: TreeNodeRenderTypeEnum.select,
//        options: [],
//      },
//      {
//        label: 'Exclude Skill',
//        value: 'excludeSkill',
//        type: TreeNodeRenderTypeEnum.select,
//        options: [],
//      },
//      //{
//      //  label: 'Interests',
//      //  value: 'interests',
//      //  type: TreeNodeRenderTypeEnum.select,
//      //  options: [],
//      //},
//    ],
//  },
//];
