import { startSporeServerNextHandler } from 'spore-graphql/next';
import { predefinedSporeConfigs } from '@spore-sdk/core';

export const fetchCache = 'force-no-store';
export const maxDuration = 300;

const handler = startSporeServerNextHandler(predefinedSporeConfigs.Aggron4);
export { handler as GET, handler as POST };