import { GameStatus } from '../types/GameStatus';
/**
 * Helper functions for chess engine logic abstraction and testing.
 */

// Helper to extract Chess constructor from window.chess
export function getChessCtorFromWindow(win: any): any {
  if (win.chess) {
    return win.chess.Chess || win.chess;
  }
  return undefined;
}

// Resolves the Chess constructor from global context
export function resolveChessCtor(): any {
  const win = window as any;
  const ctor = win.Chess || getChessCtorFromWindow(win);
  if (!ctor)
    throw new Error(
      'chess.js global not found; need UMD build exposing window.Chess',
    );
  return ctor;
}

// Calculates the expected move for a given step
export function safeExpectedMove(
  ChessCtor: any,
  game: any,
  seq: string[],
  step: number,
) {
  try {
    const tmp = new ChessCtor(game.fen());
    const exp = tmp.move(seq[step], { sloppy: true });
    if (!exp) return undefined;
    return { from: exp.from as string, to: exp.to as string };
  } catch {
    return undefined;
  }
}

// Creates a dummy engine for invalid input
export function createDummyEngine() {
  return {
    tryUserMove() {
      return { correct: false, snapback: true, fen: 'start' };
    },
    expectedMove() {
      return undefined;
    },
    getFen() {
      return 'start';
    },
    getStep() {
      return 0;
    },
    getTotal() {
      return 0;
    },
    getSeq() {
      return [];
    },
    undo() {
      return false;
    },
    redo() {
      return false;
    },
    getHistory() {
      return [];
    },
    getStatus() {
      return GameStatus.Unknown;
    },
    reset() {
      /* no-op */
    },
  };
}
