import fs from 'fs';
import path from 'path';

import { closeEditorsAndCleanWorkspace } from '../test/testUtils';
import { getWorkspaceFolder, ensureDirectoryExists } from './utils';

describe('getWorkspaceFolder()', () => {
  it('should return workspace folder', () => {
    expect(getWorkspaceFolder()).not.toBeUndefined();
  });
});

describe('ensureDirectoryExists()', () => {
  beforeEach(closeEditorsAndCleanWorkspace);

  afterEach(closeEditorsAndCleanWorkspace);

  it('should create all necessary directories', () => {
    const dirPath = path.join(getWorkspaceFolder()!, 'folder1', 'folder2');
    expect(fs.existsSync(dirPath)).toBe(false);
    ensureDirectoryExists(path.join(dirPath, 'file.md'));
    expect(fs.existsSync(dirPath)).toBe(true);
  });
});
