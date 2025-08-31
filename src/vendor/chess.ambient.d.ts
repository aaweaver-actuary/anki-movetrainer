/* eslint-disable @typescript-eslint/no-unused-vars */
// Minimal chess.js surface we use.
// This models the UMD global attached to window.
declare global {
  type ChessTurn = 'w' | 'b';

  interface ChessMove {
    from: string;
    to: string;
    san: string;
  }

  interface ChessCtor {
    new (fen?: string): ChessAPI;
  }

  interface ChessAPI {
    fen(): string;
    move(
      move:
        | string
        | { from: string; to: string; promotion?: 'q' | 'r' | 'b' | 'n' },
      opts?: { sloppy?: boolean },
    ): ChessMove | null;
    undo(): void;
    turn(): ChessTurn;
    // load(fen: string): boolean;
  }

  // chess.js UMD variants:
  var Chess: ChessCtor | undefined;
  var chess: { Chess?: ChessCtor } | undefined;
}

export {};
