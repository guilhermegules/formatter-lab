import { fileErrorTemplate } from "../templates/file-error.template";

export function fileNotExistValidator(file: File) {
  if (!file) {
    fileErrorTemplate("No files selected.");
    return false;
  }

  return true;
}
