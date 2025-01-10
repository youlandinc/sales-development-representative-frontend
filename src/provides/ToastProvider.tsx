import { FC } from 'react';
import { Toaster, ToasterProps } from 'sonner';

export const ToastProvider: FC<ToasterProps> = (props) => {
  return <Toaster position={'top-right'} {...props} />;
};
