import { createEngine } from './engine';
import { mountBoard } from './ui';
import { createFeedback } from './feedback';
import { createScheduler } from './scheduler';
import { bundledPieceTheme } from './pieces';

import type { Engine } from './types';
import type { BoardHandle } from './types';
import type { Feedback } from './types';
import type { InitOptions } from './types';

export function handleMove(
  engine: Engine,
  board: BoardHandle,
  feedback: Feedback,
  scheduler: { fail: () => void; pass: () => void },
  source: string,
  target: string,
  opts: Partial<InitOptions> = {},
): void | 'snapback' {
  if (source === target) return 'snapback';
  const res = engine.tryUserMove({ from: source, to: target });
  if (!res.correct) {
    feedback.flashWrong(res.expected?.from, res.expected?.to);
    if (typeof scheduler.fail === 'function') scheduler.fail();
    board.position(res.fen);
    return 'snapback';
  }
  feedback.progress(engine.getStep(), engine.getTotal());
  feedback.listPlayed(engine.getSeq(), engine.getStep());
  if (engine.getStep() === engine.getTotal()) {
    if (typeof scheduler.pass === 'function') scheduler.pass();
  } else {
    if (typeof setTimeout === 'function') {
      const nextSAN = engine.getSeq()[engine.getStep()];
      setTimeout(() => {
        const exp = engine.expectedMove();
        if (exp?.from && exp?.to) {
          const ChessCtor =
            (window as any).Chess ||
            ((window as any).chess && (window as any).chess.Chess);
          const tmp = new ChessCtor(engine.getFen());
          const mv = tmp.move(nextSAN, { sloppy: true });
          if (mv) {
            // Optionally handle opponent move
          }
        }
      }, opts.delayMs ?? 450);
    }
  }
}

export function init(
  root: HTMLElement,
  fields: { fen: string; sanJson: string },
  opts: Partial<InitOptions> = {},
) {
  const fen = fields.fen?.trim() || 'start';
  let sanSeq: string[] = [];
  try {
    const parsed = JSON.parse(fields.sanJson || '[]');
    sanSeq = Array.isArray(parsed) ? parsed.flat() : [];
  } catch {
    sanSeq = [];
  }
  const engine = createEngine({ fen, sanSeq });
  const boardEl = root.querySelector('#board');
  if (!(boardEl instanceof HTMLElement)) {
    throw new Error('boardEl is required and must be an HTMLElement');
  }
  const fb = createFeedback(root);
  const scheduler = createScheduler({ autoAnswer: opts.autoAnswer ?? true });
  const board = mountBoard(boardEl, {
    fen,
    pieceTheme: opts.pieceTheme ?? ((name: string) => bundledPieceTheme(name)),
    speeds: opts.speeds,
    onDrop: (source, target) =>
      handleMove(engine, board, fb, scheduler, source, target, opts),
  });

  // initial UI
  fb.progress(engine.getStep(), engine.getTotal());
  fb.listPlayed(engine.getSeq(), engine.getStep());

  return { engine, board, fb, scheduler };
}

// UMD global for Anki
// @ts-ignore
if (typeof window !== 'undefined') (window as any).AnkiMoveTrainer = { init };
