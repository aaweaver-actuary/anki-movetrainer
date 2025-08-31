// UI options type definitions

export interface MountBoardOptions {
  fen: string;
  pieceTheme?: string | ((name: string) => string);
  speeds?: { move?: number; snapback?: number; trash?: number };
  onDrop: (source: string, target: string) => 'snapback' | void;
}
