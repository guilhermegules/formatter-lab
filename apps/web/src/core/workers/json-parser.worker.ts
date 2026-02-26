let stack: string[] = [];
let nodeId = 0;
let buffer = "";

self.onmessage = (e) => {
  if (e.data.type === "chunk") {
    buffer += e.data.chunk;
    processBuffer();
  }

  if (e.data.type === "end") {
    processBuffer(true);
  }
};

function processBuffer(final = false) {
  let i = 0;

  while (i < buffer.length) {
    const char = buffer[i];

    if (char === "{") {
      emitNode("objectStart");
      stack.push("object");
    } else if (char === "[") {
      emitNode("arrayStart");
      stack.push("array");
    } else if (char === "}") {
      emitNode("objectEnd");
      stack.pop();
    } else if (char === "]") {
      emitNode("arrayEnd");
      stack.pop();
    }

    i++;
  }

  buffer = final ? "" : buffer.slice(i);
}

function emitNode(type: string) {
  postMessage({
    type: "node",
    node: {
      id: nodeId++,
      type,
      depth: stack.length,
    },
  });
}
