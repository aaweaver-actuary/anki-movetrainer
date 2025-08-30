/**
 * @module ui
 * Thin wrapper for chessboard.js mounting and event binding.
 */

import { BoardHandle } from './types';
import 'chessboardjs/dist/chessboard-1.0.0.min.css'; // optional: bundle CSS
import ChessboardImport from 'chessboardjs';

declare global {
  interface Window {
    Chessboard?: any;
  }
}

// Ensure the global (your existing code expects window.Chessboard)
if (typeof window !== 'undefined' && !window.Chessboard) {
  (window as any).Chessboard = ChessboardImport as any;
}
declare global {
  interface Window {
    Chessboard?: any;
  }
}

export function mountBoard(
  boardEl: HTMLElement,
  opts: {
    fen: string;
    pieceTheme?: string | ((name: string) => string);
    speeds?: { move?: number; snapback?: number; trash?: number };
    onDrop: (source: string, target: string) => 'snapback' | void;
  },
): BoardHandle {
  const Chessboard = window.Chessboard;
  if (typeof Chessboard !== 'function')
    throw new Error('chessboard.js global not found');

  const handle = Chessboard(boardEl, {
    position: opts.fen === 'start' ? 'start' : opts.fen,
    draggable: true,
    pieceTheme: opts.pieceTheme,
    moveSpeed: opts.speeds?.move ?? 150,
    snapbackSpeed: opts.speeds?.snapback ?? 120,
    trashSpeed: opts.speeds?.trash ?? 80,
    onDrop: opts.onDrop,
    onSnapEnd: () => handle.position(opts.fen === 'start' ? 'start' : opts.fen),
  });

  return {
    position: (fen: string) => handle.position(fen === 'start' ? 'start' : fen),
  };
}
