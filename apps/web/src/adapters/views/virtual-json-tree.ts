export class VirtualJsonTree {
  private container: HTMLElement;
  private rowHeight: number;
  private allNodes: any[];
  private spacer: HTMLElement;
  private content: HTMLElement;

  constructor(container: HTMLElement, rowHeight = 24) {
    this.container = container;
    this.rowHeight = rowHeight;
    this.allNodes = [];

    // Create a "spacer" to give the scrollbar the correct height
    this.spacer = document.createElement("div");
    this.content = document.createElement("div");
    this.content.style.position = "absolute";
    this.content.style.top = "0";

    this.container.style.position = "relative";
    this.container.appendChild(this.spacer);
    this.container.appendChild(this.content);

    this.container.addEventListener("scroll", () => this.render());
  }

  addNodes(newNodes: any[]) {
    this.allNodes.push(...newNodes);
    this.updateSpacer();
    this.render();
  }

  updateSpacer() {
    this.spacer.style.height = `${this.allNodes.length * this.rowHeight}px`;
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.offsetHeight;

    const startIndex = Math.floor(scrollTop / this.rowHeight);
    const endIndex = Math.min(
      this.allNodes.length - 1,
      Math.ceil((scrollTop + viewportHeight) / this.rowHeight),
    );

    this.content.style.transform = `translateY(${startIndex * this.rowHeight}px)`;

    this.content.innerHTML = this.allNodes
      .slice(startIndex, endIndex + 1)
      .map((node) => this.generateRowTemplate(node))
      .join("");
  }

  generateRowTemplate(node: { value: string; type: string; depth: number }) {
    const indent = node.depth * 20;
    let contentHtml = "";

    switch (node.type) {
      case "bracket":
        contentHtml = `<span class="bracket">${node.value}</span>`;
        break;
      case "string":
        contentHtml = `<span class="json-key">"${node.value}"</span>: `;
        break;
      case "primitive":
        const primClass = isNaN(Number(node.value))
          ? "json-bool"
          : "json-number";
        contentHtml = `<span class="${primClass}">${node.value}</span>`;
        break;
    }

    return `
    <div class="tree-row" style="height: ${this.rowHeight}px; padding-left: ${indent}px">
      ${contentHtml}
    </div>
  `;
  }
}
