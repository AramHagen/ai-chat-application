FROM node:22.12-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

ARG API_BASE_URL=http://localhost:3000/api
ENV API_BASE_URL=$API_BASE_URL

RUN node scripts/set-env.js && node_modules/.bin/ng build --configuration production

FROM node:22.12-alpine

WORKDIR /app

RUN npm install -g serve@14

COPY --from=builder /app/dist/chat-frontend/browser ./dist

EXPOSE 3000

CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT:-3000}"]
