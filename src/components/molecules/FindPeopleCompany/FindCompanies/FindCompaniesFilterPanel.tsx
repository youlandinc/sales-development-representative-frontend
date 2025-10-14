import { Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { SDRToast, StyledButton } from '@/components/atoms';
import { CompanyTypeFilter } from '@/components/molecules';
import { CollapsePanel, CreateFilterElement } from '../Common';

import { useAsyncFn } from '@/hooks';
import { useFindPeopleCompanyStore } from '@/stores/useFindPeopleCompanyStore';
import { HttpError } from '@/types';
import { computedFilterCount, handleParam } from '@/utils';
import { _createTableByFindPeople } from '@/request';

export const FindCompaniesFilterPanel: FC<{ disabled?: boolean }> = ({
  disabled,
}) => {
  const { filters, queryConditions, setQueryConditions } =
    useFindPeopleCompanyStore((state) => state);
  const router = useRouter();

  const [state, createTableByFindPeople] = useAsyncFn(async () => {
    try {
      const { data } = await _createTableByFindPeople(handleParam({}));
      router.push(`/prospect-enrich/${data}`);
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  }, []);

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
          {Object.entries(filters).map(([title, value], index) => (
            <CollapsePanel
              defaultOpen
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
