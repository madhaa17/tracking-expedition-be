FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN bash -c "set -a && source .env && npm run seed"

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
