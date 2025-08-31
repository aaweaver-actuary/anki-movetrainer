# Linting Migration Guide for TypeScript Projects

This guide documents the recommended refactor and migration steps to enable clean linting in TypeScript projects, especially when using external APIs or ambient type declarations.

---

## Why Refactor?

TypeScript type/interface signatures often require unused parameters for API compatibility. ESLint cannot distinguish between required and truly unused parameters in type signatures, leading to false positives. The solution is to separate type definitions from implementation code.

---

## Migration Steps

### 1. Move Type/Interface Declarations to `.d.ts` Files
- Create a directory for ambient/type declarations, e.g. `src/types/` or `src/vendor/`.
- Move all pure type/interface definitions (API surfaces, external library types, etc.) from `.ts` files to `.d.ts` files.
  - Example: Move `Engine`, `Feedback`, `BoardHandle`, and related interfaces from `src/types.ts` to `src/types/engine.d.ts`, `src/types/feedback.d.ts`, etc.
  - Move any global interface augmentations (e.g. `declare global { ... }`) to `.d.ts` files.

### 2. Keep Implementation in `.ts`/`.tsx` Files
- Only keep actual logic, functions, and classes in `.ts`/`.tsx` files.
- Import types from your new `.d.ts` files as needed.

### 3. Update Imports
- Update all imports in your implementation files to reference the new `.d.ts` locations for types.

### 4. Configure ESLint
- In your ESLint config, ignore all `.d.ts` files:
  ```js
  {
    ignores: ['dist/**', 'lib/**', 'node_modules/**', '**/*.d.ts'],
  }
  ```
- This will prevent ESLint from reporting unused variable errors for type signatures.

### 5. Lint Implementation Files
- Run ESLint on your `.ts`/`.tsx` files. You should only see actionable lint errors related to code, not type/interface signatures.

### 6. Type Hygiene
- Use the TypeScript compiler (`tsc`) to check for type errors and unused exports/types.

### 7. (Optional) Document Your Approach
- Add a note in your README or CONTRIBUTING guide explaining why types are split and how linting is configured.

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

