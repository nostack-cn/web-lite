APP_NAME    := web-lite
PORT        := 3003
VERSION     := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT      := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# ---------- 开发 ----------

.PHONY: install
install: ## 安装依赖
	npm install

.PHONY: dev
dev: ## 本地开发（热重载）
	npm run dev

.PHONY: lint
lint: ## ESLint 检查
	npm run lint

# ---------- 构建 ----------

.PHONY: build
build: ## 生产构建
	npm run build

.PHONY: start
start: ## 本地运行生产包
	npm run start

# ---------- Docker ----------

.PHONY: docker-build
docker-build: ## 构建 Docker 镜像
	docker build \
		--build-arg COMMIT=$(COMMIT) \
		-t $(APP_NAME):$(VERSION) \
		-t $(APP_NAME):latest \
		.

.PHONY: docker-run
docker-run: ## 运行 Docker 容器（需要 .env.local）
	docker run --rm \
		-p $(PORT):$(PORT) \
		--env-file .env.local \
		$(APP_NAME):latest

.PHONY: docker-stop
docker-stop: ## 停止容器
	docker stop $$(docker ps -q --filter ancestor=$(APP_NAME):latest) 2>/dev/null || true

# ---------- 清理 ----------

.PHONY: clean
clean: ## 清理构建产物
	rm -rf .next out

.PHONY: clean-all
clean-all: clean ## 清理构建产物及依赖
	rm -rf node_modules

# ---------- 帮助 ----------

.PHONY: help
help: ## 显示帮助信息
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
