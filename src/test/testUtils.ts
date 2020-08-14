import fs from 'fs';
import path from 'path';
import { workspace, Uri, commands, ConfigurationTarget } from 'vscode';

import * as utils from '../utils';

export const createFile = async (
  filename: string,
  content: string = '',
): Promise<Uri | undefined> => {
  const workspaceFolder = utils.getWorkspaceFolder();

  if (!workspaceFolder) {
    return;
  }

  const filepath = path.join(workspaceFolder, ...filename.split('/'));
  const dirname = path.dirname(filepath);

  utils.ensureDirectoryExists(filepath);

  if (!fs.existsSync(dirname)) {
    throw new Error(`Directory ${dirname} does not exist`);
  }

  fs.writeFileSync(filepath, content);

  return Uri.file(path.join(workspaceFolder, ...filename.split('/')));
};

export const removeFile = (filename: string) =>
  fs.unlinkSync(path.join(utils.getWorkspaceFolder()!, ...filename.split('/')));

export const rndName = (): string => {
  const name = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);

  return name.length !== 5 ? rndName() : name;
};

export const openTextDocument = (filename: string) => {
  const filePath = path.join(utils.getWorkspaceFolder()!, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist`);
  }

  return workspace.openTextDocument(filePath);
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const closeAllEditors = async () => {
  await commands.executeCommand('workbench.action.closeAllEditors');
  await delay(100);
};

export const updateConfigProperty = async (property: string, value: unknown) => {
  await workspace.getConfiguration().update(property, value, ConfigurationTarget.Workspace);
};

export const closeEditorsAndCleanWorkspace = async () => {
  await closeAllEditors();
};

export const toPlainObject = <R>(value: unknown): R =>
  value !== undefined ? JSON.parse(JSON.stringify(value)) : value;
