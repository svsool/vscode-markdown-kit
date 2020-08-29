import vscode from 'vscode';

import pasteHtmlAsMarkdown from './pasteHtmlAsMarkdown';
import extractRangeToNewNote from './extractRangeToNewNote';
import sendRangeToExistingNote from './sendRangeToExistingNote';

const commands = [
  vscode.commands.registerCommand('markdown-kit.pasteHtmlAsMarkdown', pasteHtmlAsMarkdown),
  vscode.commands.registerCommand('markdown-kit.extractRangeToNewNote', extractRangeToNewNote),
  vscode.commands.registerCommand('markdown-kit.sendRangeToExistingNote', sendRangeToExistingNote),
];

export default commands;
