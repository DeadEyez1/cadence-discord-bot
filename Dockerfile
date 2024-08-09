ARG NODE_VERSION=22

# Use Node.js image as the base image
FROM node:${NODE_VERSION}-bookworm-slim

# Set working directory
WORKDIR /app

# Install build dependencies necessary for native modules and clean up in one layer
RUN apt-get update && apt-get install -y python3 make build-essential ffmpeg ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm

# Copy only necessary source files
COPY package.json pnpm-lock.yaml ./ 
COPY tsconfig.json ./ 
COPY src/ ./src/ 
COPY config/ ./config/ 
COPY locales/ ./locales/ 

# Fetch dependencies to virtual store
RUN pnpm fetch

# Install dependencies
RUN pnpm install --offline --frozen-lockfile

# Build the application
RUN pnpm build

# Cleanup unnecessary packages to minimize image size
RUN apt-get purge -y python3 && apt-get autoremove -y

# Start the application
CMD ["/bin/sh", "-c", "pnpm run deploy && pnpm start"]