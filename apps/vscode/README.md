# Formatter Lab - VS Code Extension

Formatter Lab is a Visual Studio Code extension that allows you to load, format, and display JSON files in a structured and visually appealing way. This extension leverages webviews to render the formatted JSON in a dedicated editor panel, with syntax highlighting and theme-aware colors for a seamless developer experience.

## Features

- Open JSON Files: Easily select and open JSON files from your system.
- Formatted Display: Visualize JSON data in a clean, formatted structure.
- Theme Support: Automatically adapts to your VS Code theme (light or dark).
- Interactive Interface: Rendered JSON is styled with collapsible brackets and syntax highlighting.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar or pressing `Ctrl+Shift+X`.
3. Search for "Formatter Lab."
4. Click Install.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Search for Formatter Lab: Show Formatted JSON and select the command.
3. Select a JSON file from your system using the file picker.
4. The JSON data will be displayed in a formatted, color-coded webview.

## Commands

| Command Name                      | Description                                         |
| --------------------------------- | --------------------------------------------------- |
| `formatter-lab.showFormattedJson` | Opens a file picker to load and format a JSON file. |

## JSON Styling

The JSON content is styled with the following features:

- **Key Color:** Matches your theme’s color palette.
- **Value Color:** Ensures readable distinction for values.
- **Bracket Collapsibility:** Clickable brackets for better navigation in nested JSON structures.

## Extension API

### Activate

The `activate` function is called when the extension is initialized. It registers the `formatter-lab.showFormattedJson` command.

### Deactivate

The `deactivate` function is called when the extension is unloaded.

## Development

To build or extend this extension:

1. Clone this repository.
2. Run yarn install to install dependencies.
3. Open the project in VS Code.
4. Use F5 to launch an Extension Development Host to test your changes.

## Feedback and Contributions

Feel free to submit bug reports, feature requests, or contribute to the extension on its GitHub repository.
