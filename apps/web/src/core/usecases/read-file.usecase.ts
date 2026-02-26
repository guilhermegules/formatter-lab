export async function readFilesUseCase(
  files: FileList,
  validators: (() => boolean)[],
  onChunk: (chunk: string) => void,
  onComplete: VoidFunction
) {
  const [file] = files;

  const isValid = validators.every((validator) => validator());

  if (!isValid) return;

  const stream = file.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    onChunk(chunk);
  }

  onComplete();
}
