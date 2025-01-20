export function fileErrorTemplate(tipMessage: string) {
  const tip = document.getElementById("tip")!;
  const dropZone = document.getElementById("drop-zone")!;
  tip.classList.add("error");
  tip.innerText = tipMessage;
  dropZone.appendChild(tip);
  dropZone.classList.add("error");
}
