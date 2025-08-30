import { describe, it, expect, beforeEach } from 'vitest';
import { init } from '../src/index';

declare global {
  interface Window {
    Chess?: new (fen?: string) => any;
    Chessboard?: any;
  }
}

// Minimal fakes to prove wiring; swap for real libs as needed
class FakeChess {
  constructor(_fen?: string) {}
  fen() {
    return 'start';
  }
  move() {
    return { from: 'd2', to: 'd4' };
  }
  undo() {}
}
function FakeChessboard(_el: any, cfg: any) {
  return { position: (_f: any) => {}, cfg };
}

beforeEach(() => {
  (window as any).Chess = FakeChess;
  (window as any).Chessboard = FakeChessboard;
  document.body.innerHTML = `
  <div id="root">
    <div id="board-wrap"><div id="board"></div><svg id="anno"></svg></div>
    <progress id="progress-bar"></progress>
    <div id="progress-text"></div>
    <div id="move-list"></div>
  </div>`;
});

describe('init smoke', () => {
  it('initializes without throwing', () => {
    const root = document.getElementById('root')!;
    const api = init(
      root,
      { fen: 'start', sanJson: '["d4","d5"]' },
      { autoAnswer: false },
    );
    expect(api.engine.getTotal()).toBe(2);
  });
});
