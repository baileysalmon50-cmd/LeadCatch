FROM node:22-slim

WORKDIR /app

# Install dependencies (use the lockfile for reproducibility)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Verify the build actually produced the server entry — fail loudly if not
RUN test -f .output/server/index.mjs || (echo "BUILD DID NOT PRODUCE .output/server/index.mjs" && ls -la .output/server/ && exit 1)

# Railway provides PORT at runtime; Nitro's node server reads it
ENV PORT=8080
EXPOSE 8080

CMD ["node", ".output/server/index.mjs"]
