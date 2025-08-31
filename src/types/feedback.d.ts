// Feedback type definitions

export interface Feedback {
  flashWrong(from?: string, to?: string): void;
  progress(step: number, total: number): void;
  listPlayed(san: string[], step: number): void;
  clearAnno(): void;
}
