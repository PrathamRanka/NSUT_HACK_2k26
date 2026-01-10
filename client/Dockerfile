FROM node:18-alpine

WORKDIR /app

# Copy Common Library
COPY common ./common

# Install Common Deps & Build
WORKDIR /app/common
RUN npm install
RUN npm run build

# Setup Client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

# Copy source
COPY client .

# Common package is installed via package.json file dependency

# Disable Next.js Telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
