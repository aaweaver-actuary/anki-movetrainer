# Unit Testing Guide for `/src` Modules

This document provides full instructions for achieving 100% unit test coverage for all modules in the `/src` directory of Anki MoveTrainer. Follow these steps to ensure every function, branch, and edge case is tested and verified.


## Modules to Cover




---

## engine.ts
**Purpose:** Game-state wrapper around chess.js. Tracks move sequence, validates user moves, and restores state on incorrect moves.

**Exported Functions:**
- `createEngine(params: { fen: string; sanSeq: string[] }): Engine`
  - Creates a chess engine instance with a starting FEN and a sequence of moves.
  - Returns an object with:
    - `tryUserMove(move: { from: string; to: string })`: Validates a user move, returns correctness and updated FEN.
    - `expectedMove()`: Returns the expected move at the current step.
    - `getFen()`: Gets current FEN.
    - `getStep()`: Gets current step in the move sequence.
    - `getTotal()`: Gets total number of moves in the sequence.
    - `getSeq()`: Gets the move sequence.

**Private Functions:**
- `resolveChessCtor()`: Resolves the chess.js constructor from global/window context.

---

## feedback.ts
**Purpose:** Manages visual feedback for user actions, including flashing board, drawing arrows, progress bar, and move list.

**Exported Functions:**
- `createFeedback(root: HTMLElement): Feedback`
  - Returns an object with:
    - `flashWrong(from?: string, to?: string)`: Flashes board and draws hint arrow for incorrect move.
    - `progress(step: number, total: number)`: Updates progress bar and text.
    - `listPlayed(san: string[], step: number)`: Updates move list display.
    - `clearAnno()`: Clears SVG annotations.

**Private Functions:**
- `ensureAnnoDefs()`: Ensures SVG marker definitions exist.
- `clearAnno()`: Clears SVG annotations except marker definitions.
- `sqRect(sq: string, size: number)`: Calculates square rectangle for SVG drawing.
- `drawHint(from?: string, to?: string)`: Draws hint arrow and highlights squares.

---

## pieces.ts
**Purpose:** Maps chess piece names to image assets for board rendering.

**Exported Functions/Constants:**
- `pieceMap: Record<string, string>`: Maps piece keys (e.g., 'wK', 'bQ') to image URLs.
- `bundledPieceTheme(name: string): string`: Returns image URL for a given piece name, used by chessboard.js.

---

## scheduler.ts
**Purpose:** Bridges auto-answer logic to Anki via pycmd, ensuring actions run only once per session.

**Exported Functions:**
- `createScheduler({ autoAnswer = true }: { autoAnswer?: boolean })`
  - Returns an object with:
    - `fail()`: Triggers Anki's fail action via pycmd.
    - `pass()`: Triggers Anki's pass action via pycmd.

**Private State:**
- `answered`: Tracks if an answer has already been sent to Anki.

---

## ui.ts
**Purpose:** Thin wrapper for mounting chessboard.js and binding events.

**Exported Functions:**
- `mountBoard(boardEl: HTMLElement, opts: { fen: string; pieceTheme?: string | ((name: string) => string); speeds?: { move?: number; snapback?: number; trash?: number }; onDrop: (source: string, target: string) => 'snapback' | void; }): BoardHandle`
  - Mounts a chessboard.js instance to a DOM element with options for FEN, piece theme, animation speeds, and drop event handler.
  - Returns an object with:
    - `position(fen: string)`: Updates board position to given FEN.

**Private Functions:**
- None (logic is contained in the exported function).

---

## How to Use This Documentation
- Use this as a reference for writing unit tests and understanding module responsibilities.
- For each function, ensure all behaviors and edge cases are covered in tests.
- Update this documentation as modules evolve.
## Step-by-Step Instructions
### 1. List All Functions
- For each module, list all exported (public) and private functions.
- Include function signatures and a brief description of their purpose.

### 2. Write Unit Tests for Each Function
- For every function, create unit tests that cover:
  - Valid input scenarios
  - Invalid input scenarios
  - Edge cases (e.g., empty arrays, null/undefined, boundary values)
  - Error handling and exceptions
- Use Vitest for all tests. Place test files in `/tests` and name them appropriately (e.g., `engine.spec.ts`).

### 3. Verify Coverage
- Run coverage checks using:
  ```sh
  npx vitest run --coverage
  ```
- Review the coverage report for each module and function.
- Mark functions as "fully covered" when all branches and lines are tested.

### 4. Refactor for Testability
- If private helpers are not directly testable, refactor code to expose them via named exports or test-only hooks.
- Ensure helpers are tested in isolation as well as through public orchestrators.

### 5. Document Uncovered Lines
- For any uncovered lines or branches, document the reason and create follow-up tasks to address gaps.
- Do not mark a module complete until coverage is 100%.

### 6. Maintain Test Quality
- Ensure tests are:
  - Isolated (do not depend on global state)
  - Deterministic (produce the same result every run)
  - Readable and maintainable
- Use expressive test names and structure.

### 7. Continuous Integration
- Integrate coverage checks into the CI/CD pipeline.
- Block merges if coverage drops below 100%.

---

## Example Checklist for Each Module
- [ ] List all functions (public and private)
- [ ] Write unit tests for each function
- [ ] Cover all input scenarios and edge cases
- [ ] Refactor code to expose helpers if needed
- [ ] Run coverage and verify 100%
- [ ] Document and address any gaps

---

## References
- [Vitest Documentation](https://vitest.dev/)
- [Project Checklist](../checklist.md)

For questions or help, contact the project maintainer or refer to the main project README.
