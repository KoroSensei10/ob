alias d := dev
alias l := lint
alias f := fix

dev:
	bun dev

lint:
	bun lint

fix:
	bun lint --fix

build:
	bun run build

preview:
	bun run preview

previewBuild: build
	just preview