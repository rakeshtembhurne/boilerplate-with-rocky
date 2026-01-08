# Makefile for AI Starter with Rocky
# =================================================================
# This Makefile simplifies development and deployment operations
#
# Usage:
#   make build           # Build the container image
#   make up              # Start all services (requires build first)
#   make dev             # Start development server locally (no containers)
#   make down            # Stop all services
#   make logs            # View logs
#   make shell           # Get shell in app container
#   make reset           # Reset and recreate everything
# =================================================================

.PHONY: help build up down restart logs shell reset clean prune monitor status ps dev dev-turbo local db-up db-down

# Configuration - these will be read from environment files
IMAGE_NAME := ai-starter
IMAGE_TAG := latest
CONTAINER_NAME := ai-starter-app
COMPOSE_FILE := podman/podman-compose.yml
DEV_COMPOSE_FILE := podman/podman-compose.yml

# Color codes
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Read environment variables from files if they exist
ifneq (,$(wildcard .env.podman.local))
    $(info Reading environment from .env.podman.local)
    include .env.podman.local
else ifneq (,$(wildcard .env.podman))
    $(info Reading environment from .env.podman)
    include .env.podman
else ifneq (,$(wildcard .env.local))
    $(info Reading environment from .env.local)
    include .env.local
else
    $(info Using default environment variables)
endif

# Use environment variables with defaults
NEXT_PUBLIC_APP_URL ?= http://localhost:3000
DATABASE_URL ?= postgresql://postgres:postgres@db:5432/ai_starter_db
BETTER_AUTH_SECRET ?= $(shell openssl rand -base64 32)
BETTER_AUTH_URL ?= http://localhost:3000
GOOGLE_CLIENT_ID ?=
GOOGLE_CLIENT_SECRET ?=
RESEND_API_KEY ?= dummy

# Export variables to subprocesses
export NEXT_PUBLIC_APP_URL
export DATABASE_URL
export BETTER_AUTH_SECRET
export BETTER_AUTH_URL
export GOOGLE_CLIENT_ID
export GOOGLE_CLIENT_SECRET
export RESEND_API_KEY

# Help target
help: ## Show this help message
	@echo "$(GREEN)AI Starter with Rocky - Development & Deployment$(NC)"
	@echo ""
	@echo "$(YELLOW)Development (Local - Uses Podman DB):$(NC)"
	@echo "  $(GREEN)make dev$(NC)         # Start development server locally"
	@echo "  $(GREEN)make dev-turbo$(NC)   # Start development server with Turbo (faster)"
	@echo "  $(GREEN)make local$(NC)        # Alias for dev (starts local server)"
	@echo ""
	@echo "$(YELLOW)Database (Podman - Local Development):$(NC)"
	@echo "  $(GREEN)make db-up$(NC)         # Start database service only"
	@echo "  $(GREEN)make db-down$(NC)       # Stop database service only"
	@echo ""
	@echo "$(YELLOW)Development (With Podman Containers):$(NC)"
	@echo "  $(GREEN)make build$(NC)       # Build container image"
	@echo "  $(GREEN)make up$(NC)          # Start all services (requires build)"
	@echo "  $(GREEN)make down$(NC)        # Stop all services"
	@echo "  $(GREEN)make restart$(NC)     # Restart all services"
	@echo "  $(GREEN)make logs$(NC)        # View logs"
	@echo "  $(GREEN)make shell$(NC)       # Get shell in app container"
	@echo ""
	@echo "$(YELLOW)Database Operations (Podman):$(NC)"
	@echo "  $(GREEN)make db-migrate$(NC)   # Run database migrations"
	@echo "  $(GREEN)make db-studio$(NC)    # Open Prisma Studio"
	@echo "  $(GREEN)make db-seed$(NC)      # Seed database"
	@echo "  $(GREEN)make db-reset$(NC)    # Reset database"
	@echo ""
	@echo "$(YELLOW)Production Deployment (Podman):$(NC)"
	@echo "  $(GREEN)make build-arg$(NC)    # Build with custom arguments"
	@echo "  $(GREEN)make up-prod$(NC)      # Start production services"
	@echo "  $(GREEN)make down-prod$(NC)    # Stop production services"
	@echo "  $(GREEN)make logs-prod$(NC)    # View production logs"
	@echo ""
	@echo "$(YELLOW)Utility Commands:$(NC)"
	@echo "  $(GREEN)make status$(NC)      # Show status of all services"
	@echo "  $(GREEN)make ps$(NC)          # Show running containers"
	@echo "  $(GREEN)make clean$(NC)       # Remove all containers and volumes"
	@echo "  $(GREEN)make init$(NC)        # Initialize development environment"
	@echo ""
	@echo "$(YELLOW)Environment Setup:$(NC)"
	@echo "  1. Copy .env.example to .env.local for local development"
	@echo "  2. Copy .env.podman to .env.podman.local for container development"
	@echo "  3. Edit .env.podman.local with your actual credentials"
	@echo ""
	@echo "$(YELLOW)Important:$(NC)"
	@echo "  - Local development (make dev) runs directly on your machine"
	@echo "  - Container development (make up) uses Podman containers"
	@echo "  - Always run make build before make up when using containers"

