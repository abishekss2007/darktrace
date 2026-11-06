FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY dist/index.js ./dist/index.js
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", "dist/index.js"]
