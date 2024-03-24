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
COPY web/client/asset.go web/client/asset.go
COPY internal internal
COPY cmd cmd
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,source=go.sum,target=go.sum \
    --mount=type=bind,source=go.mod,target=go.mod \
    go build -o /bin/server ./cmd/server

FROM scratch AS server
COPY --from=build-server /bin/server /bin/

COPY --from=build-server /usr/local/go/lib/time/zoneinfo.zip /
ENV ZONEINFO=/zoneinfo.zip

EXPOSE 80
ENTRYPOINT [ "/bin/server" ]

