import * as vscode from 'vscode';

import commands from './commands';

export const activate = async (context: vscode.ExtensionContext) => {
  context.subscriptions.push(...commands);
};
