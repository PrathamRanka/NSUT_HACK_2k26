FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Disable Next.js Telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Expose port (dev mode for hot reload if volume mounted, or production build)
# For simplicity in this "all-in-one" docker setup, we will use dev mode or build.
# Let's use production build for stability.
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
