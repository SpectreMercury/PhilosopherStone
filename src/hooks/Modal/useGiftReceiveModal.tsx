import { useState } from "react";

export const useGiftReceiveModal = () => {
  const [isGiftReceiveModalOpen, setGiftReceiveModalIsOpen] = useState(false);

  const openGiftReceiveModal = () => setGiftReceiveModalIsOpen(true);
  const closeGiftReceiveModal = () => setGiftReceiveModalIsOpen(false);

  return { isGiftReceiveModalOpen, openGiftReceiveModal, closeGiftReceiveModal };
};
