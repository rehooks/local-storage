.PHONY: build test

build:
	docker build -t localstorage:test --target test .

test:
	docker run --rm localstorage:test
