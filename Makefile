PROJECT=orda
IMAGE=orda-server:latest

BINARY_NAME=$(PROJECT)

MAIN= cmd/server/main.go

SHA := $(shell test -d .git && git rev-parse --short HEAD)
DIRTY := $(shell test -d .git && git diff --quiet || echo 'dirty')
BUILD_DATE := $(shell date -u '+%Y-%m-%d_%H:%M:%S')
LD_FLAGS := -X main.date=$(BUILD_DATE) -X main.git=$(SHA)-$(DIRTY)
BUILD_ARGS := -ldflags='$(LD_FLAGS)'

help: ## This help dialog.
	@grep -F -h "##" $(MAKEFILE_LIST) | grep -F -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

run-local: ## Run the app locally
	go run cmd/server/main.go

build-local:
	GOOS=linux 	GOARCH=amd64 	go build $(BUILD_ARGS) -o build/${BINARY_NAME} 			$(MAIN)
	GOOS=linux 	GOARCH=arm64 	go build $(BUILD_ARGS) -o build/${BINARY_NAME}_arm64 	$(MAIN)
	GOOS=linux 	GOARCH=arm 		go build $(BUILD_ARGS) -o build/${BINARY_NAME}_arm 		$(MAIN)
	GOOS=darwin GOARCH=amd64 	go build $(BUILD_ARGS) -o build/$(BINARY_NAME)_darwin 	$(MAIN)

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