# Build targets
build: ## Build the container image with current environment
	@echo "$(GREEN)Building container image $(IMAGE_NAME):$(IMAGE_TAG)$(NC)"
	@echo "$(YELLOW)Environment:$(NC)"
	@echo "  NEXT_PUBLIC_APP_URL: $(NEXT_PUBLIC_APP_URL)"
	@echo "  BETTER_AUTH_URL: $(BETTER_AUTH_URL)"
	@echo "  DATABASE_URL: $(DATABASE_URL)"
	@echo "  GOOGLE_CLIENT_ID: $(if $(GOOGLE_CLIENT_ID),set,not set)"
	@echo "  RESEND_API_KEY: $(if $(RESEND_API_KEY),set,not set)"
	podman build \
		--build-arg NEXT_PUBLIC_APP_URL=$(NEXT_PUBLIC_APP_URL) \
		--build-arg DATABASE_URL=$(DATABASE_URL) \
		--build-arg BETTER_AUTH_SECRET=$(BETTER_AUTH_SECRET) \
		--build-arg BETTER_AUTH_URL=$(BETTER_AUTH_URL) \
		--build-arg GOOGLE_CLIENT_ID=$(GOOGLE_CLIENT_ID) \
		--build-arg GOOGLE_CLIENT_SECRET=$(GOOGLE_CLIENT_SECRET) \
		--build-arg RESEND_API_KEY=$(RESEND_API_KEY) \
		-f podman/Containerfile \
		-t $(IMAGE_NAME):$(IMAGE_TAG) .
	@echo "$(GREEN)Build completed successfully$(NC)"

build-arg: ## Build with custom arguments (without environment file)
	@echo "$(GREEN)Building container with custom arguments$(NC)"
	podman build \
		-f podman/Containerfile \
		-t $(IMAGE_NAME):$(IMAGE_TAG) .

build-multi: ## Build for multiple architectures
	@echo "$(GREEN)Building for multiple architectures$(NC)"
	podman build \
		--platform linux/amd64,linux/arm64 \
		-f podman/Containerfile \
		-t $(IMAGE_NAME):$(IMAGE_TAG) .

# Development targets (no containers)
dev: ## Start development server locally (requires Podman database)
	@echo "$(GREEN)Starting development server locally$(NC)"
	@echo "$(YELLOW)Note: Requires Podman database to be running (make db-up)$(NC)"
	@if ! podman ps --format "{{.Names}}" | grep -q "podman_db_1"; then \
		echo "$(YELLOW)Database not running. Starting it first...$(NC)"; \
		make db-up; \
	fi
	bun run dev

