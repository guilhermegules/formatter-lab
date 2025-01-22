import * as vscode from "vscode";
import * as fs from "fs/promises";
import { getJsonContainer } from "@repo/json-utils";

export function activate(context: vscode.ExtensionContext) {
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

function getColors() {
  const isLightTheme = vscode.window.activeColorTheme.kind
    .toString()
    .includes("light");

  return {
    keyColor: isLightTheme ? "#1c1c1c" : "#56b6c2",
    valueColor: isLightTheme ? "#007acc" : "#d19a66",
    indexColor: isLightTheme ? "#005f5f" : "#c678dd",
    bracketColor: isLightTheme ? "#000000" : "#e06c75",
    backgroundColor: isLightTheme ? "#fafafa" : "#1e1e1e",
  };
}

function getWebViewContent(formattedJson: string): string {
  const colors = getColors();
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Formatter Lab</title>
            <style>
                :root {
                  --key-color: ${colors.keyColor};
                  --value-color: ${colors.valueColor};
                  --index-color: ${colors.indexColor};
                  --bracket-color: ${colors.bracketColor};
                  --background-color: ${colors.backgroundColor};
                }

                * {
                  box-sizing: border-box;
                  margin: 0;
                }

                body { 
                  background-color: var(--background-color);
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
                  color: var(--value-color);
                }

                .key {
                  color: var(--key-color);;
                }

                .value {
                  color: var(--value-color);;
                }

                .index {
                  color: var(--index-color);
                }

                .bracket {
                  color: var(--bracket-color);
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
            ${formattedJson}
          </main>
        </body>
        </html>
    `;
}
