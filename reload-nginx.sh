#!/bin/bash
# save as reload-nginx.sh

# Check if certificates exist
if [ -f /etc/letsencrypt/live/pubali.dev/fullchain.pem ]; then
    echo "Certificates found for pubali.dev, reloading nginx..."
    nginx -s reload
    echo "Nginx reloaded with SSL configuration for pubali.dev"
else
    echo "Certificate for pubali.dev not found yet"
fi