import { useState } from 'react';

const useLoadingOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showOverlay = () => setIsVisible(true);
  const hideOverlay = () => setIsVisible(false);

  return { isVisible, showOverlay, hideOverlay };
};

export default useLoadingOverlay;
