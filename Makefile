PROJECT=orda
IMAGE=orda-server:latest

BINARY_NAME=$(PROJECT)

MAIN= cmd/server/main.go

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


PACKAGE_JSON=web/client/package.json

.PHONY: build-local

help: ## This help dialog.
	@grep -F -h "##" $(MAKEFILE_LIST) | grep -F -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

run-ui: ## Run the app locally
	npm --prefix web/client run start

run: ## Run the app locally
	go run cmd/server/main.go

pre-build-ui:
	cat $(PACKAGE_JSON) | jq --arg version "$(VERSION)" '.version |= $$version' | tee $(PACKAGE_JSON) > /dev/null

build-ui:
	npm --prefix web/client install && npm --prefix web/client run build

build-local: build-ui
	GOOS=linux 	GOARCH=amd64 	go build $(BUILD_ARGS) -o build/${BINARY_NAME} 			$(MAIN)
	chmod +x build/${BINARY_NAME}
	tar -czf build/${BINARY_NAME}_$(VERSION)_linux_amd64.tar.gz -C build ${BINARY_NAME}

	GOOS=linux 	GOARCH=arm64 	go build $(BUILD_ARGS) -o build/${BINARY_NAME}_arm64 	$(MAIN)
	chmod +x build/${BINARY_NAME}_arm64
	tar -czf build/${BINARY_NAME}_$(VERSION)_linux_arm64.tar.gz -C build ${BINARY_NAME}_arm64

	# GOOS=linux 	GOARCH=arm 		go build $(BUILD_ARGS) -o build/${BINARY_NAME}_arm 		$(MAIN)
	# chmod +x build/${BINARY_NAME}_arm
	# tar -czf build/${BINARY_NAME}_$(VERSION)_linux_arm.tar.gz -C build ${BINARY_NAME}_arm

	GOOS=darwin GOARCH=amd64 	go build $(BUILD_ARGS) -o build/$(BINARY_NAME)_darwin 	$(MAIN)
	chmod +x build/$(BINARY_NAME)_darwin
	tar -czf build/$(BINARY_NAME)_$(VERSION)_darwin_amd64.tar.gz -C build ${BINARY_NAME}_darwin

	GOOS=darwin GOARCH=arm64 	go build $(BUILD_ARGS) -o build/$(BINARY_NAME)_darwin_arm 	$(MAIN)
	chmod +x build/$(BINARY_NAME)_darwin_arm
	tar -czf build/$(BINARY_NAME)_$(VERSION)_darwin_arm64.tar.gz -C build ${BINARY_NAME}_darwin_arm
	
ci-build: pre-build-ui build-ui build-local 

run-web: ## Run the app locally
	npm run start --prefix web/app

requirements: ## Generate go.mod & go.sum files
	go mod tidy

clean-packages: ## Clean packages
	go clean -modcache

up: ## Run the project in a local container
	make up-silent
	make shell

build: ## Generate docker image
	docker build -t $(image_name) .

build-no-cache: ## Generate docker image with no cache
	docker build --no-cache -t $(image_name) .

up-silent: ## Run local container in background
	make delete-container-if-exist
	docker run -d -p 3000:3000 --name $(project_name) $(image_name) ./app

up-silent-prefork: ## Run local container in background with prefork
	make delete-container-if-exist
	docker run -d -p 3000:3000 --name $(project_name) $(image_name) ./app -prod

delete-container-if-exist: ## Delete container if it exists
	docker stop $(project_name) || true && docker rm $(project_name) || true

shell: ## Run interactive shell in the container
	docker exec -it $(project_name) /bin/sh

stop: ## Stop the container
	docker stop $(project_name)

start: ## Start the container
	docker start $(project_name)