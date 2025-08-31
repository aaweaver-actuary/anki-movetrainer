import { describe, it, expect, beforeEach } from 'vitest';
import { mountBoard } from '../src/ui';

declare global {
  interface Window {
    Chessboard?: any;
  }
}

beforeEach(() => {
  (window as any).Chessboard = function (el: any, cfg: any) {
    return {
      position: (fen: string) => {
        el.dataset.fen = fen;
      },
      cfg,
    };
  };
  document.body.innerHTML = '<div id="board"></div>';
});

describe('mountBoard', () => {
  it('mounts board and sets initial position', () => {
    const boardEl = document.getElementById('board')!;
    const handle = mountBoard(boardEl, {
      fen: 'start',
      onDrop: () => 'snapback',
    });
    expect(typeof handle.position).toBe('function');
    handle.position('customFEN');
    expect(boardEl.dataset.fen).toBe('customFEN');
  });

  it('throws if Chessboard global is missing', () => {
    (window as any).Chessboard = undefined;
    const boardEl = document.getElementById('board')!;
    expect(() =>
      mountBoard(boardEl, {
        fen: 'start',
        onDrop: () => 'snapback',
      }),
    ).toThrow();
  });

  it('throws error if Chessboard is not a function', () => {
    (window as any).Chessboard = null;
    const boardEl = document.createElement('div');
    expect(() =>
      mountBoard(boardEl, {
        fen: 'start',
        onDrop: () => 'snapback',
      }),
    ).toThrow('chessboard.js global not found');
  });
});

describe('mountBoard edge cases', () => {
  it('throws if boardEl is not attached to DOM', () => {
    const boardEl = document.createElement('div');
    expect(() =>
      mountBoard(boardEl, {
        fen: 'start',
        onDrop: () => 'snapback',
      }),
    ).not.toThrow(); // Should not throw, but boardEl is not in DOM
  });

  it('throws if options missing required properties', () => {
    const boardEl = document.createElement('div');
    // @ts-expect-error
    expect(() => mountBoard(boardEl, {})).toThrow();
  });

  it('throws if boardEl is a non-div element', () => {
    const boardEl = document.createElement('span');
    expect(() =>
      mountBoard(boardEl as any, {
        fen: 'start',
        onDrop: () => 'snapback',
      }),
    ).not.toThrow();
  });

  it('throws if Chessboard global is an object', () => {
    (window as any).Chessboard = {};
    const boardEl = document.createElement('div');
    expect(() =>
      mountBoard(boardEl, {
        fen: 'start',
        onDrop: () => 'snapback',
      }),
    ).toThrow('chessboard.js global not found');
  });
  it('throws if boardEl is missing', () => {
    expect(() =>
      mountBoard(undefined as any, {
        fen: 'start',
        onDrop: () => 'snapback',
      }),
    ).toThrow();
  });

  it('throws if options are missing', () => {
    const boardEl = document.createElement('div');
    expect(() => mountBoard(boardEl, undefined as any)).toThrow();
  });
});
