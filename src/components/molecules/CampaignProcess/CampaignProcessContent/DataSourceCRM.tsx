import { FC, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useSWR from 'swr';
import { useRouter } from 'nextjs-toploader/app';

import { useDialogStore } from '@/stores/useDialogStore';

import { _fetchCrmLeads, _fetchCrmList } from '@/request';
import { HttpError, UserIntegrationEnum } from '@/types';

import { SDRToast, StyledSelect } from '@/components/atoms';
import { StyledPreviewTable } from '../base';

export const DataSourceCRM: FC = () => {
  const router = useRouter();

  const {
    setIsFirst,
    resetDialogState,
    // crm
    crmFormData,
    setCRMFormData,
    providerOptions,
    fetchProviderOptionsLoading,
  } = useDialogStore();

  const [listOptions, setListOptions] = useState<TOption[]>([]);
  const [fetching, setFetching] = useState(false);

  const { isLoading } = useSWR(
    crmFormData.provider,
    async () => {
      if (!crmFormData?.provider) {
        return;
      }
      try {
        const { data } = await _fetchCrmList({
          provider: crmFormData?.provider as UserIntegrationEnum,
        });
        const reducedData = data.reduce((acc: TOption[], cur) => {
          acc.push({
            label: cur.name,
            value: cur.listId,
            key: cur.listId,
          });
          return acc;
        }, []);
        setListOptions(reducedData);
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  useSWR(
    crmFormData?.listId && crmFormData?.provider ? crmFormData : null,
    async () => {
      if (!crmFormData?.listId || !crmFormData?.provider) {
        return;
      }
      setIsFirst(false);
      setFetching(true);
      try {
        const {
          data: { counts, validCounts, invalidCounts, data },
        } = await _fetchCrmLeads({
          provider: crmFormData.provider,
          listId: crmFormData.listId,
        });
        setCRMFormData({
          ...crmFormData,
          data: data ?? [],
          counts,
          validCounts: validCounts ?? 0,
          invalidCounts: invalidCounts ?? 0,
        });
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      } finally {
        setFetching(false);
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  const renderFiledNode = () => {
    return (
      <>
        <Stack gap={3} mt={3} px={1.5}>
          <Stack gap={1}>
            <Typography
              color={
                fetchProviderOptionsLoading ? 'text.secondary' : 'text.primary'
              }
              fontWeight={700}
              variant={'body2'}
            >
              CRM provider
            </Typography>
            <StyledSelect
              loading={fetchProviderOptionsLoading}
              onChange={(e) => {
                setCRMFormData({
                  ...crmFormData,
                  provider: e.target.value as string,
                });
              }}
              options={providerOptions}
              placeholder={'Select a CRM provider (Hubspot, Salesforce)'}
              value={crmFormData?.provider || ''}
            />
          </Stack>
          <Stack gap={1}>
            <Typography
              color={!crmFormData?.provider ? 'text.disabled' : 'text.primary'}
              fontWeight={700}
              variant={'body2'}
            >
              Contact list
            </Typography>
            <StyledSelect
              disabled={!crmFormData?.provider || isLoading}
              onChange={(e) => {
                setCRMFormData({
                  ...crmFormData,
                  listId: e.target.value as string,
                });
              }}
              options={listOptions}
              placeholder={'Select contact list'}
              value={crmFormData?.listId || ''}
            />
          </Stack>

          <StyledPreviewTable
            counts={crmFormData.counts}
            data={crmFormData.data || []}
            fetching={fetching}
            hasHeader={true}
            invalidCounts={crmFormData.invalidCounts}
            showSummary={true}
            validCounts={crmFormData.validCounts}
          />
        </Stack>
      </>
    );
  };

  return (
    <Stack height={'100%'} width={'100%'}>
      {providerOptions.length > 0 ? (
        renderFiledNode()
      ) : (
        <Stack
          alignItems={'center'}
          height={'100%'}
          justifyContent={'center'}
          width={'100%'}
        >
          <Typography color={'#6F6C7D'}>
            No CRM providers integrated yet.
          </Typography>
          <Typography
            color={'#6E4EFB'}
            mt={1.5}
            onClick={async () => {
              await resetDialogState();
              router.push('/settings');
            }}
            sx={{ cursor: 'pointer' }}
          >
            Manage integrations
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
