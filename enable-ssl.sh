#!/bin/bash
# save as enable-ssl.sh

# Check if certificates exist
if [ -f /etc/letsencrypt/live/pubali.dev/fullchain.pem ]; then
    # Rename the SSL config files to enable them
    mv /etc/nginx/conf.d/ssl.conf.disabled /etc/nginx/conf.d/ssl.conf
    # Reload Nginx
    nginx -s reload
    echo "SSL configuration enabled for pubali.dev"
else
    echo "Certificate for pubali.dev not found"
fi

if [ -f /etc/letsencrypt/live/api.pubali.dev/fullchain.pem ]; then
    # Rename the SSL config files to enable them
    mv /etc/nginx/conf.d/ssl_api.conf.disabled /etc/nginx/conf.d/ssl_api.conf
    # Reload Nginx
    nginx -s reload
    echo "SSL configuration enabled for api.pubali.dev"
else
    echo "Certificate for api.pubali.dev not found"
fi