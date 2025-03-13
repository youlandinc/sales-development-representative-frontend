//type google = import('@types/google.maps');

interface TOption {
  key: string;
  value: string | number;
  label: string;
}

interface PaginationParam {
  page: number;
  size: number;
}

interface PaginationResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

//interface Window {
//  google: typeof google;
//}
