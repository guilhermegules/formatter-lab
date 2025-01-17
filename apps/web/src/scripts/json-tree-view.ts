import { getJsonContainer } from "@repo/json-utils";

const filePicker = document.getElementById("file-picker");
const content = document.getElementById("content");

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

filePicker!.addEventListener("change", async (e) => {
  const [file] = (e.target as HTMLInputElement).files!;

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

  content!.innerHTML = getJsonContainer(JSON.parse(jsonString));

  appendCollapseEvent();
});
