import { readFilesUseCase } from "../../core/usecases/read-file.usecase";
import { fileErrorTemplate } from "./templates/file-error.template";
import { fileNotExistValidator } from "./validators/file-not-exists.validators";
import { fileNotJsonValidator } from "./validators/file-not-json.validators";
import { createJsonWorker } from "../../core/workers/json-parser-worker.factory";
import { VirtualJsonTree } from "./virtual-json-tree";

const filePicker = document.getElementById("file-picker")!;
const content = document.getElementById("content")!;
const dropZone = document.getElementById("drop-zone")!;
const treeViewer = new VirtualJsonTree(content);

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
      "No files were dropped. Make sure you're dragging files and not other items.",
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

  const worker = createJsonWorker();

  worker.onmessage = (e) => {
    if (e.data.type === "nodes") {
      requestAnimationFrame(() => {
        treeViewer.addNodes(e.data.nodes);
      });
    }
  };

  await readFilesUseCase(
    files,
    validators,
    (chunk) => worker.postMessage({ type: "process", chunk }),
    () => worker.postMessage({ type: "complete" }),
  );
}
