/**
 * @module engine
 * Game-state wrapper around chess.js for chess study apps.
 * Robustness goals:
 * - Always update FEN after every move, including edge cases.
 * - Use guard clauses for all public API methods to handle null/undefined/malformed input.
 * - Never throw on invalid input; always return a safe result.
 * - Document expected behavior for invalid input.
 * - Restore FEN after incorrect move.
 * - Support promotion, castling, and other chess-specific scenarios.
 */

import { Engine } from './types/engine';
import { Chess as ChessESM } from 'chess.js';

export function assignChessGlobal() {
  if (typeof window !== 'undefined' && !('Chess' in window)) {
    (window as any).Chess = ChessESM;
  }
}

// Call on module load for browser usage
assignChessGlobal();

function resolveChessCtor(): any {
  const ctor =
    window.Chess ||
    (window.chess && (window.chess.Chess || (window.chess as any)));
  if (!ctor)
    throw new Error(
      'chess.js global not found; need UMD build exposing window.Chess',
    );
  return ctor;
}

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

export function createEngine(params: {
  // Defensive: always validate input
  fen: string;
  sanSeq: string[];
  ChessCtor?: any;
}): Engine {
  if (!params || typeof params !== 'object' || !params.fen || !params.sanSeq) {
    // Return a dummy engine that never updates state
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
    };
  }
  const ChessCtor = params?.ChessCtor || resolveChessCtor();
  const game = new ChessCtor(params.fen);
  const seq = params.sanSeq || [];
  let step = 0;
  let fen = params.fen;
  return {
    /**
     * Tries to make a user move. Returns safe result for invalid input.
     * @param move { from: string; to: string }
     * @returns { correct, snapback, fen, expected }
     */
    tryUserMove(move: { from: string; to: string }) {
      // Defensive: handle null/undefined/malformed input
      if (!move || typeof move !== 'object' || !move.from || !move.to) {
        return { correct: false, snapback: true, fen, expected: undefined };
      }
      const expected = safeExpectedMove(ChessCtor, game, seq, step);
      if (!expected || move.from !== expected.from || move.to !== expected.to) {
        game.undo();
        fen = game.fen();
        return { correct: false, snapback: true, fen, expected };
      }
      // Accept move, advance step, update FEN
      game.move({ from: move.from, to: move.to });
      step += 1;
      fen = game.fen();
      return { correct: true, snapback: false, fen, expected };
    },
    expectedMove() {
      return safeExpectedMove(ChessCtor, game, seq, step);
    },
    getFen() {
      return fen;
    },
    getStep() {
      return step;
    },
    getTotal() {
      return seq.length;
    },
    getSeq() {
      return seq;
    },
  };
}
