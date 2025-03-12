import {
  FC,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { format, isSameDay } from 'date-fns';

import { SDRToast, StyledTextField } from '@/components/atoms';

import { ReceiptTypeEnum, useInboxStore } from '@/stores/useInboxStore';
import { useAsyncFn, useContainerHeight } from '@/hooks';
import { _fetchEmails, _fetchEmailsDetails } from '@/request';
import { HttpError, SSE_EVENT_TYPE } from '@/types';
import { useUserStore } from '@/provides';

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
    totalEmails,
    setTotalEmails,
    updateEmailIsRead,
    unshiftInboxSideList,
    setFetchEmailDetailsLoading,
  } = useInboxStore((state) => state);
  const { userProfile } = useUserStore((state) => state);

  const [contacts, setContacts] = useState('');
  const [scrollLoading, setScrollLoading] = useState(false);
  const [engagedPage, setEngagedPage] = useState(0);
  const [sentPage, setSentPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerHeight = useContainerHeight(scrollRef);
  const defaultPageSize = Math.floor(containerHeight / 65) + 5;

  const [, fetchEmails] = useAsyncFn(
    async (
      emailType: ReceiptTypeEnum,
      contacts?: string,
      page = 0,
      size = 20,
    ) => {
      setFetchEmailLoading(true);
      try {
        const res = await _fetchEmails({
          page,
          size,
          emailType,
          searchContact: contacts,
        });
        if (Array.isArray(res.data.content)) {
          if (emailType === ReceiptTypeEnum.engaged) {
            setInboxSideList(res.data.content);
            res.data.content.length > 0 &&
              setSelectedEmail(res.data.content[0]);
            setTotalEmails(res.data.page.totalElements);
          }
          if (emailType === ReceiptTypeEnum.sent) {
            res.data.content.length > 0 &&
              setSelectedEmail(res.data.content[0]);
            setInboxSideSentList(res.data.content);
            setTotalEmails(res.data.page.totalElements);
          }
          setFetchEmailLoading(false);
          res.data.content.length > 0
            ? await fetchEmailDetails(res.data.content[0].emailId)
            : setInboxContentList([]);
        }
        return res;
      } catch (e) {
        setFetchEmailLoading(false);
        const { message, header, variant } = e as HttpError;
        SDRToast({ message, header, variant });
      }
    },
  );

  const [, scrollFetchEmails] = useAsyncFn(
    async (emailType: ReceiptTypeEnum, contacts?: string, page = 0) => {
      try {
        setScrollLoading(true);
        const res = await _fetchEmails({
          page,
          size: 10,
          emailType,
          searchContact: contacts,
        });
        if (Array.isArray(res.data.content)) {
          if (emailType === ReceiptTypeEnum.engaged) {
            setInboxSideList(inboxSideList.concat(res.data.content));
          }
          if (emailType === ReceiptTypeEnum.sent) {
            setInboxSideSentList(inboxSideSentList.concat(res.data.content));
          }
        }
        setScrollLoading(false);
        return res;
      } catch (e) {
        setScrollLoading(false);
        const { message, header, variant } = e as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    [inboxSideList, inboxSideSentList],
  );

  const debounceSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        await fetchEmails(receiptType, value, 0, defaultPageSize);
      }, 500),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receiptType, defaultPageSize],
  );

  const handleChange = async (
    _event: SyntheticEvent,
    newValue: ReceiptTypeEnum,
  ) => {
    // setValue(newValue);
    setReceiptType(newValue);
    await fetchEmails(newValue, contacts, 0, defaultPageSize);
  };

  const [, fetchEmailDetails] = useAsyncFn(async (emailId: number) => {
    try {
      setFetchEmailDetailsLoading(true);
      const res = await _fetchEmailsDetails(emailId);
      if (
        Array.isArray(res.data.emailInfos) &&
        res.data.emailInfos.length > 0
      ) {
        setInboxContentList(res.data.emailInfos);
      }
      setFetchEmailDetailsLoading(false);
    } catch (e) {
      setFetchEmailDetailsLoading(false);
      const { message, header, variant } = e as HttpError;
      SDRToast({ message, header, variant });
    }
  });

  const currentNumber =
    receiptType === ReceiptTypeEnum.engaged
      ? inboxSideList.length
      : inboxSideSentList.length;

  const handleScroll = async (e: SyntheticEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop < clientHeight + 300 &&
      !scrollLoading &&
      currentNumber < totalEmails
    ) {
      await scrollFetchEmails(receiptType, contacts, engagedPage + 1);
      if (receiptType === ReceiptTypeEnum.engaged) {
        setEngagedPage(engagedPage + 1);
      } else {
        setSentPage(sentPage + 1);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      // if (inboxSideSentList.length === 0 || inboxSideSentList.length === 0) {
      // noinspection JSIgnoredPromiseFromCall
      fetchEmails(ReceiptTypeEnum.engaged, '', 0, defaultPageSize);
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('register');
    const PERSIST_DATA = JSON.parse(
      localStorage.getItem('PERSIST_DATA') || '{}',
    );

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BASE_URL}/sdr/inbox/email/notify/subscriber/${PERSIST_DATA?.state?.accountId || ''}`,
    );
    // recieve message
    eventSource.onmessage = function (event) {
      // onMessage?.(event);
      const { data } = event;
      if (data !== 'heartbeat') {
        const notification = JSON.parse(data);
        const { event } = notification;
        if (notification.tenantId === userProfile?.tenantId) {
          if (event === SSE_EVENT_TYPE.new_email) {
            const data = notification.data;
            unshiftInboxSideList(data.data);
          }
          if (event === SSE_EVENT_TYPE.new_reply) {
            const emailId = notification.emailId;
            updateEmailIsRead(emailId);
          }
        }
      }
    };

    // clear
    return () => {
      console.log('clear');
      eventSource?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Stack flex={1} onScroll={handleScroll} overflow={'auto'} ref={scrollRef}>
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
                  {isSameDay(new Date(), new Date(item.sentOn))
                    ? format(new Date(item.sentOn), 'HH:mm')
                    : format(new Date(item.sentOn), 'yyyy/MM/dd')}
                </Typography>
              </Stack>
            }
          />
        ))}
      </Stack>
    </Stack>
  );
};
