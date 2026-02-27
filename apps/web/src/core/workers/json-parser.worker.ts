let stack: string[] = [];
let nodeId = 0;
let buffer = "";
let batch: object[] = [];

self.onmessage = (e) => {
  if (e.data.type === "process") {
    buffer += e.data.chunk;
    processBuffer();
  }

  if (e.data.type === "end") {
    buffer = "";
    stack = [];
    nodeId = 0;
    batch = [];
    console.log("Parsing complete");
  }
};

function processBuffer() {
  const tokenRegex =
    /({|}|\[|\]|"(?:\\.|[^"\\])*"|[: ,]|\d+(?:\.\d+)?|true|false|null)/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = tokenRegex.exec(buffer)) !== null) {
    const token = match[0];

    if (token === "{" || token === "[") {
      stack.push(token);
      emit("bracket", token);
    } else if (token === "}" || token === "]") {
      emit("bracket", token);
      stack.pop();
    } else if (token.startsWith('"')) {
      const cleanStr = token.slice(1, -1);
      emit("string", cleanStr);
    } else if (
      ["true", "false", "null"].includes(token) ||
      !isNaN(parseFloat(token))
    ) {
      emit("primitive", token);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  // Keep the unprocessed tail for the next chunk
  buffer = buffer.slice(lastIndex);
}

function emit(type: string, value: string) {
  batch.push({
    id: nodeId++,
    type,
    value,
    depth: stack.length,
  });

  self.postMessage({ type: "nodes", nodes: batch });
  batch = [];
}
