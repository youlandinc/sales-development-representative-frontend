import { FC } from 'react';
import { Toaster as Sonner, ToasterProps } from 'sonner';

export const ToastProvider: FC<ToasterProps> = (props) => {
  return <Sonner position={'top-right'} {...props} />;
};
