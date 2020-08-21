import * as vscode from 'vscode';

const MARKDOWN_KIT_EXTENSION_ID = 'svsool.markdown-kit';

describe('extension', () => {
  it('should find extension in extensions list', () => {
    expect(
      vscode.extensions.all.some((extension) => extension.id === MARKDOWN_KIT_EXTENSION_ID),
    ).toBe(true);
  });

  it('should not find not existing extension', () => {
    expect(
      vscode.extensions.all.some((extension) => {
        return extension.id === 'svsool.any-extension';
      }),
    ).toBe(false);
  });
});
