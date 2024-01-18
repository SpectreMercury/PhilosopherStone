import { useState } from 'react';

const useLoadingOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progressStatus, setProgressStatus] = useState<'pending' | 'done'>('pending');

  const showOverlay = () => {
    setIsVisible(true);
    setProgressStatus('pending');
  };

  const hideOverlay = () => {
    setIsVisible(false);
    setProgressStatus('done');
  };

  return { isVisible, showOverlay, hideOverlay, progressStatus, setProgressStatus };
};

export default useLoadingOverlay;
