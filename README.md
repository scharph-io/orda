# Orda

## Setup

### Development

#### Backend

- install Go compiler https://go.dev/dl/
- ensure go is in PATH with `go version`
- start backend with `make run-local` or `go run cmd/server/main.go`

#### Frontend

- install NodeJS@20
- switch to `web/app/` and run npm install
- run `npm start`

### Use a release

- Download asset [Releases](https://github.com/scharph/orda/releases)
- ensure executable `chmod +x BINARY`
- run with `./BINARY`

## Docker

`docker login -u scharphio`
`docker build -t scharphio/orda:latest .`
`docker push scharphio/orda:latest`
