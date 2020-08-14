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
