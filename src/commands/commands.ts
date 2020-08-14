import vscode from 'vscode';

import pasteHtmlAsMarkdown from './pasteHtmlAsMarkdown';

const commands = [
  vscode.commands.registerCommand('markdown-kit.pasteHtmlAsMarkdown', pasteHtmlAsMarkdown),
];

export default commands;
