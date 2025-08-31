// Engine type definitions

export interface Engine {
  tryUserMove(_move: { from: string; to: string }): {
    correct: boolean;
    snapback: boolean;
    fen: string;
    expected?: { from?: string; to?: string };
  };
  expectedMove(): { from?: string; to?: string } | undefined;
  getFen(): string;
  getStep(): number;
  getTotal(): number;
  getSeq(): string[];
}
