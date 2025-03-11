import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  CardHeader,
  debounce,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { differenceInDays } from 'date-fns';

import { SDRToast, StyledTextField } from '@/components/atoms';

import { ReceiptTypeEnum, useInboxStore } from '@/stores/useInboxStore';
import { useAsyncFn } from '@/hooks';
import { _fetchEmails, _fetchEmailsDetails } from '@/request';
import { HttpError } from '@/types';

export const InboxSide: FC = () => {
  const {
    receiptType,
    setReceiptType,
    inboxSideList,
    selectedEmail,
    setSelectedEmail,
    setInboxSideList,
    setInboxContentList,
    setInboxSideSentList,
    inboxSideSentList,
    setFetchEmailLoading,
  } = useInboxStore((state) => state);
  const [contacts, setContacts] = useState('');

  const [, fetchEmails] = useAsyncFn(
    async (emailType: ReceiptTypeEnum, contacts?: string) => {
      setFetchEmailLoading(true);
      try {
        const res = await _fetchEmails({
          page: 0,
          size: 10,
          emailType,
          searchContact: contacts,
        });
        if (Array.isArray(res.data.content)) {
          if (emailType === ReceiptTypeEnum.engaged) {
            setInboxSideList(res.data.content);
            res.data.content.length > 0 &&
              setSelectedEmail(res.data.content[0]);
          }
          if (emailType === ReceiptTypeEnum.sent) {
            res.data.content.length > 0 &&
              setSelectedEmail(res.data.content[0]);
            setInboxSideSentList(res.data.content);
          }
          setFetchEmailLoading(false);
          res.data.content.length > 0
            ? await fetchEmailDetails(res.data.content[0].emailId)
            : setInboxContentList([]);
        }
      } catch (e) {
        setFetchEmailLoading(false);
        const { message, header, variant } = e as HttpError;
        SDRToast({ message, header, variant });
      }
    },
  );

  const debounceSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        await fetchEmails(receiptType, value);
      }, 500),

    [receiptType],
  );

  const handleChange = async (
    _event: SyntheticEvent,
    newValue: ReceiptTypeEnum,
  ) => {
    // setValue(newValue);
    setReceiptType(newValue);
    await fetchEmails(newValue);
  };

  const [, fetchEmailDetails] = useAsyncFn(async (emailId: number) => {
    try {
      const res = await _fetchEmailsDetails(emailId);
      if (
        Array.isArray(res.data.emailInfos) &&
        res.data.emailInfos.length > 0
      ) {
        setInboxContentList(res.data.emailInfos);
      }
    } catch (e) {
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  useEffect(() => {
    fetchEmails(ReceiptTypeEnum.engaged);
  }, []);

  return (
    <Stack borderRight={'1px solid #DFDEE6'} width={320}>
      <Stack gap={3} p={2.5}>
        <Tabs
          aria-label="wrapped label tabs example"
          onChange={handleChange}
          sx={{
            minHeight: 'auto',
            '& .MuiTab-root': {
              p: 0,
              width: '50%',
              minHeight: 'auto',
              height: 'fit-content',
              pb: 1.5,
              textTransform: 'none',
              color: '#6F6C7D',
              fontSize: 12,
              fontWeight: 600,
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#2A292E',
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#2A292E',
            },
          }}
          value={receiptType}
        >
          <Tab label={'Engaged'} value={ReceiptTypeEnum.engaged} />
          <Tab label={'Sent'} value={ReceiptTypeEnum.sent} />
        </Tabs>
        <StyledTextField
          onChange={async (e) => {
            setContacts(e.target.value);
            await debounceSearch(e.target.value);
          }}
          placeholder={'Search contacts...'}
          value={contacts}
        />
      </Stack>

      {(receiptType === ReceiptTypeEnum.engaged
        ? inboxSideList
        : inboxSideSentList
      ).map((item, index) => (
        <CardHeader
          avatar={
            <Avatar
              src={item.avatar || undefined}
              sx={{
                bgcolor: 'background.avatar_defaultBg',
                height: 32,
                width: 32,
              }}
            >
              {item.name?.[0]?.toUpperCase()}
            </Avatar>
          }
          key={index}
          onClick={async () => {
            if (receiptType === ReceiptTypeEnum.engaged) {
              setInboxSideList(
                inboxSideList.map((inbox) => {
                  if (inbox.emailId === item.emailId) {
                    return { ...inbox, read: true };
                  }
                  return inbox;
                }),
              );
            }
            setSelectedEmail(item);
            await fetchEmailDetails(item.emailId);
          }}
          subheader={
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                component={'div'}
                maxWidth={210}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                variant={'subtitle2'}
              >
                You: {item.subject}
              </Typography>
              {receiptType === ReceiptTypeEnum.engaged && (
                <Box
                  bgcolor={item.read ? 'transparent' : '#6E4EFB'}
                  borderRadius={'10px'}
                  height={10}
                  width={10}
                ></Box>
              )}
            </Stack>
          }
          sx={{
            px: 2.5,
            py: 1.5,
            '&:hover': {
              bgcolor: '#F8F8FA',
            },
            cursor: 'pointer',
            bgcolor:
              selectedEmail?.emailId === item.emailId
                ? '#F8F8FA'
                : 'transparent',
          }}
          title={
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
            >
              <Typography variant={'subtitle2'}>{item.name}</Typography>
              <Typography variant={'subtitle3'}>
                {differenceInDays(new Date(), new Date(item.sentOn))} days
              </Typography>
            </Stack>
          }
        />
      ))}
    </Stack>
  );
};
