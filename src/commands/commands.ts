import vscode from 'vscode';

import pasteHtmlAsMarkdown from './pasteHtmlAsMarkdown';
import extractRangeToNewNote from './extractRangeToNewNote';

const commands = [
  vscode.commands.registerCommand('markdown-kit.pasteHtmlAsMarkdown', pasteHtmlAsMarkdown),
  vscode.commands.registerCommand('markdown-kit.extractRangeToNewNote', extractRangeToNewNote),
];

export default commands;
