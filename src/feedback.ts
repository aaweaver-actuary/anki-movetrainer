/**
 * @module feedback
 * Visuals: flash/arrow + progress + move list (numbers; future hidden)
 */

import { Feedback } from './types.js';

export function createFeedback(root: HTMLElement): Feedback {
  const wrap = root.querySelector('#board-wrap') as HTMLElement | null;
  const anno = root.querySelector('#anno') as SVGSVGElement | null;
  const pb = root.querySelector('#progress-bar') as HTMLProgressElement | null;
  const pt = root.querySelector('#progress-text') as HTMLElement | null;
  const ml = root.querySelector('#move-list') as HTMLElement | null;

  ensureAnnoDefs();

  function ensureAnnoDefs() {
    if (!anno) return;
    if (anno.querySelector('marker#arrowhead')) return;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'marker',
    );
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('refX', '2');
    marker.setAttribute('refY', '2');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,0 L4,2 L0,4 z');
    defs.appendChild(marker);
    marker.appendChild(path);
    anno.appendChild(defs);
  }

  function clearAnno() {
    if (!anno) return;
    const kids = Array.from(anno.children).filter((n) => n.tagName !== 'defs');
    kids.forEach((n) => n.remove());
  }

  function sqRect(sq: string, size: number) {
    const file = sq.charCodeAt(0) - 97;
    const rank = 8 - parseInt(sq[1], 10);
    const s = size / 8;
    return {
      x: file * s,
      y: rank * s,
      w: s,
      h: s,
      cx: (file + 0.5) * s,
      cy: (rank + 0.5) * s,
    };
  }

  function drawHint(from?: string, to?: string) {
    if (!anno || !from || !to) return;
    clearAnno();
    const size = wrap?.clientWidth ?? 340;
    const a = sqRect(from, size),
      b = sqRect(to, size);

    const r1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r1.setAttribute('class', 'hint-from');
    r1.setAttribute('x', String(a.x));
    r1.setAttribute('y', String(a.y));
    r1.setAttribute('width', String(a.w));
    r1.setAttribute('height', String(a.h));

    const r2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r2.setAttribute('class', 'hint-to');
    r2.setAttribute('x', String(b.x));
    r2.setAttribute('y', String(b.y));
    r2.setAttribute('width', String(b.w));
    r2.setAttribute('height', String(b.h));

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', 'hint');
    line.setAttribute('x1', String(a.cx));
    line.setAttribute('y1', String(a.cy));
    line.setAttribute('x2', String(b.cx));
    line.setAttribute('y2', String(b.cy));
    line.setAttribute('marker-end', 'url(#arrowhead)');

    anno.appendChild(r1);
    anno.appendChild(r2);
    anno.appendChild(line);
  }

  return {
    flashWrong(from?: string, to?: string) {
      if (wrap) {
        wrap.classList.add('flash-wrong', 'flash-anim');
        setTimeout(
          () => wrap.classList.remove('flash-wrong', 'flash-anim'),
          450,
        );
      }
      drawHint(from, to);
    },
    progress(step: number, total: number) {
      if (pb) {
        pb.max = total;
        pb.value = step;
      }
      if (pt) {
        pt.textContent = `Move ${Math.min(step + 1, total)} of ${total}`;
      }
    },
    listPlayed(san: string[], step: number) {
      if (!ml) return;
      let html = '';
      for (let i = 0; i < step; i++) {
        if (i % 2 === 0)
          html += `<span style="color:#888;">${((i / 2) | 0) + 1}. </span>`;
        html += `<span style="color:#333;">${san[i]}</span> `;
      }
      if (step < san.length) {
        if (step % 2 === 0)
          html += `<span style="color:#888;">${((step / 2) | 0) + 1}. </span>`;
        html += `<span style="color:#1976d2;font-weight:700;">&#8226;&#8226;&#8226;</span>`;
      }
      ml.innerHTML = html.trim();
    },
    clearAnno,
  };
}
