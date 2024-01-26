export interface Gift {
  id: string;
  name: string;
  occupid: string;
  image: string;
}

export interface GiftProps {
  [key: string]: string;
}

export interface ReceivedGift {
  id: string;
  date: string;
}

export interface GiftListProps {
  gifts: Gift[];
  onGiftClick: (id: string) => void;
  onNewGiftClick?: () => void;
}

export interface GiftItem {
  id: string;
  contentType: string;
  capacityMargin: string;
  cell: Cell;
}

export interface Cell {
  cellOutput: CellOutput;
  outPoint: OutPoint;
}

export interface CellOutput {
  capacity: string;
  lock: Lock;
}

export interface Lock {
  args: string;
  codeHash: string;
  hashType: string;
}

export interface OutPoint {
  txHash: string;
  index: string;
}
