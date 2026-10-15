#!/bin/bash
set -e
cd /var/www/homely-taste-site

echo "📦 Building..."
rm -rf .output
NITRO_PRESET=node-server NODE_ENV=production bun run build

echo "🔧 Patching WebSocket for Supabase Realtime..."
cp .output/server/_libs/supabase__realtime-js.mjs .output/server/_libs/supabase__realtime-js.mjs.bak
{
  echo "import { createRequire as __cr } from 'module';"
  echo "const __req = __cr(import.meta.url);"
  echo "const __WS = __req('/var/www/homely-taste-site/node_modules/ws');"
  echo "Object.defineProperty(globalThis, 'WebSocket', { value: __WS, writable: true, configurable: true });"
  echo "console.log('[patch] WebSocket:', typeof globalThis.WebSocket);"
  cat .output/server/_libs/supabase__realtime-js.mjs.bak
} > .output/server/_libs/supabase__realtime-js.mjs
rm .output/server/_libs/supabase__realtime-js.mjs.bak

echo "🔐 Patching CSRF for reverse proxy..."
node << 'ENDOFNODE'
const fs = require('fs');
const origin = 'https://homelytaste.co.ls';
const files = fs.readdirSync('.output/server/_ssr')
  .filter(f => (f.startsWith('server-') || f.startsWith('start-')) && f.endsWith('.mjs'));
for (const f of files) {
  const p = '.output/server/_ssr/' + f;
  let c = fs.readFileSync(p, 'utf8');
  const before = c;
  c = c.replace(
    /createCsrfMiddleware\(\{\s*filter:\s*\(ctx\)\s*=>\s*ctx\.handlerType\s*===\s*"serverFn"\s*\}\)/g,
    'createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn", origin: ' + JSON.stringify(origin) + ' })'
  );
  if (c !== before) {
    fs.writeFileSync(p, c);
    console.log('  ✅ ' + f);
  }
}
ENDOFNODE

echo "♻️  Restarting PM2..."
pm2 restart homely-taste

echo "✅ Deploy complete"
