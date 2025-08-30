/**
 * @module scheduler
 * Auto-answer bridge to Anki via pycmd, guarded to run once.
 */

export function createScheduler({
  autoAnswer = true,
}: {
  autoAnswer?: boolean;
}) {
  let answered = false;
  function fail() {
    if (
      autoAnswer &&
      typeof (window as any).pycmd === 'function' &&
      !answered
    ) {
      answered = true;
      setTimeout(() => {
        try {
          (window as any).pycmd('fail_line');
        } catch {
          /* noop */
        }
      }, 0);
    }
  }
  function pass() {
    if (
      autoAnswer &&
      typeof (window as any).pycmd === 'function' &&
      !answered
    ) {
      answered = true;
      try {
        (window as any).pycmd('pass_line');
      } catch {
        /* noop */
      }
    }
  }
  return { fail, pass };
}
