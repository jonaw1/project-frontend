# Build stage
FROM node:latest AS builder
WORKDIR /usr/src/frontend-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM node:slim
WORKDIR /app
COPY --from=builder /usr/src/frontend-app/dist ./dist
#COPY --from=builder /usr/src/frontend-app/db ./db
COPY --from=builder /usr/src/frontend-app/src/client ./dist/client
COPY --from=builder /usr/src/frontend-app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server/server.js"]