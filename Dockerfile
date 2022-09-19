FROM zenika/alpine-chrome:with-puppeteer

USER root
ENV NODE_ENV=development
WORKDIR /src

COPY ./ ./
RUN npm install
RUN npm run build

EXPOSE 8080
RUN npm run start
