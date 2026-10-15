import WS from 'ws';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = WS;
}

console.log('[ws-preload] WebSocket set:', typeof globalThis.WebSocket);
