import { describe, it, expect, beforeEach } from 'vitest';
import { createEngine } from '../src/engine';
import { safeExpectedMove } from '../src/helpers/engineHelpers';
import { getChessCtorFromWindow } from '../src/helpers/engineHelpers';
import { mountBoard } from '../src/ui';

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
  // eslint-disable-next-line no-unused-vars
  move(arg: any, _opts?: any) {
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

describe('getChessCtorFromWindow', () => {
  it('returns window.chess.Chess if present', () => {
    const win = { chess: { Chess: 'ctor' } };
    expect(getChessCtorFromWindow(win)).toBe('ctor');
  });
  it('returns window.chess if Chess is missing', () => {
    const win = { chess: 'ctor' };
    expect(getChessCtorFromWindow(win)).toBe('ctor');
  });
  it('returns undefined if chess is missing', () => {
    const win = {};
    expect(getChessCtorFromWindow(win)).toBeUndefined();
  });
  it('returns undefined if chess is null', () => {
    const win = { chess: null };
    expect(getChessCtorFromWindow(win)).toBeUndefined();
  });
});
describe('createEngine', () => {
  describe('createEngine sanSeq fallback coverage', () => {
    it('handles undefined sanSeq', () => {
      // @ts-expect-error
      const eng = createEngine({ fen: 'start', sanSeq: undefined });
      expect(eng.getSeq()).toEqual([]);
      expect(eng.getTotal()).toBe(0);
    });
    it('handles null sanSeq', () => {
      // @ts-expect-error
      const eng = createEngine({ fen: 'start', sanSeq: null });
      expect(eng.getSeq()).toEqual([]);
      expect(eng.getTotal()).toBe(0);
    });
    it('handles empty string sanSeq', () => {
      // @ts-expect-error
      const eng = createEngine({ fen: 'start', sanSeq: '' });
      expect(eng.getSeq()).toEqual([]);
      expect(eng.getTotal()).toBe(0);
    });
    it('handles omitted sanSeq', () => {
      // @ts-expect-error
      const eng = createEngine({ fen: 'start' });
      expect(eng.getSeq()).toEqual([]);
      expect(eng.getTotal()).toBe(0);
    });
  });
  // Robustness: always check FEN and step after moves
  it('initializes with start FEN and move sequence', () => {
    const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
    expect(eng.getFen()).toBe('start');
    expect(eng.getStep()).toBe(0);
    expect(eng.getTotal()).toBe(2);
    expect(eng.getSeq()).toEqual(['d4', 'd5']);
  });
  describe('engine.ts new features', () => {
    describe('getStatus explicit path coverage', () => {
      it('returns Checkmate if in_checkmate returns true', () => {
        const ChessCtor = function () {
          return {
            fen: () => 'start',
            in_checkmate: () => true,
            in_stalemate: () => false,
            in_draw: () => false,
          };
        };
        const eng = createEngine({ fen: 'start', sanSeq: [], ChessCtor });
        expect(eng.getStatus()).toBe('checkmate');
      });

      it('returns Stalemate if in_stalemate returns true', () => {
        const ChessCtor = function () {
          return {
            fen: () => 'start',
            in_checkmate: () => false,
            in_stalemate: () => true,
            in_draw: () => false,
          };
        };
        const eng = createEngine({ fen: 'start', sanSeq: [], ChessCtor });
        expect(eng.getStatus()).toBe('stalemate');
      });

      it('returns Draw if in_draw returns true', () => {
        const ChessCtor = function () {
          return {
            fen: () => 'start',
            in_checkmate: () => false,
            in_stalemate: () => false,
            in_draw: () => true,
          };
        };
        const eng = createEngine({ fen: 'start', sanSeq: [], ChessCtor });
        expect(eng.getStatus()).toBe('draw');
      });

      it('returns Ongoing if none are true', () => {
        const ChessCtor = function () {
          return {
            fen: () => 'start',
            in_checkmate: () => false,
            in_stalemate: () => false,
            in_draw: () => false,
          };
        };
        const eng = createEngine({ fen: 'start', sanSeq: [], ChessCtor });
        expect(eng.getStatus()).toBe('ongoing');
      });

      it('returns Unknown if error is thrown', () => {
        const ChessCtor = function () {
          return {
            fen: () => 'start',
            in_checkmate: () => {
              throw new Error('fail');
            },
          };
        };
        const eng = createEngine({ fen: 'start', sanSeq: [], ChessCtor });
        expect(eng.getStatus()).toBe('unknown');
      });
    });
    it('undo reverts last move and fen/step', () => {
      const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
      eng.tryUserMove({ from: 'd2', to: 'd4' });
      expect(eng.getStep()).toBe(1);
      expect(eng.undo()).toBe(true);
      expect(eng.getStep()).toBe(0);
      expect(eng.getFen()).toBe('start');
      // Undo at step 0 does nothing
      expect(eng.undo()).toBe(false);
    });

    it('redo re-applies next move and updates fen/step', () => {
      const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
      eng.tryUserMove({ from: 'd2', to: 'd4' });
      eng.undo();
      expect(eng.redo()).toBe(true);
      expect(eng.getStep()).toBe(1);
      // Redo at end of sequence does nothing
      eng.tryUserMove({ from: 'd7', to: 'd5' });
      expect(eng.redo()).toBe(false);
    });

    it('getHistory returns all moves made with FEN', () => {
      const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
      expect(eng.getHistory()).toEqual([]);
      eng.tryUserMove({ from: 'd2', to: 'd4' });
      const hist = eng.getHistory();
      expect(hist.length).toBe(1);
      expect(hist[0].from).toBe('d2');
      expect(hist[0].to).toBe('d4');
      expect(typeof hist[0].fen).toBe('string');
      eng.tryUserMove({ from: 'd7', to: 'd5' });
      expect(eng.getHistory().length).toBe(2);
    });

    it('getStatus returns correct game status', () => {
      const eng = createEngine({ fen: 'start', sanSeq: ['d4'] });
      // FakeChess does not implement status, so returns ongoing or unknown
      expect(['ongoing', 'unknown']).toContain(eng.getStatus());
      // Should not throw on edge cases
      eng.tryUserMove({ from: 'd2', to: 'd4' });
      expect(['ongoing', 'unknown']).toContain(eng.getStatus());
    });

    it('reset restores initial state', () => {
      const eng = createEngine({ fen: 'start', sanSeq: ['d4', 'd5'] });
      eng.tryUserMove({ from: 'd2', to: 'd4' });
      eng.tryUserMove({ from: 'd7', to: 'd5' });
      expect(eng.getStep()).toBe(2);
      eng.reset();
      expect(eng.getStep()).toBe(0);
      expect(eng.getFen()).toBe('start');
      expect(eng.getHistory()).toEqual([]);
    });

    it('dummy engine methods are safe and return expected defaults', () => {
      // @ts-expect-error
      const eng = createEngine();
      expect(eng.undo()).toBe(false);
      expect(eng.redo()).toBe(false);
      expect(eng.getHistory()).toEqual([]);
      expect(eng.getStatus()).toBe('unknown');
      expect(() => eng.reset()).not.toThrow();
    });
  });
  // ...existing code...

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

describe('createEngine dummy engine coverage', () => {
  it('returns dummy engine and covers all safe methods when params are missing/invalid', () => {
    // @ts-expect-error
    const eng = createEngine();
    expect(eng.tryUserMove({ from: '', to: '' })).toEqual({
      correct: false,
      snapback: true,
      fen: 'start',
    });
    expect(eng.expectedMove()).toBeUndefined();
    expect(eng.getFen()).toBe('start');
    expect(eng.getStep()).toBe(0);
    expect(eng.getTotal()).toBe(0);
    expect(eng.getSeq()).toEqual([]);
  });
});

describe('mountBoard error coverage', () => {
  it('throws if options.onDrop is missing or not a function', () => {
    const boardEl = document.createElement('div');
    // Missing onDrop
    expect(() => mountBoard(boardEl, { fen: 'start' } as any)).toThrow(
      'options.onDrop is required and must be a function',
    );
    // onDrop is not a function
    expect(() =>
      mountBoard(boardEl, { fen: 'start', onDrop: 42 } as any),
    ).toThrow('options.onDrop is required and must be a function');
  });
});
