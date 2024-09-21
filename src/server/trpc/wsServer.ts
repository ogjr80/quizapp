import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { createHeritageContext } from './context';
import { appRouter } from './main';

const wss = new ws.Server({
    port: 3001,
});
const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: createHeritageContext as any,
    // Enable heartbeat messages to keep connection open (disabled by default)
    keepAlive: {
        enabled: true,
        // server ping message interval in milliseconds
        pingMs: 30000,
        // connection is terminated if pong message is not received in this many milliseconds
        pongWaitMs: 5000,
    },
});

wss.on('connection', (ws: any) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
        console.log(`➖➖ Connection (${wss.clients.size})`);
    });
});
console.log('✅ WebSocket Server listening on ws://localhost:3001');

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
    wss.close();
});

console.log("WSS SERVER")