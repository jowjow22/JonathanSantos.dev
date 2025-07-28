FROM node:22-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app


COPY package.json package-lock.json*  ./

RUN npm ci

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments for client-side environment variables
# Note: These will be visible in the client bundle
ARG VITE_DEV_API_KEY
ARG VITE_MY_CONTACT_EMAIL  
ARG VITE_DEV_API_BASE_URL=https://dev.to/api

# Set environment variables for Vite build
ENV VITE_DEV_API_KEY=$VITE_DEV_API_KEY
ENV VITE_MY_CONTACT_EMAIL=$VITE_MY_CONTACT_EMAIL
ENV VITE_DEV_API_BASE_URL=$VITE_DEV_API_BASE_URL

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 reactjs

# Copy the built application from the builder stage
COPY --from=builder --chown=reactjs:nodejs /app/dist ./dist

# Install serve globally to serve the static files
RUN npm install -g serve

USER reactjs

EXPOSE 3000

ENV PORT=3000

CMD ["serve", "-s", "dist", "-l", "3000"]

