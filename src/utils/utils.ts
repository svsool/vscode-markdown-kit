import vscode from 'vscode';
import path from 'path';
import fs from 'fs';

export const getWorkspaceFolder = (): string | undefined =>
  vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath;

export const ensureDirectoryExists = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
  }
};

export function getConfigProperty<T>(property: string, fallback: T): T {
  return vscode.workspace.getConfiguration().get(property, fallback);
}

export function getMarkdownKitConfigProperty<T>(property: string, fallback: T): T {
  return getConfigProperty<T>(`markdown-kit.${property}`, fallback);
}
