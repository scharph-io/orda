GO_MAIN= ./cmd/server

BUILD_DATE := $(shell date -u '+%Y-%m-%d_%H:%M:%S')
LD_FLAGS := -X main.date=$(BUILD_DATE) -X main.version=$(BUILD)
BUILD_ARGS := -ldflags='$(LD_FLAGS)'

build-ui:
	npm version $(BUILD)
	npm run build

build:
	go build $(BUILD_ARGS) -o /bin/server $(GO_MAIN)
	
