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
import { GameStatus } from './types/GameStatus';
import { Chess as ChessESM } from 'chess.js';
import {
  resolveChessCtor,
  safeExpectedMove,
  createDummyEngine,
} from './helpers/engineHelpers';

export function assignChessGlobal() {
  if (typeof window !== 'undefined' && !('Chess' in window)) {
    (window as any).Chess = ChessESM;
  }
}

type MoveRecord = {
  from: string;
  to: string;
  fen: string;
};

// Call on module load for browser usage
assignChessGlobal();

export function createEngine(params: {
  fen: string;
  sanSeq: string[];
  ChessCtor?: any;
}): Engine {
  if (!params || typeof params !== 'object' || !params.fen || !params.sanSeq) {
    return createDummyEngine();
  }
  const ChessCtor = params?.ChessCtor || resolveChessCtor();
  const initialFen = params.fen;
  const seq = params.sanSeq || [];
  let step = 0;
  let fen = initialFen;
  let game = new ChessCtor(initialFen);
  let history: Array<{ from: string; to: string; fen: string }> = [];

  function updateHistory() {
    if (step > 0) {
      const lastMove = seq[step - 1];
      const tmp = new ChessCtor(initialFen);
      for (let i = 0; i < step; i++) {
        tmp.move(seq[i], { sloppy: true });
      }
      const moveObj = tmp.move(lastMove, { sloppy: true });
      if (moveObj) {
        const { from, to, fen } = createMoveRecord(moveObj, tmp);
        history[step - 1] = updateMoveRecord({
          from,
          to,
          fen,
        });
      }
    }
  }

  function createMoveRecord(
    moveObj: { from: string; to: string } | undefined,
    tmp: any,
  ): MoveRecord {
    if (!moveObj) {
      return { from: '', to: '', fen: tmp.fen() };
    }
    const { from, to } = moveObj;
    const fen = tmp.fen();
    return { from, to, fen };
  }

  function updateMoveRecord({ from, to, fen }: MoveRecord): MoveRecord {
    return {
      from,
      to,
      fen,
    };
  }

  function getStatus(): GameStatus {
    try {
      if ('in_checkmate' in game && typeof game.in_checkmate === 'function') {
        if (game.in_checkmate()) return GameStatus.Checkmate;
      }
      if ('in_stalemate' in game && typeof game.in_stalemate === 'function') {
        if (game.in_stalemate()) return GameStatus.Stalemate;
      }
      if ('in_draw' in game && typeof game.in_draw === 'function') {
        if (game.in_draw()) return GameStatus.Draw;
      }
      return GameStatus.Ongoing;
    } catch {
      return GameStatus.Unknown;
    }
  }

  return {
    tryUserMove(move: { from: string; to: string }) {
      if (!move || typeof move !== 'object' || !move.from || !move.to) {
        return { correct: false, snapback: true, fen, expected: undefined };
      }
      const expected = safeExpectedMove(ChessCtor, game, seq, step);
      if (!expected || move.from !== expected.from || move.to !== expected.to) {
        game.undo();
        fen = game.fen();
        return { correct: false, snapback: true, fen, expected };
      }
      game.move({ from: move.from, to: move.to });
      step += 1;
      fen = game.fen();
      updateHistory();
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
    undo() {
      if (step > 0) {
        game.undo();
        step -= 1;
        fen = game.fen();
        return true;
      }
      return false;
    },
    redo() {
      if (step < seq.length) {
        const move = seq[step];
        const result = game.move(move, { sloppy: true });
        if (result) {
          step += 1;
          fen = game.fen();
          updateHistory();
          return true;
        }
      }
      return false;
    },
    getHistory() {
      return history.slice(0, step);
    },
    getStatus,
    reset() {
      game = new ChessCtor(initialFen);
      step = 0;
      fen = initialFen;
      history = [];
    },
  };
}
