# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose the port (Render sets this env var automatically)
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]