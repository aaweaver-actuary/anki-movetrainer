.PHONY: test lint typecheck coverage check build

tree:
	tree -I 'node_modules|coverage|.git' | pbcopy
	pbpaste

test:
	npm run test
	npx vitest run --coverage

lint:
	npm run lint

typecheck:
	npm run check


coverage:
	npx vitest run --coverage
	@echo "Open coverage/index.html for a detailed report."

coverage-html:
	npx vitest run --coverage
	@echo "HTML report generated at coverage/index.html. Open in your browser to review uncovered code."

check: lint typecheck coverage

build: check
	npm run build