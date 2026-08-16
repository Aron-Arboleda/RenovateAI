# ---- Build stage (optional, for faster startup) ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build   # (if you have a build step – n8n does not need it)

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env.example ./
COPY --from=builder /app/n8n ./n8n
EXPOSE 3000
CMD ["node", "n8n/n8n.js", "--host", "0.0.0.0", "--port", "3000"]