# Linting Migration Guide for TypeScript Projects

## Current Status
- Migration to `.d.ts` files for type signatures is complete.
- ESLint is now clean except for intentional disables (e.g., enums).
- All implementation files are linted and type-safe.

## Next Steps
- Maintain type hygiene as new helpers are extracted (see `next-steps.md`).
- Update lint config if new patterns or helper modules are added.

## Migration Steps (Completed)
- All steps below have been completed:
  - Move type/interface declarations to `.d.ts` files
  - Keep implementation in `.ts`/`.tsx` files
  - Update imports
  - Configure ESLint to ignore `.d.ts` files
  - Lint implementation files
  - Maintain type hygiene

---

## Example Directory Structure

```
src/
  engine.ts
  feedback.ts
  ui.ts
  types/
    engine.d.ts
    feedback.d.ts
    boardhandle.d.ts
    ...
```

---

## Summary

This migration separates type definitions from implementation, allowing ESLint to focus on code and TypeScript to handle type hygiene. It’s the standard approach for robust TypeScript projects.

---

## References
- [TypeScript Handbook: Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html)
- [ESLint TypeScript Plugin](https://typescript-eslint.io/)
- [ts-unused-exports](https://github.com/pzavolinsky/ts-unused-exports)

---

## File-by-File Analysis

### src/engine.ts
- Contains implementation logic for chess engine and game state.
- Imports types from `./types`.
- **Action:** No changes needed; keep as implementation file. Ensure all type/interface imports reference `.d.ts` files after migration.

### src/feedback.ts
- Contains implementation logic for feedback and UI updates.
- Imports types from `./types`.
- **Action:** No changes needed; keep as implementation file. Ensure all type/interface imports reference `.d.ts` files after migration.

### src/index.ts
- Main entry point, orchestrates modules and UI.
- Imports types from `./types`.
- **Action:** No changes needed; keep as implementation file. Ensure all type/interface imports reference `.d.ts` files after migration.

### src/pieces.ts
- Contains implementation logic for piece asset mapping and theme function.
- **Action:** No changes needed; keep as implementation file.

### src/scheduler.ts
- Contains implementation logic for scheduling and Anki integration.
- **Action:** No changes needed; keep as implementation file.

### src/ui.ts
- Contains implementation logic for mounting chessboard.js and event binding.
- Type signatures for options (e.g. `pieceTheme`, `onDrop`) may trigger unused variable lint errors.
- **Action:** Move any pure type/interface definitions to `.d.ts` files. Keep only implementation logic here.

### src/types.ts
- Contains type/interface definitions for `Engine`, `Feedback`, `BoardHandle`, etc.
- **Action:** Move all type/interface definitions to separate `.d.ts` files (e.g. `engine.d.ts`, `feedback.d.ts`, `boardhandle.d.ts`). Delete or repurpose this file as an implementation file if needed.

### src/types/assets.d.ts
- Ambient module declarations for asset imports.
- **Action:** No changes needed; keep as `.d.ts` file and ignore in ESLint config.

### src/types/chessboardjs.d.ts
- Ambient module declaration for chessboard.js.
- **Action:** No changes needed; keep as `.d.ts` file and ignore in ESLint config.

### src/vendor/chess.ambient.d.ts
- Ambient type declarations for chess.js UMD global.
- **Action:** No changes needed; keep as `.d.ts` file and ignore in ESLint config.

### src/vendor/chessboard.ambient.d.ts
- Ambient type declarations for chessboard.js UMD global.
- **Action:** No changes needed; keep as `.d.ts` file and ignore in ESLint config.

---

