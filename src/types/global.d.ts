//type google = import('@types/google.maps');

interface TOption {
  key: string | number;
  value: any;
  label: string;
  disabled?: boolean;
}

interface Option {
  key: string | number;
  value: string | number;
  label: string | React.ReactNode;
  disabled?:boolean
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
