//type google = import('@types/google.maps');

interface TOption {
  key: string;
  value: string | number;
  label: string;
}

interface Option {
  key: string | number;
  value: string | number;
  label: string | React.ReactNode;
  subComponent?: React.ReactNode;
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

interface HttpError {
  message: string;
  header: string;
  variant: HttpVariant;
}

//interface Window {
//  google: typeof google;
//}
