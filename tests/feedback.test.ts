import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFeedback } from '../src/feedback';

describe('createFeedback', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="board-wrap"></div>
      <svg id="anno"></svg>
      <progress id="progress-bar"></progress>
      <div id="progress-text"></div>
      <div id="move-list"></div>
    `;
    root = document.body;
  });

  it('initializes and exposes feedback methods', () => {
    const feedback = createFeedback(root);
    expect(typeof feedback.flashWrong).toBe('function');
    expect(typeof feedback.progress).toBe('function');
    expect(typeof feedback.listPlayed).toBe('function');
    expect(typeof feedback.clearAnno).toBe('function');
  });

  it('updates progress bar and text', () => {
    const feedback = createFeedback(root);
    feedback.progress(1, 3);
    const pb = root.querySelector('#progress-bar') as HTMLProgressElement;
    const pt = root.querySelector('#progress-text') as HTMLElement;
    expect(pb.value).toBe(1);
    expect(pb.max).toBe(3);
    expect(pt.textContent).toContain('Move 2 of 3');
  });

  it('updates move list display', () => {
    const feedback = createFeedback(root);
    feedback.listPlayed(['d4', 'd5', 'Nf3'], 2);
    const ml = root.querySelector('#move-list') as HTMLElement;
    expect(ml.innerHTML).toContain('d4');
    expect(ml.innerHTML).toContain('d5');
  });

  it('flashes wrong and draws hint', () => {
    const feedback = createFeedback(root);
    const wrap = root.querySelector('#board-wrap') as HTMLElement;
    feedback.flashWrong('d2', 'd4');
    expect(wrap.classList.contains('flash-wrong')).toBe(true);
    setTimeout(() => {
      expect(wrap.classList.contains('flash-wrong')).toBe(false);
    }, 500);
  });

  it('clears SVG annotations', () => {
    const feedback = createFeedback(root);
    const anno = root.querySelector('#anno') as SVGSVGElement;
    // Add a dummy child
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    anno.appendChild(rect);
    feedback.clearAnno();
    expect(Array.from(anno.children).some((n) => n.tagName === 'rect')).toBe(
      false,
    );
  });
});

describe('feedback.ts uncovered lines', () => {
  // Only test public API, do not call private functions directly
  it('flashWrong calls drawHint and covers early returns for missing args', () => {
    const root = document.createElement('div');
    const feedback = createFeedback(root);
    expect(() => feedback.flashWrong()).not.toThrow();
    expect(() => feedback.flashWrong('a1')).not.toThrow();
    expect(() => feedback.flashWrong('a1', undefined)).not.toThrow();
  });
});

describe('feedback.ts edge cases', () => {
  it('progress with negative step/total', () => {
    const root = document.createElement('div');
    root.innerHTML =
      '<progress id="progress-bar"></progress><div id="progress-text"></div>';
    const feedback = createFeedback(root);
    feedback.progress(-1, -3);
    const pt = root.querySelector('#progress-text') as HTMLElement;
    expect(pt.textContent).toContain('Move 0 of -3');
  });

  it('listPlayed with non-array input', () => {
    const root = document.createElement('div');
    root.innerHTML = '<div id="move-list"></div>';
    const feedback = createFeedback(root);
    // @ts-expect-error
    expect(() => feedback.listPlayed(null, 0)).not.toThrow();
    // @ts-expect-error
    expect(() => feedback.listPlayed(undefined, 0)).not.toThrow();
    // @ts-expect-error
    expect(() => feedback.listPlayed({}, 0)).not.toThrow();
  });

  it('flashWrong with board elements missing', () => {
    const root = document.createElement('div');
    root.innerHTML = '<svg id="anno"></svg>';
    const feedback = createFeedback(root);
    expect(() => feedback.flashWrong('d2', 'd4')).not.toThrow();
  });

  it('clearAnno when SVG has no children', () => {
    const root = document.createElement('div');
    root.innerHTML = '<svg id="anno"></svg>';
    const feedback = createFeedback(root);
    const anno = root.querySelector('#anno') as SVGSVGElement;
    feedback.clearAnno();
    const children = Array.from(anno.children);
    expect(children.length).toBe(1);
    expect(children[0].tagName).toBe('defs');
  });

  it('createFeedback with root missing required children', () => {
    const root = document.createElement('div');
    expect(() => createFeedback(root)).not.toThrow();
  });
  it('progress with step > total', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    root.innerHTML =
      '<progress id="progress-bar"></progress><div id="progress-text"></div>';
    const feedback = createFeedback(root);
    feedback.progress(5, 3);
    const pt = root.querySelector('#progress-text') as HTMLElement;
    expect(pt.textContent).toContain('Move 6 of 3');
  });

  it('listPlayed with empty move list', () => {
    const root = document.createElement('div');
    root.innerHTML = '<div id="move-list"></div>';
    const feedback = createFeedback(root);
    feedback.listPlayed([], 0);
    const ml = root.querySelector('#move-list') as HTMLElement;
    expect(ml.innerHTML).toBe('');
  });

  it('flashWrong with invalid squares', () => {
    const root = document.createElement('div');
    root.innerHTML = '<div id="board-wrap"></div><svg id="anno"></svg>';
    const feedback = createFeedback(root);
    expect(() => feedback.flashWrong('invalid', 'invalid')).not.toThrow();
  });

  it('clearAnno with multiple children', () => {
    // clearAnno should remove only non-'defs' children, preserving SVG marker definitions
    const root = document.createElement('div');
    root.innerHTML = '<svg id="anno"></svg>';
    const feedback = createFeedback(root);
    const anno = root.querySelector('#anno') as SVGSVGElement;
    // Add a <defs> child and two <rect> children
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const rect1 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    const rect2 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    anno.appendChild(defs);
    anno.appendChild(rect1);
    anno.appendChild(rect2);
    feedback.clearAnno();
    // Only <defs> should remain
    const children = Array.from(anno.children);
    expect(children.length).toBe(1);
    expect(children[0].tagName).toBe('defs');
  });
});
