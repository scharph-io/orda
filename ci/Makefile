GO_MAIN= ./cmd/server

TAG_COMMIT := $(shell git rev-list --abbrev-commit --tags --max-count=1)
TAG := $(shell git describe --abbrev=0 --tags ${TAG_COMMIT} 2>/dev/null || true)
COMMIT := $(shell git rev-parse --short HEAD)
DATE := $(shell git log -1 --format=%cd --date=format:"%Y%m%d")
VERSION := $(TAG:v%=%)

LD_FLAGS := -X $(APP)/internal/build.time=$(DATE) -X $(APP)/internal/build.version=$(VERSION) -X $(APP)/internal/build.build=$(COMMIT)
BUILD_ARGS := -ldflags='$(LD_FLAGS)'

build-ui:
	npm version $(BUILD)
	npm run build

build:
	go build $(BUILD_ARGS) -o /bin/server $(GO_MAIN)
