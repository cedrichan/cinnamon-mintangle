// Build-time debug flag. esbuild replaces __MINTANGLE_DEBUG__ with a boolean
// literal at each call site, enabling dead-code elimination of the entire
// log/logError body in production (NODE_ENV=production) builds.
declare const __MINTANGLE_DEBUG__: boolean;

export const DEBUG = __MINTANGLE_DEBUG__;

export function log(msg: string): void {
  if (__MINTANGLE_DEBUG__) global.log(msg);
}

export function logError(msg: string): void {
  if (__MINTANGLE_DEBUG__) global.logError(msg);
}
