import { describe, it, expect } from 'vitest';
import { pieceMap, bundledPieceTheme } from '../src/pieces';

describe('pieceMap', () => {
  it('contains all expected piece keys', () => {
    const expectedKeys = [
      'bK',
      'bQ',
      'bR',
      'bB',
      'bN',
      'bP',
      'wK',
      'wQ',
      'wR',
      'wB',
      'wN',
      'wP',
    ];
    expectedKeys.forEach((key) => {
      expect(pieceMap).toHaveProperty(key);
    });
  });
});

describe('bundledPieceTheme', () => {
  it('returns correct URL for valid piece', () => {
    expect(typeof bundledPieceTheme('wK')).toBe('string');
    expect(bundledPieceTheme('wK')).toBe(pieceMap['wK']);
  });
  it('returns empty string for invalid piece', () => {
    expect(bundledPieceTheme('foo')).toBe('');
  });
});

describe('bundledPieceTheme edge cases', () => {
  it('returns empty string for array/object input', () => {
    // @ts-expect-error
    expect(bundledPieceTheme([])).toBe('');
    // @ts-expect-error
    expect(bundledPieceTheme({})).toBe('');
  });
  it('returns empty string for empty string and whitespace', () => {
    expect(bundledPieceTheme('')).toBe('');
    expect(bundledPieceTheme(' ')).toBe('');
    expect(bundledPieceTheme('\t')).toBe('');
  });
  it('returns empty string for symbol input', () => {
    // @ts-expect-error
    expect(bundledPieceTheme(Symbol('wK'))).toBe('');
  });
  it('returns empty string for non-string input', () => {
    // @ts-expect-error
    expect(bundledPieceTheme(null)).toBe('');
    // @ts-expect-error
    expect(bundledPieceTheme(undefined)).toBe('');
    // @ts-expect-error
    expect(bundledPieceTheme(123)).toBe('');
  });
  it('returns empty string for lowercase/uppercase mismatch', () => {
    expect(bundledPieceTheme('wk')).toBe('');
    expect(bundledPieceTheme('WK')).toBe('');
  });
});
