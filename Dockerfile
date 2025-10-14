FROM 348152033681.dkr.ecr.us-west-1.amazonaws.com/eclipse-temurin:17.0.3_7-jre/node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN npm cache clean --force
RUN rm -rf node_modules

RUN npm install --location=global pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

ENV PORT 8080

EXPOSE 8080

CMD ["pnpm", "start"]
