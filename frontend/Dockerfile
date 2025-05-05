# Frontend Dockerfile
FROM node:20-alpine3.20 As build

WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Serve with Nginx
FROM nginx:stable-alpine as production

COPY --from=build /app/nginx /etc/nginx/conf.d

# Copy custom nginx config if needed
COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
