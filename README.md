# Anki MoveTrainer

## Overview
Anki MoveTrainer is a robust, fully tested, and linted chess move training application for Anki flashcards. All modules are covered by tests, including error and fallback logic. The project uses TypeScript, Rollup, and Vitest for a modern, maintainable frontend stack.

## Features
- Interactive chessboard with visual piece assets
- Core chess engine for move validation and game state management
- User feedback and progress tracking
- Type-safe integration with chess libraries
- 100% unit and smoke test coverage for reliability
- Responsive design for various screen sizes
- Minimal build output for easy Anki integration

## Project Structure
- `src/` — Source code modules (all robust and covered by tests)
- `styles/` — CSS for board and UI styling
- `playground/` — HTML demos for manual testing
- `tests/` — Unit and smoke tests
- Configuration files: `tsconfig.json`, `eslint.config.mjs`, `rollup.config.mjs`, `Makefile`, `vitest.config.ts`

## Getting Started
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server or build:**
   ```sh
   npm run dev
   ```

## Next Steps
- Refactor complex logic into helper functions for maintainability and modularity (see `next-steps.md`).
- Continue documenting and refining any remaining edge cases.
