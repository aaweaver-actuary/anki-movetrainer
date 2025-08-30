/**
 * @module types
 */

/**
 * @typedef {string} MoveSAN
 * A move in Standard Algebraic Notation, e.g. "Nf3", "exd5", "O-O".
 * @see https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
 */
export type MoveSAN = string;

/**
 * @typedef {Object} InitOptions
 * @property {string} fen - The FEN string representing the initial position.
 * @property {MoveSAN[]} sanSeq - The sequence of moves in SAN.
 * @property {boolean} [autoAnswer=true] - Whether to automatically answer the question.
 * @property {string} [pieceTheme] - The theme for the chess pieces.
 */
export interface InitOptions {
  fen: string; // "start" or FEN
  sanSeq: MoveSAN[];
  autoAnswer?: boolean; // default true
  pieceTheme?: string; // '_chessboard-img/{piece}.png'
  speeds?: { move?: number; snapback?: number; trash?: number };
  delayMs?: number; // ms before auto opponent reply
  hooks?: {
    onWrong?(ctx: { expectedFrom?: string; expectedTo?: string }): void;
    onProgress?(step: number, total: number): void;
    onComplete?(): void;
  };
}

/**
 * @typedef {Object} Engine
 * @property {function} tryUserMove - Tries to make a user move.
 * @property {function} expectedMove - Gets the expected move.
 * @property {function} getFen - Gets the current FEN string.
 * @property {function} getStep - Gets the current step number.
 * @property {function} getTotal - Gets the total number of steps.
 * @property {function} getSeq - Gets the sequence of moves.
 */
export interface Engine {
  tryUserMove(_move: { from: string; to: string }): {
    correct: boolean;
    snapback: boolean;
    fen: string;
    expected?: { from?: string; to?: string };
  };
  expectedMove(): { from?: string; to?: string } | undefined;
  getFen(): string;
  getStep(): number;
  getTotal(): number;
  getSeq(): string[];
}

/**
 * @typedef {Object} Feedback
 * @property {function} flashWrong - Flashes the board to indicate a wrong move.
 * @property {function} progress - Updates the progress bar.
 * @property {function} listPlayed - Displays the list of played moves.
 * @property {function} clearAnno - Clears the annotations.
 */
export interface Feedback {
  flashWrong(from?: string, to?: string): void;
  progress(step: number, total: number): void;
  listPlayed(san: string[], step: number): void;
  clearAnno(): void;
}


/**
 * @typedef {Object} BoardHandle
 * @property {function} position - Sets the board position.
 */
export interface BoardHandle {
  position(fen: string): void;
}