dev-turbo: ## Start development server with Turbo (faster)
	@echo "$(GREEN)Starting development server with Turbo$(NC)"
	@echo "$(YELLOW)Note: Requires Podman database to be running (make db-up)$(NC)"
	@if ! podman ps --format "{{.Names}}" | grep -q "podman_db_1"; then \
		echo "$(YELLOW)Database not running. Starting it first...$(NC)"; \
		make db-up; \
	fi
	bun run turbo

local: ## Start development server locally (alias for dev)
	@echo "$(GREEN)Starting development server locally$(NC)"
	@echo "$(YELLOW)Note: Requires Podman database to be running (make db-up)$(NC)"
	@if ! podman ps --format "{{.Names}}" | grep -q "podman_db_1"; then \
		echo "$(YELLOW)Database not running. Starting it first...$(NC)"; \
		make db-up; \
	fi
	bun run dev

# Container lifecycle targets
up: ## Start all services (requires build first)
	@echo "$(GREEN)Starting all services$(NC)"
	@if ! podman image exists $(IMAGE_NAME):$(IMAGE_TAG); then \
		echo "$(RED)Image $(IMAGE_NAME):$(IMAGE_TAG) not found. Running 'make build' first...$(NC)"; \
		make build; \
	fi
	podman-compose -f $(DEV_COMPOSE_FILE) up -d
	@echo "$(GREEN)Services started successfully$(NC)"
	@echo "$(YELLOW)Application is available at: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Database is available at: localhost:5432$(NC)"
	@echo "$(YELLOW)Check logs: make logs$(NC)"

down: ## Stop all services
	@echo "$(RED)Stopping all services$(NC)"
	podman-compose -f $(DEV_COMPOSE_FILE) down
	@echo "$(GREEN)All services stopped$(NC)"

restart: ## Restart all services
	@echo "$(YELLOW)Restarting all services$(NC)"
	podman-compose -f $(DEV_COMPOSE_FILE) restart
	@echo "$(GREEN)Services restarted$(NC)"

logs: ## View logs (follow mode)
	@echo "$(YELLOW)Viewing container logs (Ctrl+C to exit)$(NC)"
	podman-compose -f $(DEV_COMPOSE_FILE) logs -f

logs-app: ## View app service logs
	@echo "$(YELLOW)Viewing app service logs$(NC)"
	podman logs -f ai-starter-app-1

logs-db: ## View database logs
	@echo "$(YELLOW)Viewing database logs$(NC)"
	podman logs -f ai-starter-db-1

shell: ## Get shell in app container
	@echo "$(GREEN)Opening shell in app container$(NC)"
	podman exec -it ai-starter-app-1 /bin/sh

shell-db: ## Get shell in database container
	@echo "$(GREEN)Opening shell in database container$(NC)"
	podman exec -it ai-starter-db-1 /bin/bash

# Database-only targets
db-up: ## Start database service only
	@echo "$(GREEN)Starting database service only$(NC)"
	@podman ps --format "{{.Names}}" | grep -q "podman_db_1" && \
		echo "$(YELLOW)Database is already running$(NC)" || \
		podman-compose -f $(DEV_COMPOSE_FILE) up -d db
	@echo "$(GREEN)Database is running at localhost:5432$(NC)"
	@echo "$(YELLOW)Make sure to run 'make db-migrate' if needed$(NC)"

db-down: ## Stop database service only
	@echo "$(RED)Stopping database service$(NC)"
	@podman ps --format "{{.Names}}" | grep -q "podman_db_1" && \
		podman-compose -f $(DEV_COMPOSE_FILE) down db || \
		echo "$(YELLOW)Database is not running$(NC)"

# Database targets
db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations$(NC)"
	podman exec -it ai-starter-db-1 bun prisma migrate deploy

db-studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio$(NC)"
	podman exec -it ai-starter-db-1 bun prisma studio

db-seed: ## Seed database
	@echo "$(GREEN)Seeding database$(NC)"
	podman exec -it ai-starter-db-1 bun prisma db seed

db-reset: ## Reset database
	@echo "$(RED)Resetting database (WARNING: This will delete all data!)$(NC)"
	@read -p "Are you sure? (y/N): " confirm && \
		[ "$$confirm" = "y" ] && \
		podman exec -it ai-starter-db-1 bun prisma migrate reset --force

