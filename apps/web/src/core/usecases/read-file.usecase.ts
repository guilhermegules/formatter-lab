export async function readFilesUseCase(
  files: FileList,
  validators: (() => boolean)[]
) {
  const [file] = files;

  const isValid = validators.every((validator) => validator());

  if (!isValid) return;

  const stream = file.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let jsonString = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    jsonString += decoder.decode(value, { stream: true });
  }

  if (!jsonString) return;

  return jsonString;
}
