(globalThis as any).Chess = class {
  constructor(_fen?: string) {}
  fen() {
    return 'start';
  }
  move(arg: any) {
    if (typeof arg === 'string') return { from: 'd2', to: 'd4', san: 'd4' };
    if (arg?.from && arg?.to) return { from: arg.from, to: arg.to, san: 'd4' };
    return null;
  }
  undo() {}
  turn() {
    return 'w' as const;
  }
};
(globalThis as any).Chessboard = function () {
  return { position() {} };
};
