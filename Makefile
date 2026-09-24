# Next.js 16 Boilerplate — common tasks
# Run `make` or `make help` for the list.

.DEFAULT_GOAL := help
SHELL := /bin/sh

.PHONY: help install dev build start lint type-check themes check db-migrate db-seed db-studio up down logs ps health clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	bun install

dev: ## Start the dev server
	bun run dev

build: ## Production build
	bun run build

start: ## Start the production server
	bun run start

lint: ## Run ESLint
	bun run lint

type-check: ## Type-check the project
	bun run type-check

themes: ## Regenerate theme presets from themes.css
	bun run themes:generate

check: ## Run all quality checks
	bun run themes:check && bun run lint && bun run type-check && bun run build

db-migrate: ## Run database migrations
	bun run db:migrate

db-seed: ## Seed the database
	bun run db:seed

db-studio: ## Open Prisma Studio
	bun run db:studio

up: ## Start the self-hosted stack
	bun run podman:up

down: ## Stop the self-hosted stack
	bun run podman:down

logs: ## Tail stack logs
	bun run podman:logs

ps: ## Show stack status
	bun run podman:ps

health: ## Check the running app's health endpoint
	bun -e "fetch('http://localhost:3000/api/health').then(r=>r.text()).then(console.log)"

clean: ## Remove build artifacts
	rm -rf .next
