# Production Dockerfile for Unified Enterprise Outreach Suite
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code and build frontend
COPY . .
RUN npm run build

# Expose port
EXPOSE 3010

# Environment setup
ENV NODE_ENV=production
ENV PORT=3010

# Start server
CMD ["node", "server.js"]
