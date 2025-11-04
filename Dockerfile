# syntax=docker/dockerfile:1

# Use Node.js LTS Alpine for smaller image size
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build

# Install serve globally for serving static files
RUN npm install -g serve

# Expose port 3000 (serve's default)
EXPOSE 3000

# Serve the dist folder on port 3000
# -s flag enables single-page app mode (serves index.html for all routes)
# -l flag sets the listen address and port (must bind to 0.0.0.0 for Fly.io)
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3000"]
