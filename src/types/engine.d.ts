import { GameStatus } from './GameStatus';
export enum GameStatus {
  Checkmate = 'checkmate',
  Stalemate = 'stalemate',
  Draw = 'draw',
  Ongoing = 'ongoing',
  Unknown = 'unknown',
}
// Engine type definitions

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
  undo(): boolean;
  redo(): boolean;
  getHistory(): Array<{ from: string; to: string; fen: string }>;
  getStatus(): GameStatus;
  reset(): void;
}
