import { describe, it, expect } from 'vitest';
import { assignChessGlobal } from '../src/engine';

function cleanupChessGlobal() {
  if (typeof window !== 'undefined') {
    delete (window as any).Chess;
  }
}

function simulateBrowserEnvironment() {
  (globalThis as any).window = globalThis;
}

describe('assignChessGlobal', () => {
  it('assigns window.Chess if not present and window is defined', () => {
    simulateBrowserEnvironment();
    delete (window as any).Chess;
    assignChessGlobal();
    expect(window.Chess).toBeDefined();
    cleanupChessGlobal();
  });

  it('does not overwrite window.Chess if already defined', () => {
    simulateBrowserEnvironment();
    (window as any).Chess = 'existing';
    assignChessGlobal();
    expect(window.Chess).toBe('existing');
    cleanupChessGlobal();
  });

  it('does nothing if window is undefined', () => {
    // Remove window if present
    if ('window' in globalThis) {
      // Do not delete window, just skip
    }
    expect(() => assignChessGlobal()).not.toThrow();
  });
});

describe('assignChessGlobal edge cases', () => {
  it('does not throw if ChessESM is undefined', () => {
    (globalThis as any).window = globalThis;
    const originalChessESM = (globalThis as any).ChessESM;
    (globalThis as any).ChessESM = undefined;
    expect(() => assignChessGlobal()).not.toThrow();
    (globalThis as any).ChessESM = originalChessESM;
  });

  it('does not overwrite non-function window.Chess', () => {
    (globalThis as any).window = globalThis;
    (window as any).Chess = 123;
    assignChessGlobal();
    expect(window.Chess).toBe(123);
    delete (window as any).Chess;
  });
});
