/* eslint-disable @typescript-eslint/no-unused-vars */
// Ambient declarations for static asset imports used by Rollup (plugin-url, css)
// Allow importing PNGs as module strings (data URLs after bundling)
declare module '*.png' {
  const src: string;
  export default src;
}

// (Optional) If you import CSS in TS files, allow it as a module
declare module '*.css' {
  const cssHref: string;
  export default cssHref;
}
