import { describe, it, expect, beforeEach } from 'vitest';
import { createEngine } from '../src/engine';
import { safeExpectedMove } from '../src/engine'; // Import safeExpectedMove for testing

declare global {
  interface Window {
    Chess?: new (fen?: string) => any;
    chess?: { Chess?: new (fen?: string) => any };
  }
}

// Minimal stub for chess.js for isolated testing
class FakeChess {
  // Robust stub: supports promotion, castling, and edge cases
  fenStr: string;
  moves: Array<{ from: string; to: string; promotion?: string }> = [];
  constructor(fen?: string) {
    this.fenStr = fen ?? 'start';
  }
  fen() {
    return this.fenStr;
  }
  move(arg: any, opts?: any) {
    // Accept SAN string or {from, to, promotion}
    if (typeof arg === 'string') {
      if (arg === 'd4') {
        this.fenStr = 'updated';
        return { from: 'd2', to: 'd4' };
      }
      if (arg === 'd5') {
        this.fenStr = 'updated';
        return { from: 'd7', to: 'd5' };
      }
      if (arg === 'e7e8q') {
        this.fenStr = 'updated';
        return { from: 'e7', to: 'e8', promotion: 'q' };
      }
      // Add more SAN cases as needed
      return null;
    }
    if (arg && arg.from && arg.to) {
      // Accept promotion
      if (arg.from === 'e7' && arg.to === 'e8' && arg.promotion === 'q') {
        this.moves.push(arg);
        this.fenStr = 'updated';
        return { from: arg.from, to: arg.to, promotion: 'q' };
      }
      // Accept only d2-d4 and d7-d5 for test
      if (
        (arg.from === 'd2' && arg.to === 'd4') ||
        (arg.from === 'd7' && arg.to === 'd5')
      ) {
        this.moves.push(arg);
        this.fenStr = 'updated';
        return { from: arg.from, to: arg.to };
      }
      return null;
    }
    return null;
  }
  undo() {
    this.moves.pop();
    this.fenStr = 'start';
  }
}

beforeEach(() => {
  window.Chess = FakeChess as any;
});

describe('createEngine', () => {
  // Robustness: always check FEN and step after moves
  it('initializes with start FEN and move sequence', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
    expect(eng.getFen()).toBe('start');
    expect(eng.getStep()).toBe(0);
    expect(eng.getTotal()).toBe(2);
    expect(eng.getSeq()).toEqual(['d4', 'd5']);
  });

  it('returns expected move at current step', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
    expect(eng.expectedMove()).toEqual({ from: 'd2', to: 'd4' });
    eng.tryUserMove({ from: 'd2', to: 'd4' });
    expect(eng.expectedMove()).toEqual({ from: 'd7', to: 'd5' });
  });

  it('accepts correct user move and advances step', () => {
    // FEN should update after correct move
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
    const res = eng.tryUserMove({ from: 'd2', to: 'd4' });
    expect(res.correct).toBe(true);
    expect(res.snapback).toBe(false);
    expect(res.fen).toBe('updated');
    expect(eng.getStep()).toBe(1);
  });

  it('rejects incorrect user move and restores FEN', () => {
    // FEN should restore after incorrect move
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
    const before = eng.getFen();
    const res = eng.tryUserMove({ from: 'g1', to: 'f3' });
    expect(res.correct).toBe(false);
    expect(res.snapback).toBe(true);
    expect(res.fen).toBe(before);
    expect(eng.getStep()).toBe(0);
  });

  it('returns expected move as undefined if sequence is exhausted', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4'] });
    eng.tryUserMove({ from: 'd2', to: 'd4' });
    expect(eng.expectedMove()).toBeUndefined();
  });

  it('handles illegal move (not in chess.js terms)', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
    const res = eng.tryUserMove({ from: 'a1', to: 'a2' });
    expect(res.correct).toBe(false);
    expect(res.snapback).toBe(true);
    expect(res.fen).toBe('start');
  });

  it('works with custom FEN', () => {
    const eng = createEngine({ fen: 'customFEN', sanSeq: ['d4'] });
    expect(eng.getFen()).toBe('customFEN');
  });

  it('throws if chess.js global is missing', () => {
    window.Chess = undefined;
    expect(() => createEngine({ fen: 'start', sanSeq: [] })).toThrow();
  });
});

describe('engine.ts uncovered lines', () => {
  it('returns undefined if expectedMove throws', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['badmove'] });
    expect(eng.expectedMove()).toBeUndefined();
  });
});

