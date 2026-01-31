# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# API URL for production - nginx proxies /api to server
ENV VITE_API_URL=/api

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage - nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
