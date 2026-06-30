FROM node:22-slim
WORKDIR /app

# Install only runtime dependencies (build is already done locally)
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy everything, including the pre-built .output committed to the repo
COPY . .

# Sanity check: the committed build output must be present
RUN test -f .output/server/index.mjs || (echo "MISSING .output/server/index.mjs — run npm run build locally and commit .output" && exit 1)

ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080

CMD ["node", ".output/server/index.mjs"]
