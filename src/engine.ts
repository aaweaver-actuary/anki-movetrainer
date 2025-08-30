/**
 * @module engine
 * Game-state wrapper around chess.js that:
 * - Tracks step in the SAN sequence
 * - Compares played vs expected using {from,to}
 * - Restores on incorrect move
 */

import { Engine } from './types';
import { Chess as ChessESM } from 'chess.js';

if (typeof window !== 'undefined' && !('Chess' in window)) {
  (window as any).Chess = ChessESM;
}
declare global {
  interface Window {
    Chess?: new (_fen?: string) => any;
    chess?: { Chess?: new (_fen?: string) => any };
  }
}

function resolveChessCtor(): new (fen?: string) => any {
  const ctor =
    window.Chess ||
    (window.chess && (window.chess.Chess || (window.chess as any)));
  if (!ctor)
    throw new Error(
      'chess.js global not found; need UMD build exposing window.Chess',
    );
  return ctor;
}

export function createEngine(params: {
  fen: string;
  sanSeq: string[];
}): Engine {
  const ChessCtor = resolveChessCtor();
  const startFen =
    params.fen && params.fen.trim() !== '' ? params.fen : 'start';
  const game = new ChessCtor(startFen === 'start' ? undefined : startFen);
  let step = 0;
  const seq = params.sanSeq.slice();

  function expectedMove() {
    try {
      const tmp = new ChessCtor(game.fen());
      const exp = tmp.move(seq[step], { sloppy: true });
      if (!exp) return undefined;
      return { from: exp.from as string, to: exp.to as string };
    } catch {
      return undefined;
    }
  }

  function tryUserMove(move: { from: string; to: string }) {
    const fenBefore = game.fen();
    const mv = game.move({ from: move.from, to: move.to, promotion: 'q' });
    if (!mv) {
      // illegal move in chess.js terms → snapback and restore
      return { correct: false, snapback: true, fen: fenBefore };
    }
    const exp = expectedMove();
    const correct = !!exp && mv.from === exp.from && mv.to === exp.to;
    if (!correct) {
      game.undo();
      return { correct: false, snapback: true, fen: fenBefore, expected: exp };
    }
    step += 1;
    return { correct: true, snapback: false, fen: game.fen() };
  }

  return {
    tryUserMove,
    expectedMove,
    getFen: () => game.fen(),
    getStep: () => step,
    getTotal: () => seq.length,
    getSeq: () => seq,
  };
}
