# ==========================================
# Stage 1: Build & Compile
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including TypeScript)
COPY package*.json ./
RUN npm ci

# Copy the rest of the backend source code
COPY . .

# Compile TypeScript to JavaScript (creates the /dist folder)
RUN npm run build

# Remove development dependencies to save space for the next stage
RUN npm prune --production


# ==========================================
# Stage 2: Final Production Runner
# ==========================================
FROM node:20-alpine AS runner

# Set production environment
ENV NODE_ENV=production
WORKDIR /app

# Safely copy only the compiled code and production dependencies from Stage 1
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Use the built-in, unprivileged 'node' user for security
USER node

# Expose your backend port
EXPOSE 5000

# Run the compiled JavaScript directly with Node
CMD ["node", "dist/server.js"]