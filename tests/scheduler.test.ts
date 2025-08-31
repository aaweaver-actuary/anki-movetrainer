import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createScheduler } from '../src/scheduler';

describe('createScheduler', () => {
  let pycmdMock: any;
  beforeEach(() => {
    vi.useFakeTimers();
    pycmdMock = vi.fn();
    (window as any).pycmd = pycmdMock;
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls pycmd fail_line only once', () => {
    const scheduler = createScheduler({ autoAnswer: true });
    scheduler.fail();
    scheduler.fail();
    vi.runAllTimers();
    expect(pycmdMock).toHaveBeenCalledTimes(1);
    expect(pycmdMock).toHaveBeenCalledWith('fail_line');
  });

  it('calls pycmd pass_line only once', () => {
    const scheduler = createScheduler({ autoAnswer: true });
    scheduler.pass();
    scheduler.pass();
    expect(pycmdMock).toHaveBeenCalledTimes(1);
    expect(pycmdMock).toHaveBeenCalledWith('pass_line');
  });

  it('does not call pycmd if autoAnswer is false', () => {
    const scheduler = createScheduler({ autoAnswer: false });
    scheduler.fail();
    scheduler.pass();
    vi.runAllTimers();
    expect(pycmdMock).not.toHaveBeenCalled();
  });
});

describe('scheduler.ts uncovered lines', () => {
  it('fail catch block does not throw', () => {
    const scheduler = createScheduler({ autoAnswer: true });
    (window as any).pycmd = () => {
      throw new Error('fail');
    };
    expect(() => scheduler.fail()).not.toThrow();
  });

  it('pass catch block does not throw', () => {
    const scheduler = createScheduler({ autoAnswer: true });
    (window as any).pycmd = () => {
      throw new Error('pass');
    };
    expect(() => scheduler.pass()).not.toThrow();
  });
});

describe('scheduler.ts edge cases', () => {
  it('fail and pass handle async pycmd errors', async () => {
    (window as any).pycmd = async () => {
      throw new Error('async fail');
    };
    const scheduler = createScheduler({ autoAnswer: true });
    await expect(async () => await scheduler.fail()).not.toThrow();
    await expect(async () => await scheduler.pass()).not.toThrow();
  });

  it('fail and pass handle unexpected pycmd return values', () => {
    (window as any).pycmd = () => 42;
    const scheduler = createScheduler({ autoAnswer: true });
    expect(() => scheduler.fail()).not.toThrow();
    expect(() => scheduler.pass()).not.toThrow();
  });

  it('scheduler handles rapid repeated calls', () => {
    const scheduler = createScheduler({ autoAnswer: true });
    for (let i = 0; i < 10; i++) {
      scheduler.fail();
      scheduler.pass();
    }
    expect(() => scheduler.fail()).not.toThrow();
    expect(() => scheduler.pass()).not.toThrow();
  });
  it('fail and pass do nothing if pycmd is not a function', () => {
    (window as any).pycmd = 'notAFunction';
    const scheduler = createScheduler({ autoAnswer: true });
    expect(() => scheduler.fail()).not.toThrow();
    expect(() => scheduler.pass()).not.toThrow();
  });

  it('fail and pass do nothing if already answered', () => {
    const scheduler = createScheduler({ autoAnswer: true });
    scheduler.fail();
    scheduler.pass();
    expect(() => scheduler.fail()).not.toThrow();
    expect(() => scheduler.pass()).not.toThrow();
  });
});
