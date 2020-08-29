import * as vscode from 'vscode';

import commands from './commands';
import { codeActionProvider } from './features';

const mdLangSelector = { language: 'markdown', scheme: '*' };

export const activate = async (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(mdLangSelector, codeActionProvider),
    ...commands,
  );
};
