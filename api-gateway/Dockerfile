FROM node:18-alpine

WORKDIR /app

# Copy Common Library
COPY common ./common

# Install Common Deps & Build
WORKDIR /app/common
RUN npm install
RUN npm run build

# Setup API Gateway
WORKDIR /app/api-gateway
COPY api-gateway/package*.json ./
RUN npm install

# Copy source code
COPY api-gateway .

# Link common (if needed, or simplistic copy usage)
# Since we are in monorepo-ish structure, we ensure node_modules can find it
# For now, let's assume direct import or npm link. 
# Better: Install common as a file dependency if package.json supported it.
# But since error is TS2307, let's just make sure it's available.
# Actually, let's try to install it.
RUN npm install ../common

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Run the application
CMD ["npm", "start"]
