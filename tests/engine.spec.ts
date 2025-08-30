import { describe, it, expect } from 'vitest';
import { createEngine } from '../src/engine';

declare global {
  interface Window {
    Chess?: new (fen?: string) => any;
    chess?: { Chess?: new (fen?: string) => any };
  }
}

// lightweight stub for chess.js so tests run without the real lib
class FakeChess {
  fenStr: string;
  constructor(fen?: string) {
    this.fenStr = fen ?? 'start';
  }
  fen() {
    return this.fenStr;
  }
  move(_arg: any, _opts?: any) {
    // This is only a shape placeholder; in real tests, import chess.js
    // For unit-testing engine flow, ensure move objects have from/to
    if (typeof _arg === 'string') return { from: 'd2', to: 'd4' }; // expected SAN path
    if (_arg && _arg.from && _arg.to) return { from: _arg.from, to: _arg.to };
    return null;
  }
  undo() {
    /* noop */
  }
}
window.Chess = FakeChess as any;

describe('engine basics', () => {
  it('snapbacks on wrong move and restores FEN', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
    const before = eng.getFen();
    const res = eng.tryUserMove({ from: 'g1', to: 'f3' }); // wrong
    expect(res.correct).toBe(false);
    expect(res.snapback).toBe(true);
    expect(res.fen).toBe(before);
  });
});
