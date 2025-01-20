import { getJsonContainer } from "@repo/json-utils";
import { DEFAULT_TIP_MESSAGE } from "../../core/constants/default-messages.contants";
import { readFilesUseCase } from "../../core/usecases/read-file.usecase";
import { fileErrorTemplate } from "./templates/file-error.template";
import { fileNotExistValidator } from "./validators/file-not-exists.validators";
import { fileNotJsonValidator } from "./validators/file-not-json.validators";
import { collapseEvent } from "./events/collapse.event";

const filePicker = document.getElementById("file-picker")!;
const content = document.getElementById("content")!;
const dropZone = document.getElementById("drop-zone")!;

function appendCollapseEvent() {
  const collapseBrackets = document.querySelectorAll(".bracket");

  collapseBrackets.forEach((bracket) => {
    bracket.addEventListener("click", () => collapseEvent(bracket));
  });
}

filePicker.addEventListener("change", async (e) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  handleFiles(files);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("click", () => {
  filePicker.click();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();

  dropZone.classList.remove("dragover");

  const files = e.dataTransfer?.files;

  if (!files || files.length === 0) {
    fileErrorTemplate(
      "No files were dropped. Make sure you're dragging files and not other items."
    );
    return;
  }

  handleFiles(files);
});

async function handleFiles(files: FileList) {
  const [file] = files;

  const validators = [
    () => fileNotExistValidator(file),
    () => fileNotJsonValidator(file),
  ];

  const jsonString = await readFilesUseCase(files, validators);

  if (!jsonString) return;

  content.innerHTML = getJsonContainer(JSON.parse(jsonString));
}
