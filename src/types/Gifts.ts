export interface Gift {
  id: string;
  name: string;
  occupid: string;
  image: string;
}

export interface GiftListProps {
  gifts: Gift[];
  onGiftClick: (id: string) => void;
  onNewGiftClick?: () => void;
}