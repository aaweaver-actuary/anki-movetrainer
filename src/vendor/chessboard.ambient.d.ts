/* eslint-disable @typescript-eslint/no-unused-vars */
// Minimal chessboard.js surface we use (UMD global)
declare global {
  interface ChessboardHandle {
    position(_fenOrStart: string): void;
  }

  interface ChessboardConfig {
    position?: string;
    draggable?: boolean;
    pieceTheme?: string;
    moveSpeed?: number;
    snapbackSpeed?: number;
    trashSpeed?: number;
    onDrop?: (_source: string, _target: string) => 'snapback' | void;
    onSnapEnd?: () => void;
  }

  function Chessboard(
    _el: HTMLElement | string,
    _config?: ChessboardConfig,
  ): ChessboardHandle;
}

export {};
