export function collapseEvent(bracket: Element) {
  const isCollapsed =
    bracket.nextElementSibling!.classList.contains("collapsed");

  if (isCollapsed) {
    bracket.classList.remove("collapsed-content");
    bracket.nextElementSibling!.classList.remove("collapsed");
    return;
  }

  bracket.nextElementSibling!.classList.add("collapsed");
  bracket.classList.add("collapsed-content");
}
