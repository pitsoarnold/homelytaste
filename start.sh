#!/bin/bash
cd /var/www/homely-taste-site
export NITRO_PORT=3000
export NITRO_HOST=127.0.0.1
export NODE_ENV=production
exec node --env-file=/var/www/homely-taste-site/.env /var/www/homely-taste-site/.output/server/index.mjs
