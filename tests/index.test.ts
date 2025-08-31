import { describe, it, expect, vi, beforeEach } from 'vitest';
import { init, handleMove } from '../src/index';

describe('init', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="board-wrap">
        <div id="board"></div>
        <svg id="anno"></svg>
      </div>
      <progress id="progress-bar"></progress>
      <div id="progress-text"></div>
      <div id="move-list"></div>
    `;
    root = document.body;
  });

  it('initializes and returns API objects', () => {
    const api = init(root, { fen: 'start', sanJson: '["d4","d5"]' }, {});
    expect(api.engine).toBeDefined();
    expect(api.board).toBeDefined();
    expect(api.fb).toBeDefined();
    expect(api.scheduler).toBeDefined();
  });

  it('sets up initial UI state', () => {
    const api = init(root, { fen: 'start', sanJson: '["d4","d5"]' }, {});
    const pb = root.querySelector('#progress-bar') as HTMLProgressElement;
    const pt = root.querySelector('#progress-text') as HTMLElement;
    const ml = root.querySelector('#move-list') as HTMLElement;
    expect(pb.value).toBe(0);
    expect(pb.max).toBe(2);
    expect(pt.textContent).toContain('Move 1 of 2');
    expect(ml.innerHTML).toContain('•••');
  });

  it('handles correct and incorrect moves via handleMove', () => {
    const api = init(root, { fen: 'start', sanJson: '["d4","d5"]' }, {});
    // Simulate correct move
    const result = handleMove(
      api.engine,
      api.board,
      api.fb,
      api.scheduler,
      'd2',
      'd4',
      {},
    );
    expect(result).toBeUndefined();
    // Simulate incorrect move
    const result2 = handleMove(
      api.engine,
      api.board,
      api.fb,
      api.scheduler,
      'g1',
      'f3',
      {},
    );
    expect(result2).toBe('snapback');
  });

  it('calls scheduler.pass on completion', () => {
    const passSpy = vi.fn();
    const api = init(root, { fen: 'start', sanJson: '["d4"]' }, {});
    api.scheduler.pass = passSpy;
    // Simulate correct move to complete
    handleMove(api.engine, api.board, api.fb, api.scheduler, 'd2', 'd4', {});
    expect(passSpy).toHaveBeenCalled();
  });

  it('handles opponent reply with setTimeout', () => {
    vi.useFakeTimers();
    const api = init(
      root,
      { fen: 'start', sanJson: '["d4","d5"]' },
      { delayMs: 100 },
    );
    // Simulate correct move
    handleMove(api.engine, api.board, api.fb, api.scheduler, 'd2', 'd4', {
      delayMs: 100,
    });
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('sets UMD global for Anki', () => {
    (globalThis as any).window = globalThis;
    init(root, { fen: 'start', sanJson: '["d4"]' }, {});
    expect((window as any).AnkiMoveTrainer).toBeDefined();
    delete (globalThis as any).window.AnkiMoveTrainer;
  });
});

describe('index.ts edge cases', () => {
  it('init with missing progress/move-list elements', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<div id="board-wrap"><div id="board"></div><svg id="anno"></svg></div>';
    expect(() => init(root, { fen: 'start', sanJson: '[]' }, {})).not.toThrow();
  });

  it('handleMove with scheduler missing methods', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<div id="board-wrap"><div id="board"></div><svg id="anno"></svg></div>';
    const api = init(root, { fen: 'start', sanJson: '[]' }, {});
    // @ts-expect-error
    api.scheduler.pass = undefined;
    // @ts-expect-error
    api.scheduler.fail = undefined;
    expect(() =>
      handleMove(api.engine, api.board, api.fb, api.scheduler, 'd2', 'd4', {}),
    ).not.toThrow();
  });

  it('init with sanJson as empty array', () => {
    const root = document.createElement('div');
    expect(() => init(root, { fen: 'start', sanJson: '[]' }, {})).toThrow(
      'boardEl is required and must be an HTMLElement',
    );
  });

  it('init with sanJson as deeply nested array', () => {
    const root = document.createElement('div');
    expect(() =>
      init(root, { fen: 'start', sanJson: '[["d4"],["d5"]]' }, {}),
    ).toThrow('boardEl is required and must be an HTMLElement');
  });

  it('init with root as null/undefined', () => {
    expect(() =>
      init(null as any, { fen: 'start', sanJson: '[]' }, {}),
    ).toThrow();
    expect(() =>
      init(undefined as any, { fen: 'start', sanJson: '[]' }, {}),
    ).toThrow();
  });
  it('init with malformed sanJson', () => {
    const root = document.createElement('div');
    expect(() =>
      init(root, { fen: 'start', sanJson: 'not-json' }, {}),
    ).toThrow();
  });

  it('handleMove with undefined source/target', () => {
    const api = init(document.body, { fen: 'start', sanJson: '["d4"]' }, {});
    expect(
      handleMove(
        api.engine,
        api.board,
        api.fb,
        api.scheduler,
        undefined as any,
        'd4',
        {},
      ),
    ).toBe('snapback');
    expect(
      handleMove(
        api.engine,
        api.board,
        api.fb,
        api.scheduler,
        'd2',
        undefined as any,
        {},
      ),
    ).toBe('snapback');
  });

  it('init with missing #board element', () => {
    const root = document.createElement('div');
    expect(() => init(root, { fen: 'start', sanJson: '["d4"]' }, {})).toThrow();
  });
});
