# FROM zenika/alpine-chrome:with-puppeteer

# USER root
# ENV NODE_ENV=development
# WORKDIR /src

# COPY ./ ./
# RUN npm install
# RUN npm run build

# EXPOSE 8080
# RUN npm run start
# CMD ["npm", "run", "start"]


# Install dependencies only when needed
FROM zenika/alpine-chrome:with-puppeteer AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN npm ci

ENV NEXT_TELEMETRY_DISABLED 1

# Add `ARG` instructions below if you need `NEXT_PUBLIC_` variables
# then put the value on your fly.toml
# Example:
# ARG NEXT_PUBLIC_EXAMPLE="value here"

RUN npm run build

# Production image, copy all the files and run next
FROM zenika/alpine-chrome:with-puppeteer AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app ./

USER nextjs

ENV PORT 3000

CMD ["npm", "run", "start"]
