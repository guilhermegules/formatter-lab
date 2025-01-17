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
    console.log(
      "No files were dropped. Make sure you're dragging files and not other items."
    );
    return;
  }

  handleFiles(files);
});

async function handleFiles(files: FileList) {
  const [file] = files;

  if (!file) {
    console.log("Nenhum arquivo selecionado.");
    return;
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
