import { getJsonContainer } from "@repo/json-utils";

const filePicker = document.getElementById("file-picker")!;
const content = document.getElementById("content")!;
const dropZone = document.getElementById("drop-zone")!;

function appendCollapseEvent() {
  const collapseBrackets = document.querySelectorAll(".bracket");

  collapseBrackets.forEach((bracket) => {
    bracket.addEventListener("click", () => {
      const isCollapsed =
        bracket.nextElementSibling!.classList.contains("collapsed");

      if (isCollapsed) {
        bracket.classList.remove("collapsed-content");
        bracket.nextElementSibling!.classList.remove("collapsed");
        return;
      }

      bracket.nextElementSibling!.classList.add("collapsed");
      bracket.classList.add("collapsed-content");
    });
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
    fileErrorHandler(
      "No files were dropped. Make sure you're dragging files and not other items."
    );
    return;
  }

  handleFiles(files);
});

async function handleFiles(files: FileList) {
  console.log(files);
  const [file] = files;

  if (!file) {
    fileErrorHandler("No files selected.");
    return;
  }

  if (!file.name.endsWith(".json")) {
    fileErrorHandler("The selected file is not an JSON.");
    return;
  }

  if (dropZone.classList.contains("error")) {
    cleanErrorMessage();
  }

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

  content.innerHTML = getJsonContainer(JSON.parse(jsonString));

  appendCollapseEvent();
}

function fileErrorHandler(tipMessage: string) {
  const tip = document.getElementById("tip")!;
  tip.classList.add("error");
  tip.innerText = tipMessage;
  dropZone.appendChild(tip);
  dropZone.classList.add("error");
}

function getDefaultTipMessage() {
  return "Simple JSON Viewer that runs completely on-client. No data exchange";
}

function cleanErrorMessage() {
  const tip = document.getElementById("tip")!;
  tip.classList.remove("error");
  tip.innerText = getDefaultTipMessage();
  dropZone.appendChild(tip);
  dropZone.classList.remove("error");
}
