# Project Checklist

This checklist is designed for planning and assigning development work for Anki MoveTrainer, with a focus on 100% unit test coverage, modularity, maintainability, and expressive naming of private functions. Each section below corresponds to a high-level project goal, with detailed step-by-step tasks.

---

## 1. Achieve 100% Unit Test Coverage

### Atomic Tasks
- [ ] For each module (`engine.ts`, `feedback.ts`, `pieces.ts`, `scheduler.ts`, `ui.ts`):
  - [ ] List all exported and private functions in the module.
  - [ ] For each function, write a unit test covering:
    - [ ] Valid input scenarios
    - [ ] Invalid input scenarios
    - [ ] Edge cases
    - [ ] Error handling and exceptions
  - [ ] For each function, verify test coverage using `npx vitest run --coverage`.
  - [ ] Refactor code to expose private helpers for testing if needed.
  - [ ] Mark function as "fully covered" when all branches and lines are tested.
  - [ ] Document uncovered lines and create follow-up tasks for coverage gaps.
  - [ ] Ensure coverage report is 100% before marking module complete.

## 2. Ensure Modularity and Maintainability

### Atomic Tasks
- [ ] For each module:
  - [ ] Identify exported/public functions with complex logic.
  - [ ] Refactor each exported function to delegate logic to private helpers.
  - [ ] Break down large functions into smaller, single-responsibility helpers.
  - [ ] Move reusable helpers to shared utility modules if appropriate.
  - [ ] Document module boundaries and responsibilities in code comments and README.
  - [ ] Review for code duplication and refactor to eliminate redundancy.

## 3. Use Expressive Naming for Private Functions/Methods

### Atomic Tasks
- [ ] For each module:
  - [ ] List all private functions and methods.
  - [ ] For each, review name for clarity and expressiveness.
  - [ ] Rename any function whose name does not fully describe its purpose and behavior.
  - [ ] Remove code comments that duplicate what the function name conveys.
  - [ ] Update contribution guidelines to include naming conventions for private helpers.
  - [ ] Review all new code for adherence to naming standards before merging.

## 4. Maintain Minimal and Clean Build Output for Anki Integration

### Atomic Tasks
- [ ] Audit `dist/` directory contents after build.
- [ ] List all files and assets in `dist/`.
- [ ] Remove any file or asset not required for Anki flashcard use.
- [ ] Document required build output in README.
- [ ] Add automated tests or checks to verify build output remains minimal after changes.

## 5. Responsive Design and UI/UX Improvements

### Atomic Tasks
- [ ] Test UI on desktop and mobile devices for layout correctness.
- [ ] Refactor CSS for multi-column (desktop) and single-column (mobile) layouts.
- [ ] Add unit tests for UI rendering logic.
- [ ] Add integration tests for event handling and user interactions.
- [ ] Document responsive design requirements and test cases in README.

## 6. Scheduler and Feedback Logic Improvements

### Atomic Tasks
- [ ] List all functions in `scheduler.ts` and `feedback.ts`.
- [ ] For each, review for modularity and single-responsibility.
- [ ] Refactor complex logic into smaller helpers.
- [ ] Write unit tests for all feedback visuals and scheduling actions.
- [ ] Rename private helpers for clarity and expressiveness.

## 7. Type Safety and Integration

### Atomic Tasks
- [ ] List all type definitions and ambient declarations.
- [ ] For each, review for completeness and accuracy.
- [ ] Refactor code to use strong types in all modules.
- [ ] Add unit tests for type-related edge cases and integration points.
- [ ] Document type safety requirements in contribution guidelines.

## 8. Build, Lint, and Typecheck Automation

### Atomic Tasks
- [ ] Run all Makefile targets and verify output:
  - [ ] `make test`
  - [ ] `make lint`
  - [ ] `make typecheck`
  - [ ] `make coverage`
  - [ ] `make check`
  - [ ] `make build`
- [ ] Integrate these checks into CI/CD pipeline.
- [ ] Document required checks for all pull requests and merges in contribution guidelines.

## 9. Documentation and Contribution Guidelines

### Atomic Tasks
- [ ] Update README to reflect latest architecture, goals, and standards.
- [ ] Update `current-state.md` with current project state and roadmap.
- [ ] Add detailed contribution guidelines for modularity, naming, and testing.
- [ ] Document setup, build, and testing instructions for new developers.

---

This checklist should be reviewed and updated regularly as the project evolves. Assign tasks from each section to individual developers and track progress centrally.
