import { del, get, post, put } from '../request';
import {
  ContactsTableTypeEnum,
  SegmentOptionResponseList,
  SegmentsListResponse,
} from '@/types';

const tempUrl = 'https://test-pos-api.youland.com';

export const _createNewSegment = (params: any) => {
  return post('/sdr/segment/info', params);
};

export const _updateExistSegment = (params: any) => {
  return put(`${tempUrl}/customer/segments/update`, params);
};

export const _fetchSegmentOptions = (tableId: ContactsTableTypeEnum) => {
  return get<SegmentOptionResponseList>(`/sdr/segment/options/${tableId}`);
};

export const _fetchSegmentDetailsBySegmentId = (segmentId: string | number) => {
  return get(`/sdr/segment/info/${segmentId}`);
};

export const _fetchSegmentsList = (param: { page: number; size: number }) => {
  return post<SegmentsListResponse>('/sdr/segment/list', param);
};

export const _renameExistSegment = (params: {
  segmentsId: string | number;
  segmentName: string;
}) => {
  return put(`${tempUrl}/customer/segments/rename`, params);
};

export const _deleteExistSegment = (segmentId: string | number) => {
  return del(`/sdr/segment/info/${segmentId}`);
};

export const _updateSelectedSegment = (params: {
  segmentId: string | number;
}) => {
  return post(`${tempUrl}/customer/user/config`, params);
};
