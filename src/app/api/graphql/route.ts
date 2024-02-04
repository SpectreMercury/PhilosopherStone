import { startSporeServerNextHandler } from 'spore-graphql/next';
import { predefinedSporeConfigs } from '@spore-sdk/core';
import { sporeConfig } from '@/utils/config';

export const fetchCache = 'force-no-store';
export const maxDuration = 300;

const handler = startSporeServerNextHandler(sporeConfig);
export { handler as GET, handler as POST };
