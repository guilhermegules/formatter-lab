const filePicker = document.getElementById("file-picker");
const content = document.getElementById("content");

function highlightJSON(value, depth = 0) {
  const indent = "&nbsp;".repeat(depth * 4); // Create indentation with 4 spaces
  const newLine = "<br/>";
  if (Array.isArray(value)) {
    const itens = value
      .map((item, index) => `${index}: ${highlightJSON(item, depth + 1)}`)
      .join(`,${newLine}`);
    return `<span class="bracket">[</span>${newLine}${indent}${itens}${indent}${newLine}<span class="bracket">]</span><br/>`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(
        ([key, item]) =>
          `${indent}&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">"${key}"</span>: ${highlightJSON(
            item,
            depth + 1
          )}`
      )
      .join(`,${newLine}`);
    return `&nbsp;${newLine}${entries}${newLine}${indent}`;
  }

  if (value === null) {
    return `<span class="value">null</span>`;
  }

  if (value === "") {
    return `<span class="value">""</span>`;
  }

  return `<span class="value">${value}</span>`;
}

filePicker.addEventListener("change", (e) => {
  const [file] = e.target.files;

  if (file) {
    const reader = new FileReader();

    // Quando o arquivo for lido
    reader.onload = (readerEvent) => {
      try {
        const jsonData = JSON.parse(readerEvent.target.result); // Converte o conteúdo para um objeto JSON
        console.log("Conteúdo do JSON:", jsonData);
        content.innerHTML = `<div>${highlightJSON(jsonData)}</div>`;
      } catch (error) {
        console.error("Erro ao ler o arquivo JSON:", error);
      }
    };

    reader.readAsText(file);
  } else {
    console.log("Nenhum arquivo selecionado.");
  }
});
