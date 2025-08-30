// Minimal chessboard.js surface we use (UMD global)
declare global {
  interface ChessboardHandle {
    position(fenOrStart: string): void;
  }

  interface ChessboardConfig {
    position?: string;
    draggable?: boolean;
    pieceTheme?: string;
    moveSpeed?: number;
    snapbackSpeed?: number;
    trashSpeed?: number;
    onDrop?: (source: string, target: string) => 'snapback' | void;
    onSnapEnd?: () => void;
  }

  function Chessboard(
    el: HTMLElement | string,
    config?: ChessboardConfig,
  ): ChessboardHandle;
}

export {};
