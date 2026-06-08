# ==========================================
# Stage 1: Development & Compilation Base
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install ALL dependencies (including devDependencies like tsx)
RUN npm ci

# Copy the rest of your backend source code
COPY . .

# Compile TypeScript to JavaScript for production tracking
RUN npm run build


# ==========================================
# Stage 2: Final Lean Production Runner
# ==========================================
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy package files to run a localized production prune
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Prune devDependencies ONLY in this final deployment layer
RUN npm prune --production

# Use the built-in, unprivileged 'node' user for security
USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]