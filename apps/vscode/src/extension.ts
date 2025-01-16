import * as vscode from "vscode";
import * as fs from "fs/promises";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "formatter-lab" is now active!');

  const disposable = vscode.commands.registerCommand(
    "formatter-lab.showFormattedJson",
    async () => {
      const fileUri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: "Select JSON File",
        filters: {
          "JSON Files": ["json"],
          "All Files": ["*"],
        },
      });

      if (!fileUri || fileUri.length === 0) {
        vscode.window.showInformationMessage("No file selected.");
        return;
      }

      try {
        const filePath = fileUri[0].fsPath;
        const fileContent = await fs.readFile(filePath, "utf-8");

        const json = JSON.parse(fileContent);

        vscode.window.showInformationMessage("JSON file loaded successfully!");

        const formattedJson = getJsonContainer(json);
        const panel = vscode.window.createWebviewPanel(
          "formattedJson",
          "Formatted JSON",
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            retainContextWhenHidden: true,
          }
        );

        panel.webview.html = getWebViewContent(formattedJson);
      } catch (error) {
        vscode.window.showErrorMessage("Failed to load or parse JSON file.");
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebViewContent(formattedJson: string): string {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FormatterLab</title>
            <style>
                :root {
                  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                  line-height: 1.5;
                  font-weight: 400;

                  color: rgba(255, 255, 255, 0.87);
                  background-color: #242424;

                  font-synthesis: none;
                  text-rendering: optimizeLegibility;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }

                * {
                  box-sizing: border-box;
                  margin: 0;
                }

                a {
                  font-weight: 500;
                  color: #646cff;
                  text-decoration: inherit;
                }

                a:hover {
                  color: #535bf2;
                }

                body {
                  min-width: 320px;
                  min-height: 100vh;
                }

                h1 {
                  font-size: 3.2em;
                  line-height: 1.1;
                }

                .content {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-direction: column;
                  gap: 16px;
                  height: 100vh;
                }

                .collapsed {
                  display: none;
                }

                .collapsed-content::after {
                  content: "...";
                  padding: 0 0 0 4px;
                  color: #cb4b16;
                }

                .key {
                  color: #002b36;
                }

                .value {
                  color: #cb4b16;
                }

                .index {
                  color: #6c71c4;
                }

                .bracket {
                  color: #002b36;
                  font-weight: bold;
                }

                .json {
                  height: 100vh;
                  width: 100%;
                  padding: 16px 32px;
                }

                .json .json-itens {
                  display: block;
                  margin-left: 20px;
                }

                .json .bracket {
                  cursor: pointer;
                }

                .json-container {
                  width: 100%;
                }
            </style>
        </head>
        <body>
          <main class="content" id="content">
            <h1>JSON Tree Viewer</h1>
            ${formattedJson}
          </main>
        </body>
        </html>
    `;
}

function highlightJSON(value: any, depth = 0): string {
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

function getJsonContainer(json: any) {
  return `<section class="json-container"><div class="json">${highlightJSON(
    json
  )}</div></section>`;
}
