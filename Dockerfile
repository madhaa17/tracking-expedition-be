FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci && npm cache clean --force 

COPY . .

# Tambahkan generate prisma client sebelum build
RUN npx prisma generate

RUN npm run build

RUN npm prune --production 

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /usr/src/app

USER nestjs

EXPOSE 3000
CMD ["npm", "run", "start:prod"]