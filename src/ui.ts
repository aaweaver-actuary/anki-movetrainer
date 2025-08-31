/**
 * @module ui
 * Thin wrapper for chessboard.js mounting and event binding.
 */

import { BoardHandle } from './types/boardhandle';

declare global {
  interface Window {
    Chessboard?: any;
  }
}

export function mountBoard(
  boardEl: HTMLElement,
  opts: import('./types/ui').MountBoardOptions,
): BoardHandle {
  if (!boardEl || !(boardEl instanceof HTMLElement)) {
    throw new Error('boardEl is required and must be an HTMLElement');
  }
  if (!opts || typeof opts !== 'object') {
    throw new Error('options are required');
  }
  if (typeof opts.fen !== 'string') {
    throw new Error('options.fen is required and must be a string');
  }
  if (typeof opts.onDrop !== 'function') {
    throw new Error('options.onDrop is required and must be a function');
  }
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
