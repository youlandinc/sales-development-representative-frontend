import { Stack } from '@mui/material';
import { useRouter } from 'nextjs-toploader/app';
import { FC } from 'react';

import { SDRToast, StyledButton } from '@/components/atoms';

import {
  CollapsePanel,
  CompanyTypeFilter,
  CreateFilterElement,
} from '../Common';

import { _createTableByFindPeopleCompany } from '@/request';

import { useAsyncFn } from '@/hooks';
import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';

import { FindType, HttpError } from '@/types';

import { computedFilterCount, handleParam } from '@/utils';

type FindPeopleFilterPanelProps = {
  disabled?: boolean;
};

export const FindPeopleFilterPanel: FC<FindPeopleFilterPanelProps> = ({
  disabled,
}) => {
  const {
    filters,
    queryConditions,
    setQueryConditions,
    findType,
    checkedSource,
  } = useFindPeopleCompanyStore((state) => state);
  const router = useRouter();

  const [state, createTable] = useAsyncFn(async () => {
    try {
      const { data } = await _createTableByFindPeopleCompany(
        handleParam({ ...queryConditions, searchType: checkedSource.bizId }),
      );
      router.push(`/prospect-enrich/${data}`);
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  }, [JSON.stringify(queryConditions)]);

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
        <CompanyTypeFilter
          title={
            findType === FindType.find_people
              ? 'Contact category'
              : 'Company type'
          }
        />
        <>
          {Object.entries(filters).map(([title, value], index) => (
            <CollapsePanel
              defaultOpen={index === 0}
              filterCount={computedFilterCount(
                value.map((item) => queryConditions[item.formKey]),
              )}
              key={index}
              title={title}
            >
              {value.map((i, k) => (
                <CreateFilterElement
                  key={k}
                  onChange={(value) => {
                    setQueryConditions({
                      ...queryConditions,
                      [i.formKey]: value,
                    });
                  }}
                  params={i}
                  type={i.formType}
                  value={queryConditions[i.formKey]}
                />
              ))}
            </CollapsePanel>
          ))}
        </>
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
          onClick={createTable}
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
