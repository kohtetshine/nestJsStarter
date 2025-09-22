FROM node:20-bookworm AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production=false

FROM node:20-bookworm AS development
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npx prisma generate

FROM node:20-bookworm AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]
