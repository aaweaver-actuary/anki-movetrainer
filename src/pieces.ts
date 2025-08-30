// src/pieces.ts
// Map chessboard.js piece keys to inlined data URLs via rollup-url plugin
import bK from './assets/pieces/wikipedia/bK.png';
import bQ from './assets/pieces/wikipedia/bQ.png';
import bR from './assets/pieces/wikipedia/bR.png';
import bB from './assets/pieces/wikipedia/bB.png';
import bN from './assets/pieces/wikipedia/bN.png';
import bP from './assets/pieces/wikipedia/bP.png';
import wK from './assets/pieces/wikipedia/wK.png';
import wQ from './assets/pieces/wikipedia/wQ.png';
import wR from './assets/pieces/wikipedia/wR.png';
import wB from './assets/pieces/wikipedia/wB.png';
import wN from './assets/pieces/wikipedia/wN.png';
import wP from './assets/pieces/wikipedia/wP.png';

export const pieceMap: Record<string, string> = {
  bK,
  bQ,
  bR,
  bB,
  bN,
  bP,
  wK,
  wQ,
  wR,
  wB,
  wN,
  wP,
};

export function bundledPieceTheme(name: string): string {
  // chessboard.js calls pieceTheme with '{piece}.png' names like 'wK'
  return pieceMap[name] || '';
}
