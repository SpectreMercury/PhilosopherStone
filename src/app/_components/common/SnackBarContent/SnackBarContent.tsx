import React from 'react';
import { SnackbarContent, SnackbarContentProps } from 'notistack';

interface CustomSnackbarProps extends SnackbarContentProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  message: React.ReactNode;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ message, variant, ...otherProps }) => {
  const bgClass = {
    success: 'success-function',
    error: 'error-function',
    warning: 'warning-function',
    info: 'bg-blue-500',
  }[variant];

  return (
    <SnackbarContent className={`${bgClass} text-white p-4`} {...otherProps}>
      {message}
    </SnackbarContent>
  );
};

export default CustomSnackbar;
