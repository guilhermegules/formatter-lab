import { fileErrorTemplate } from "../templates/file-error.template";

export function fileNotJsonValidator(file: File) {
  if (!file.name.endsWith(".json")) {
    fileErrorTemplate("The selected file is not an JSON.");
    return false;
  }

  return true;
}
