import * as vscode from 'vscode';

import commands from './commands';
import { extractRangeToNewNoteProvider } from './features';

const mdLangSelector = { language: 'markdown', scheme: '*' };

export const activate = async (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(mdLangSelector, extractRangeToNewNoteProvider),
    ...commands,
  );
};
