export function highlightJSON(value: any, depth = 0): string {
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

export function getJsonContainer(json: any) {
  return `<section class="json-container"><div class="json">${highlightJSON(
    json
  )}</div></section>`;
}
