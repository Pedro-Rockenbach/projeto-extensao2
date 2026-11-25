FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY backend ./backend
COPY shared ./shared

EXPOSE 3000
CMD ["node", "backend/src/server.js"]
