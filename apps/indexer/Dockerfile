FROM node:20-alpine

WORKDIR /app

COPY dist/index.js ./dist/index.js
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "dist/index.js"]
