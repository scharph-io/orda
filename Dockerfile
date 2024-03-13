# Use the official Node.js image as the base image
FROM node:alpine3.19 as builder-node
RUN apk update && apk add make

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY web/client/package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the container
COPY web/client .

# Build the Angular app for production
RUN npm run build

FROM golang:alpine AS base
WORKDIR /src
RUN --mount=type=cache,target=/go/pkg/mod/ \
      --mount=type=bind,source=go.sum,target=go.sum \
      --mount=type=bind,source=go.mod,target=go.mod \
      go mod download -x

FROM base AS build-server
COPY --from=builder-node /app/dist web/client/dist
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,target=. \
    go build -o /bin/server ./cmd/server

FROM scratch AS server
COPY --from=build-server /bin/server /bin/
ENTRYPOINT [ "/bin/server" ]

