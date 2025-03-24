import { FC, useState } from 'react';
import { Box, Collapse, Icon, Stack, Typography } from '@mui/material';
import useSWR from 'swr';

import { useDebounce } from '@/hooks';
import { useDialogStore } from '@/stores/useDialogStore';

import { COMPANY_HEADCOUNT_OPTIONS, COMPANY_REVENUE_OPTIONS } from './data';
import { SDRToast } from '@/components/atoms';
import { StyledSearchSelect, StyledSelectWithCustom } from './index';

import { HttpError } from '@/types';
import { _fetchFilterLeads, _fetchFilterOptions } from '@/request';

import ICON_ARROW_DOWN from './assets/icon_arrow_down.svg';

export enum TreeNodeRenderTypeEnum {
  search_with_flag = 'SEARCH_WITH_FLAG',
  search_select = 'SEARCH_SELECT',
  select_with_custom = 'SELECT_WITH_CUSTOM',
}

export enum SelectWithFlagTypeEnum {
  select = 'SELECT',
  input = 'INPUT',
}

interface SearchWithFlagData {
  value: string;
  isIncludes?: boolean;
  type: SelectWithFlagTypeEnum;
}

interface SelectWithCustomProps {
  inputValue: string;
  selectValue: string;
}

interface TreeNode {
  label: string;
  collapse: boolean;
  children: {
    label: string;
    value: string;
    type: TreeNodeRenderTypeEnum;
    options: TOption[];
  }[];
}

export const CampaignProcessContentFilter: FC = () => {
  const {
    isFirst,
    setIsFirst,
    setLeadsList,
    setLeadsCount,
    setLeadsVisible,
    setLeadsFetchLoading,
  } = useDialogStore();

  const [formData, setFormData] =
    useState<Record<string, SearchWithFlagData[] | SelectWithCustomProps>>(
      INITIAL_FORM,
    );

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

  const debouncedFormData = useDebounce(formData, 1000);

  useSWR(
    debouncedFormData,
    async () => {
      if (isFirst) {
        return setIsFirst(false);
      }
      setLeadsFetchLoading(true);
      try {
        const {
          data: { counts, leads },
        } = await _fetchFilterLeads(debouncedFormData);
        setLeadsVisible(true);
        setLeadsList(leads);
        setLeadsCount(counts);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setLeadsFetchLoading(false);
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <Stack height={'100%'} overflow={'auto'} pt={3} width={'100%'}>
      {isLoading
        ? null
        : renderData.map((item, index) => (
            <Box key={`filter-${index}`}>
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
                    px={3}
                    py={1.5}
                  >
                    <Stack gap={1}>
                      <Typography variant={'subtitle2'}>
                        {child.label}
                      </Typography>
                      {child.type ===
                      TreeNodeRenderTypeEnum.select_with_custom ? (
                        <StyledSelectWithCustom
                          inputValue={
                            (formData?.[child.value] as SelectWithCustomProps)
                              .inputValue
                          }
                          onSelectChange={(e) => {
                            setFormData({
                              ...formData,
                              [child.value]: {
                                ...formData?.[child.value],
                                selectValue: e.target.value,
                              },
                            });
                          }}
                          options={child.options}
                          selectValue={
                            (formData?.[child.value] as SelectWithCustomProps)
                              .selectValue
                          }
                        />
                      ) : (
                        <StyledSearchSelect
                          id={`${item.label}-${child.label}-${index}-${childIndex}`}
                          onDelete={(value) => {
                            setFormData({
                              ...formData,
                              [child.value]: (
                                formData?.[child.value] as SearchWithFlagData[]
                              )?.filter((item: any) => item.value !== value),
                            });
                          }}
                          onInputKeyDown={(data) => {
                            setFormData({
                              ...formData,
                              [child.value]: data,
                            });
                          }}
                          onReset={() => {
                            setFormData({
                              ...formData,
                              [child.value]: [],
                            });
                          }}
                          onSelect={(data) => {
                            setFormData({
                              ...formData,
                              [child.value]: data,
                            });
                          }}
                          options={child.options}
                          type={child.type}
                          value={
                            (formData?.[child.value] as SearchWithFlagData[]) ||
                            []
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

const INITIAL_FORM = {
  jobTitle: [],
  universityName: [],
  companyHeadcount: {
    selectValue: '',
    inputValue: '',
  },
  industry: [],
  currentCompany: [],
  personLocation: [],
  companyRevenue: {
    selectValue: '',
    inputValue: '',
  },
  skills: [],
  excludeSkill: [],
};

const RENDER_DATA: TreeNode[] = [
  {
    label: 'Contact Details',
    collapse: true,
    children: [
      {
        label: 'Job Title',
        value: 'jobTitle',
        type: TreeNodeRenderTypeEnum.search_with_flag,
        options: [],
      },
      {
        label: 'University Name',
        value: 'universityName',
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
        type: TreeNodeRenderTypeEnum.select_with_custom,
        options: COMPANY_HEADCOUNT_OPTIONS,
      },
      {
        label: 'Industry',
        value: 'industry',
        type: TreeNodeRenderTypeEnum.search_select,
        options: [],
      },
      {
        label: 'Current Company',
        value: 'currentCompany',
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
        type: TreeNodeRenderTypeEnum.search_select,
        options: [],
      },
      {
        label: 'Skills',
        value: 'skills',
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
