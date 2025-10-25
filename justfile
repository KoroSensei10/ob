alias d := dev
alias l := lint
alias f := fix

pm := "pnpm"

dev:
	{{pm}} dev

lint:
	{{pm}} lint

fix:
	{{pm}} lint --fix

build:
	{{pm}} build

preview:
	{{pm}} preview

previewBuild: build
	just preview