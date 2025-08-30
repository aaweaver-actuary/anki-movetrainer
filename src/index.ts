import { createEngine } from './engine';
import { mountBoard } from './ui';
import { createFeedback } from './feedback';
import { createScheduler } from './scheduler';
import { bundledPieceTheme } from './pieces';

import type { InitOptions } from './types';

export function init(
  root: HTMLElement,
  fields: { fen: string; sanJson: string },
  opts: Partial<InitOptions> = {},
) {
  const fen = fields.fen?.trim() || 'start';
  const sanSeq = JSON.parse(fields.sanJson || '[]') as string[];
  const engine = createEngine({ fen, sanSeq });
  const boardEl = root.querySelector('#board') as HTMLElement;
  const board = mountBoard(boardEl, {
    fen,
    pieceTheme: opts.pieceTheme ?? ((name: string) => bundledPieceTheme(name)),
    speeds: opts.speeds,
    onDrop: (source, target) => {
      if (source === target) return 'snapback';
      const res = engine.tryUserMove({ from: source, to: target });
      if (!res.correct) {
        const feedback = fb;
        feedback.flashWrong(res.expected?.from, res.expected?.to);
        scheduler.fail();
        // restore UI to engine FEN to guarantee snapback
        board.position(res.fen);
        return 'snapback';
      }
      fb.progress(engine.getStep(), engine.getTotal());
      fb.listPlayed(engine.getSeq(), engine.getStep());
      // completion?
      if (engine.getStep() === engine.getTotal()) {
        scheduler.pass();
      } else {
        // opponent reply with small delay
        if (typeof setTimeout === 'function') {
          const nextSAN = engine.getSeq()[engine.getStep()];
          setTimeout(() => {
            // engine-level auto-play for opponent: simulate expected move
            const exp = engine.expectedMove();
            if (exp?.from && exp?.to) {
              // “force” board to new fen via engine try (bypass correctness)
              // You can extend engine with an autoPlayExpected() if you prefer.
              const ChessCtor =
                (window as any).Chess ||
                ((window as any).chess && (window as any).chess.Chess);
              const tmp = new ChessCtor(engine.getFen());
              const mv = tmp.move(nextSAN, { sloppy: true });
              if (mv) {
                // We don't advance engine step here; your existing onDrop path does this.
                // In a fuller version, expose an engine.applyExpected() to advance step/FEN.
              }
            }
          }, opts.delayMs ?? 450);
        }
      }
    },
  });

  const fb = createFeedback(root);
  const scheduler = createScheduler({ autoAnswer: opts.autoAnswer ?? true });

  // initial UI
  fb.progress(engine.getStep(), engine.getTotal());
  fb.listPlayed(engine.getSeq(), engine.getStep());

  return { engine, board, fb, scheduler };
}

// UMD global for Anki
// @ts-ignore
if (typeof window !== 'undefined') (window as any).AnkiMoveTrainer = { init };
