type SegmentsListItem = {
  segmentId: number;
  segmentName: string;
  contacts: number;
  lastEdit: string;
};

export type SegmentsListResponse = PaginationResponse<SegmentsListItem[]>;
