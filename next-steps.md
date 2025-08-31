# next-steps.md

## Refactoring Opportunities in src/

### engine.ts
- Extract board replay logic in `updateHistory` to a helper (e.g., `replayMoves`).
- Extract last move object retrieval to a helper (e.g., `getLastMoveObj`).
- Refactor status checks in `getStatus` to a generic helper (e.g., `safeGameStatusCheck`).
- Split move validation and snapback handling in `tryUserMove` into helpers.
- Extract history update logic after undo/redo to a helper.

### index.ts
- Extract incorrect/correct move handling in `handleMove` to helpers.
- Extract scheduling logic for next move to a helper.
- Extract FEN/SAN parsing in `init` to a helper.

### ui.ts
- Extract option validation in `mountBoard` to a helper.
- Extract FEN normalization to a helper.

### feedback.ts
- Extract SVG marker creation in `ensureAnnoDefs` to a helper.
- Extract child removal logic in `clearAnno` to a helper.
- Extract square rectangle calculation in `sqRect` to a utility.

### pieces.ts
- Consider a helper for piece theme resolution if logic expands.

### scheduler.ts
- Extract repeated auto-answer logic in `fail`/`pass` to a helper.

---

Most opportunities are in `engine.ts` and `index.ts`. Refactoring will improve readability, testability, and maintainability. Consider creating a `helpers/` directory for shared utilities.

Let me know if you want code samples for any specific refactor, or want to prioritize certain files/functions first!