# Production targets
up-prod: ## Start production services
	@echo "$(GREEN)Starting production services$(NC)"
	podman-compose -f podman/podman-compose.production.yml up -d
	@echo "$(GREEN)Production services started$(NC)"
	@echo "$(YELLOW)Application is available at: http://localhost:3000$(NC)"

down-prod: ## Stop production services
	@echo "$(RED)Stopping production services$(NC)"
	podman-compose -f podman/podman-compose.production.yml down

logs-prod: ## View production logs
	@echo "$(YELLOW)Viewing production logs$(NC)"
	podman-compose -f podman/podman-compose.production.yml logs -f

# Maintenance targets
reset: ## Reset and recreate all services
	@echo "$(RED)Resetting all services (WARNING: This will delete all data!)$(NC)"
	@read -p "Are you sure? (y/N): " confirm && \
		[ "$$confirm" = "y" ] && \
		make down && \
		podman volume rm -f ai-starter-postgres-data || true && \
		make build && \
		make up

clean: ## Remove all containers and volumes
	@echo "$(RED)Cleaning up all containers and volumes$(NC)"
	podman-compose -f $(DEV_COMPOSE_FILE) down -v
	podman system prune -f

prune: ## Remove all unused containers, images, and volumes
	@echo "$(RED)Pruning unused containers, images, and volumes$(NC)"
	podman system prune -af

# Health check
health: ## Check service health
	@echo "$(GREEN)Checking service health$(NC)"
	@curl -f http://localhost:3000/api/health && echo "$(GREEN)✓ App is healthy$(NC)" || echo "$(RED)✗ App is unhealthy$(NC)"
	@curl -f http://localhost:5432/ && echo "$(GREEN)✓ Database is healthy$(NC)" || echo "$(RED)✗ Database is unhealthy$(NC)"

status: ## Show status of all services
	@echo "$(GREEN)Container Status$(NC)"
	podman-compose -f $(DEV_COMPOSE_FILE) ps

ps: ## Show running containers
	@echo "$(GREEN)Running containers$(NC)"
	podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

images: ## Show container images
	@echo "$(GREEN)Container images$(NC)"
	podman images | grep $(IMAGE_NAME)

env: ## Show environment variables
	@echo "$(GREEN)Environment variables$(NC)"
	@echo "NEXT_PUBLIC_APP_URL: $(NEXT_PUBLIC_APP_URL)"
	@echo "DATABASE_URL: $(DATABASE_URL)"
	@echo "BETTER_AUTH_URL: $(BETTER_AUTH_URL)"
	@echo "BETTER_AUTH_SECRET: $(BETTER_AUTH_SECRET)"
	@echo "GOOGLE_CLIENT_ID: $(GOOGLE_CLIENT_ID)"
	@echo "GOOGLE_CLIENT_SECRET: $(if $(GOOGLE_CLIENT_SECRET),set,not set)"
	@echo "RESEND_API_KEY: $(if $(RESEND_API_KEY),set,not set)"

# Initialize development environment
init: ## Initialize development environment
	@echo "$(GREEN)Initializing development environment$(NC)"
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	bun install
	@echo "$(YELLOW)Generating Prisma client...$(NC)"
	bun run postinstall
	@echo "$(YELLOW)Setup complete!$(NC)"
	@echo "$(YELLOW)For local development: make dev-turbo$(NC)"
	@echo "$(YELLOW)For container development: make build && make up$(NC)"

# Quick start
quickstart-local: init dev ## Quick start local (init + dev)
	@echo "$(GREEN)Local development ready!$(NC)"
	@echo "$(YELLOW)Application: http://localhost:3000$(NC)"

quickstart-container: init build up ## Quick start containers (init + build + up)
	@echo "$(GREEN)Container development ready!$(NC)"
	@echo "$(YELLOW)Application: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Database: localhost:5432$(NC)"
	@echo "$(YELLOW)Prisma Studio: make db-studio$(NC)"
