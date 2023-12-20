/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Cell = {
  __typename?: 'Cell';
  blockHash?: Maybe<Scalars['String']['output']>;
  blockNumber?: Maybe<Scalars['String']['output']>;
  cellOutput: CellOutput;
  data: Scalars['String']['output'];
  outPoint?: Maybe<OutPoint>;
  txIndex?: Maybe<Scalars['String']['output']>;
};

export type CellOutput = {
  __typename?: 'CellOutput';
  capacity: Scalars['String']['output'];
  lock: Script;
  type?: Maybe<Script>;
};

export type Cluster = {
  __typename?: 'Cluster';
  capacityMargin?: Maybe<Scalars['String']['output']>;
  cell?: Maybe<Cell>;
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  spores?: Maybe<Array<Spore>>;
};


export type ClusterSporesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SporeFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<QueryOrder>;
};

export type ClusterFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  mintableBy?: InputMaybe<Scalars['String']['input']>;
};

export enum HashType {
  Data = 'data',
  Data1 = 'data1',
  Type = 'type'
}

export type OutPoint = {
  __typename?: 'OutPoint';
  index: Scalars['String']['output'];
  txHash: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  cluster?: Maybe<Cluster>;
  clusterCount: Scalars['Int']['output'];
  clusters?: Maybe<Array<Cluster>>;
  mintableClusters?: Maybe<Array<Cluster>>;
  spore?: Maybe<Spore>;
  sporeCount: Scalars['Int']['output'];
  spores?: Maybe<Array<Spore>>;
  topClusters?: Maybe<Array<Cluster>>;
};


export type QueryClusterArgs = {
  id: Scalars['String']['input'];
};


export type QueryClustersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ClusterFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<QueryOrder>;
};


export type QueryMintableClustersArgs = {
  address: Scalars['String']['input'];
};


export type QuerySporeArgs = {
  id: Scalars['String']['input'];
};


export type QuerySporeCountArgs = {
  filter?: InputMaybe<SporeFilterInput>;
};


export type QuerySporesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SporeFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<QueryOrder>;
};


export type QueryTopClustersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<TopClusterFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export enum QueryOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type Script = {
  __typename?: 'Script';
  args: Scalars['String']['output'];
  codeHash: Scalars['String']['output'];
  hashType: HashType;
};

export type Spore = {
  __typename?: 'Spore';
  capacityMargin?: Maybe<Scalars['String']['output']>;
  cell?: Maybe<Cell>;
  cluster?: Maybe<Cluster>;
  clusterId?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  contentType: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type SporeFilterInput = {
  addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  clusterIds?: InputMaybe<Array<Scalars['String']['input']>>;
  contentTypes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type TopClusterFilterInput = {
  mintableBy?: InputMaybe<Scalars['String']['input']>;
};
