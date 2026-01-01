# === Stage 1: builder ===
FROM node:20-alpine AS builder
WORKDIR /app

# Install build tools (if you need node-gyp native builds you can add build-base, python here)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig*.json ./
COPY src ./src
COPY nest-cli.json ./
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build

# === Stage 2: runtime ===
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user for safety
RUN addgroup -S app && adduser -S -G app app

# Copy package.json & production deps, then install only production deps
COPY package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN npm ci --production
RUN npx prisma generate

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# If you have assets/static, copy them too:
# COPY --from=builder /app/public ./public

USER app
EXPOSE 3000
CMD ["node", "dist/main.js"]