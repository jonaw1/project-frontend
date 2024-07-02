# Build stage
FROM node:16 AS builder
WORKDIR /usr/src/frontend-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM node:16-slim
WORKDIR /app
COPY --from=builder /usr/src/frontend-app/dist ./dist
COPY --from=builder /usr/src/frontend-app/src/client ./dist/client
COPY --from=builder /usr/src/frontend-app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server/server.js"]