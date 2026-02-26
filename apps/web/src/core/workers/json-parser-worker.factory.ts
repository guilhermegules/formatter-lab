export function createJsonWorker() {
  return new Worker(
    new URL('./json-parser.worker.ts', import.meta.url),
    { type: 'module' }
  );
}