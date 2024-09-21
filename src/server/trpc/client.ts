import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './main';

export const heritageClient = createTRPCReact<AppRouter>();
