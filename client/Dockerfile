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

RUN npm install -g serve

COPY --from=builder /app/dist/chat-frontend/browser ./dist

CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
