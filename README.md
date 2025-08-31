# Anki MoveTrainer

## Overview
Anki MoveTrainer is a chess move training application designed to help users learn, practice, and memorize chess moves and positions. The project leverages TypeScript, Rollup, and Vitest for a modern, maintainable frontend stack. It features interactive chessboard rendering, feedback mechanisms, and scheduling logic to optimize user learning and retention.

This project is intended to be built and used as the template for Anki flashcards based on studying chess openings, tactics, and strategies, so the `dist/` directory will be kept as simple as possible to facilitate easy integration with Anki.

## Features
- Interactive chessboard with visual piece assets
- Core chess engine for move validation and game state management
- User feedback and progress tracking
- Type-safe integration with chess libraries
- Unit and smoke tests for reliability
- Responsive design for various screen sizes:
    - For a laptop/desktop: multi-column layout with a large board on the left and a move list on the right
    - For mobile devices: single-column layout with the board on top and the move list below

## Project Structure
- `src/` — Source code modules:
  - `engine.ts` — Core chess logic
  - `pieces.ts` — Chess piece management
  - `feedback.ts` — User feedback logic
  - `scheduler.ts` — Training scheduling
  - `ui.ts` — User interface rendering
  - `types/` — Type definitions
  - `assets/` — Chess piece images
  - `vendor/` — Ambient type declarations
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
   # or
   npm run build
   ```
3. **Run tests:**
   ```sh
   npm test
   ```
4. **Open playground:**
   Open `playground/index.html` or `playground/debug.html` in your browser for manual testing.

## Testing
- Unit tests are located in `tests/engine.spec.ts` and other files in the `tests/` directory.
- Unit tests are still being developed and refined.
- Vitest is used for running and managing tests.
- Smoke tests ensure basic app functionality.

## Development Checklist
- Define and document project goals and requirements
- Audit and refine core chess logic
- Enhance UI and user feedback
- Expand scheduling and progress tracking
- Strengthen type safety and integration
- Increase test coverage
- Optimize build and deployment
- Document codebase and usage
- Assign tasks and track progress

## Contributing
Contributions are welcome! Please submit issues or pull requests for improvements, bug fixes, or new features. See the checklist above for areas needing attention.

## License
Specify your license here (e.g., MIT, GPL, etc.)

---

For more details, see `current-state.md` for a full project review and roadmap.
