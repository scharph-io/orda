PROJECT=orda
IMAGE=scharphio/orda


TAG_COMMIT := $(shell git rev-list --abbrev-commit --tags --max-count=1)
TAG := $(shell git describe --abbrev=0 --tags ${TAG_COMMIT} 2>/dev/null || true)
COMMIT := $(shell git rev-parse --short HEAD)
DATE := $(shell git log -1 --format=%cd --date=format:"%Y%m%d")
VERSION := $(TAG:v%=%)
ifneq ($(COMMIT), $(TAG_COMMIT))
	VERSION := $(VERSION)-next-$(COMMIT)-$(DATE)
endif
ifeq ($(VERSION),)
	VERSION := $(COMMIT)-$(DATA)
endif
ifneq ($(shell git status --porcelain),)
	VERSION := $(VERSION)-dirty
endif

BUILD_DATE := $(shell date -u '+%Y-%m-%d_%H:%M:%S')
LD_FLAGS := -X main.date=$(BUILD_DATE) -X main.version=$(VERSION)
BUILD_ARGS := -ldflags='$(LD_FLAGS)'

BINARY_NAME=$(PROJECT)
GO_MAIN=cmd/server/main.go

CLIENT_PROJECT=web/client
PACKAGE_JSON=$(CLIENT_PROJECT)/package.json

.PHONY: build-local

help: ## This help dialog.
	@grep -F -h "##" $(MAKEFILE_LIST) | grep -F -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

run-ui: ## Run the app locally
	npm --prefix $(CLIENT_PROJECT) run start

install-ui:
	npm --prefix $(CLIENT_PROJECT) install

update-ui:
	npm --prefix $(CLIENT_PROJECT) run ng update @angular/cli @angular/core

run: ## Run the app locally
	go run $(GO_MAIN)

pre-build-ui:
	cat $(PACKAGE_JSON) | jq --arg version "$(VERSION)" '.version |= $$version' | tee $(PACKAGE_JSON) > /dev/null

build-ui:
	npm --prefix $(CLIENT_PROJECT) install && npm --prefix $(CLIENT_PROJECT) run build

build-local: build-ui
	GOOS=linux GOARCH=amd64 go build $(BUILD_ARGS) -o build/${BINARY_NAME} $(GO_MAIN)
	chmod +x build/${BINARY_NAME}
	tar -czf build/${BINARY_NAME}_$(VERSION)_linux_amd64.tar.gz -C build ${BINARY_NAME}

ci-build: pre-build-ui build-ui build-local

requirements: ## Generate go.mod & go.sum files
	go mod tidy

clean-packages: ## Clean packages
	go clean -modcache

dev-up: ## Start containers defined in docker-compose.yaml
	docker compose -f docker-compose.yaml up -d

dev-down: ## Stop and remove containers, networks, volumes, and images created by up
	docker compose -f docker-compose.yaml down -v

dev-logs: ## View logs for running containers
	docker compose -f docker-compose.yaml logs -f

run-playground: ## Run the app locally
	go run cmd/repo_test/main.go
