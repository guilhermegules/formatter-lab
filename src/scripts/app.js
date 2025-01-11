const filePicker = document.getElementById("file-picker");
const content = document.getElementById("content");

function highlightJSON(value, depth = 0) {
  const indentClass = `depth-${depth}`;

  if (Array.isArray(value)) {
    const items = value
      .map(
        (item, index) =>
          `<div class="json-itens ${indentClass}">
            <span class="index">${index}:</span> ${highlightJSON(
            item,
            depth + 1
          )}
          </div>`
      )
      .join("");

    return `
      <span class="bracket">[</span>
      <div class="${indentClass} json-content">${items}</div>
      <span class="bracket">]</span>`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(
        ([key, item]) =>
          `<div class="json-itens ${indentClass}">
            <span class="key">"${key}"</span>: ${highlightJSON(item, depth + 1)}
          </div>`
      )
      .join("");

    return `
      <span class="bracket">{</span>
      <div class="${indentClass} json-content">${entries}</div>
      <span class="bracket">}</span>`;
  }

  if (value === null) {
    return `<span class="value">null</span>`;
  }

  if (typeof value === "number") {
    return `<span class="value">${value}</span>`;
  }

  if (typeof value === "string") {
    return `<span class="value">"${value}"</span>`;
  }

  return `<span class="value">${value}</span>`;
}

function appendCollapseEvent() {
  const collapseBrackets = document.querySelectorAll(".bracket");

  collapseBrackets.forEach((bracket) => {
    bracket.addEventListener("click", () => {
      const isCollapsed =
        bracket.nextElementSibling.classList.contains("collapsed");

      if (isCollapsed) {
        bracket.classList.remove("collapsed-content");
        bracket.nextElementSibling.classList.remove("collapsed");
        return;
      }

      bracket.nextElementSibling.classList.add("collapsed");
      bracket.classList.add("collapsed-content");
    });
  });
}

filePicker.addEventListener("change", async (e) => {
  const [file] = e.target.files;

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

  content.innerHTML = `<section class="json-container"><div class="json">${highlightJSON(
    JSON.parse(jsonString)
  )}</div></section>`;

  appendCollapseEvent();
});
