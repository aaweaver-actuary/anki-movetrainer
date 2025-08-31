// InitOptions type definitions

export type MoveSAN = string;

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