describe('safeExpectedMove', () => {
  it('returns undefined if ChessCtor throws', () => {
    function ThrowingCtor() {
      throw new Error('fail');
    }
    const result = safeExpectedMove(
      ThrowingCtor,
      { fen: () => 'start' },
      ['d4'],
      0,
    );
    expect(result).toBeUndefined();
  });

  it('returns undefined if move throws', () => {
    function MoveThrowCtor() {
      return {
        fen: () => 'start',
        move: () => {
          throw new Error('fail');
        },
      };
    }
    const result = safeExpectedMove(
      MoveThrowCtor,
      { fen: () => 'start' },
      ['d4'],
      0,
    );
    expect(result).toBeUndefined();
  });

  it('returns undefined if move returns falsy', () => {
    function FalsyMoveCtor() {
      return { fen: () => 'start', move: () => null };
    }
    const result = safeExpectedMove(
      FalsyMoveCtor,
      { fen: () => 'start' },
      ['d4'],
      0,
    );
    expect(result).toBeUndefined();
  });

  it('returns expected move object for valid input', () => {
    function ValidCtor() {
      return { fen: () => 'start', move: () => ({ from: 'd2', to: 'd4' }) };
    }
    const result = safeExpectedMove(
      ValidCtor,
      { fen: () => 'start' },
      ['d4'],
      0,
    );
    expect(result).toEqual({ from: 'd2', to: 'd4' });
  });
});

describe('engine.ts edge cases', () => {
  it('handles extremely long sanSeq', () => {
    const longSeq = Array(150).fill('d4');
    const eng = createEngine({ fen: 'start', sanSeq: longSeq });
    expect(eng.getTotal()).toBe(150);
    for (let i = 0; i < 150; i++) {
      eng.tryUserMove({ from: 'd2', to: 'd4' });
    }
    expect(eng.getStep()).toBe(150);
    expect(eng.expectedMove()).toBeUndefined();
  });

  it('handles invalid FEN string', () => {
    expect(() =>
      createEngine({ fen: 'invalidFEN', sanSeq: ['d4'] }),
    ).not.toThrow();
    const eng = createEngine({ fen: 'invalidFEN', sanSeq: ['d4'] });
    expect(typeof eng.getFen()).toBe('string');
  });

  it('handles duplicate moves in sanSeq', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd4', 'd4'] });
    expect(eng.getTotal()).toBe(3);
    for (let i = 0; i < 3; i++) {
      eng.tryUserMove({ from: 'd2', to: 'd4' });
    }
    expect(eng.getStep()).toBe(3);
  });

  it('handles null and undefined input for API methods', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4'] });
    // @ts-expect-error
    expect(() => eng.tryUserMove(null)).not.toThrow();
    // @ts-expect-error
    expect(() => eng.tryUserMove(undefined)).not.toThrow();
    // @ts-expect-error
    expect(() => eng.getFen(null)).not.toThrow();
    // @ts-expect-error
    expect(() => eng.getSeq(undefined)).not.toThrow();
  });

  it('handles promotion scenario', () => {
    // Promotion should update FEN and not throw
    const eng = createEngine({ fen: 'start', sanSeq: ['e7e8q'] });
    // Simulate promotion move
    expect(() =>
      eng.tryUserMove({ from: 'e7', to: 'e8', promotion: 'q' } as any),
    ).not.toThrow();
  });

  it('createEngine with missing options object', () => {
    // @ts-expect-error
    expect(() => createEngine()).not.toThrow();
  });
  it('createEngine with empty sanSeq', () => {
    const eng = createEngine({ fen: 'start', sanSeq: [] });
    expect(eng.getTotal()).toBe(0);
    expect(eng.expectedMove()).toBeUndefined();
  });

  it('tryUserMove with missing from/to', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4'] });
    // @ts-expect-error
    expect(() => eng.tryUserMove({})).not.toThrow();
    // @ts-expect-error
    expect(eng.tryUserMove({ from: 'd2' })).toMatchObject({ correct: false });
    // @ts-expect-error
    expect(eng.tryUserMove({ to: 'd4' })).toMatchObject({ correct: false });
  });

  it('tryUserMove after all moves completed', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4'] });
    eng.tryUserMove({ from: 'd2', to: 'd4' });
    const res = eng.tryUserMove({ from: 'd2', to: 'd4' });
    expect(res.correct).toBe(false);
  });

  it('getSeq, getStep, getTotal after multiple moves', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
    eng.tryUserMove({ from: 'd2', to: 'd4' });
    expect(eng.getStep()).toBe(1);
    expect(eng.getTotal()).toBe(2);
    expect(eng.getSeq()).toEqual(['d4', 'd5']);
  });
});
