import { CellOutput, OutPoint } from 'spore-graphql';

export type QuerySpore = {
  id: string;
  contentType: string;
  clusterId?: string | null;
  capacityMargin?: string | null;
  cluster?: {
    id: string;
    name: string;
    description: string;
  } | null;
  cell?: {
    cellOutput: Pick<CellOutput, 'capacity' | 'lock'>;
    outPoint?: OutPoint | null;
  } | null;
};

export type QueryCluster = {
  id: string;
  name: string;
  description: string;
  capacityMargin?: string | null;
  spores?: QuerySpore[] | null;
  cell?: {
    cellOutput: Pick<CellOutput, 'capacity' | 'lock'>;
    outPoint?: OutPoint | null;
  } | null;
};
