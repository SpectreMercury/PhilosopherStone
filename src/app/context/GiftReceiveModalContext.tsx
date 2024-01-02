import React, { ReactNode, createContext, useContext, useState } from 'react';

interface GiftReceiveModalContextProps {
  isGiftReceiveModalOpen: boolean;
  openGiftReceiveModal: () => void;
  closeGiftReceiveModal: () => void;
}

const GiftReceiveModalContext = createContext<GiftReceiveModalContextProps>({
  isGiftReceiveModalOpen: false,
  openGiftReceiveModal: () => {},
  closeGiftReceiveModal: () => {},
});

export const useGiftReceiveModal = () => useContext(GiftReceiveModalContext);

export const GiftReceiveModalProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isGiftReceiveModalOpen, setIsGiftReceiveModalOpen] = useState(false);

  const openGiftReceiveModal = () => setIsGiftReceiveModalOpen(true);
  const closeGiftReceiveModal = () => setIsGiftReceiveModalOpen(false);

  return (
    <GiftReceiveModalContext.Provider value={{ isGiftReceiveModalOpen, openGiftReceiveModal, closeGiftReceiveModal }}>
      {children}
    </GiftReceiveModalContext.Provider>
  );
};
