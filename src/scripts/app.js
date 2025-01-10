const filePicker = document.getElementById("file-picker");
const content = document.getElementById("content");

function highlightJSON(value, depth = 0) {
  const indent = "&nbsp;".repeat(depth * 4);
  const newLine = "<br/>";

  if (Array.isArray(value)) {
    const itens = value
      .map(
        (item, index) =>
          `${indent}&nbsp;&nbsp;&nbsp;<span class="index">${index}</span>: ${highlightJSON(
            item,
            depth + 1
          )}`
      )
      .join(`${newLine}`);
    return `<span class="bracket">[</span><span class="json-itens">${newLine}${itens}${newLine}${indent}</span><span class="bracket">]</span>`;
  }

  if (value && typeof value === "object") {
    const objectWithInnerObject = (item) =>
      `<span class="bracket">{</span> ${highlightJSON(
        item,
        depth + 1
      )}<span class="bracket">}</span>,`;

    const showValue = (item) =>
      typeof item === "object" && !Array.isArray(item)
        ? objectWithInnerObject(item)
        : highlightJSON(item, depth + 1);

    const entries = Object.entries(value)
      .map(
        ([key, item]) =>
          `<span class="json-itens">
            ${indent}&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">"${key}"</span>:${showValue(
            item
          )} 
          </span>`
      )
      .join(`${newLine}`);
    return `<span class="json-itens">${newLine}${entries}${newLine}${indent}</span>`;
  }

  if (value === null) {
    return `<span class="value">null</span>`;
  }

  if (value === "") {
    return `<span class="value">""</span>`;
  }

  if (typeof value === "number") {
    return `<span class="value">${value}</span>`;
  }

  return `<span class="value">"${value}"</span>`;
}

filePicker.addEventListener("change", (e) => {
  const [file] = e.target.files;

  if (file) {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      try {
        const jsonData = JSON.parse(readerEvent.target.result);
        content.innerHTML = `<section><div class="json">${highlightJSON(
          jsonData
        )}</div></section>`;

        const collapseBrackets = document.querySelectorAll(".bracket");

        collapseBrackets.forEach((bracket) => {
          bracket.addEventListener("click", (event) => {
            const isCollapsed =
              bracket.nextElementSibling.classList.contains("collapsed");

            if (isCollapsed) {
              bracket.classList.remove("collapsed-content");
              bracket.nextElementSibling.classList.remove("collapsed");
            } else {
              bracket.nextElementSibling.classList.add("collapsed");
              bracket.classList.add("collapsed-content");
            }
          });
        });
      } catch (error) {
        console.error("Erro ao ler o arquivo JSON:", error);
      }
    };

    reader.readAsText(file);
  } else {
    console.log("Nenhum arquivo selecionado.");
  }
});
