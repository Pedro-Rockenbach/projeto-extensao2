FROM node:22-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./frontend/
RUN cd frontend && (npm ci || npm install)

COPY frontend ./frontend
COPY shared ./shared

WORKDIR /app/frontend
RUN npm run build

FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
