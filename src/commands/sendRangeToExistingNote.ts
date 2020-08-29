import vscode, { Uri, window, workspace } from 'vscode';
import path from 'path';
import { sort as sortPaths } from 'cross-path-sort';

import { getMarkdownKitConfigProperty } from '../utils';

const createExistingNoteUrisQuickPick = async () => {
  const uris = sortPaths(await workspace.findFiles('**/*.md'), {
    pathKey: 'path',
    shallowFirst: false,
  });

  const quickPick = window.createQuickPick();

  quickPick.matchOnDescription = true;
  quickPick.matchOnDetail = true;

  quickPick.items = uris.map((uri) => {
    return {
      label: path.relative(workspace.getWorkspaceFolder(uri)!.uri.fsPath, uri.fsPath),
      detail: uri.fsPath,
    };
  });

  return quickPick;
};

const sendText = async (uri: vscode.Uri, text: string, shouldAppend: boolean) => {
  const doc = await workspace.openTextDocument(uri);
  const workspaceEdit = new vscode.WorkspaceEdit();
  workspaceEdit.set(uri, [
    shouldAppend
      ? vscode.TextEdit.insert(new vscode.Position(0, 0), text + '\n\n')
      : vscode.TextEdit.insert(new vscode.Position(doc.lineCount, 0), '\n' + text + '\n'),
  ]);

  await vscode.workspace.applyEdit(workspaceEdit);

  await doc.save();
};

const showFile = async (uri: vscode.Uri) =>
  await window.showTextDocument(await vscode.workspace.openTextDocument(uri));

const deleteRange = async (document: vscode.TextDocument, range: vscode.Range) => {
  const editor = await window.showTextDocument(document);
  await editor.edit((edit) => edit.delete(range));
};

const sendRangeToExistingNote = async (
  documentParam?: vscode.TextDocument,
  rangeParam?: vscode.Range,
) => {
  const document = documentParam ? documentParam : window.activeTextEditor?.document;

  if (!document || (document && document.languageId !== 'markdown')) {
    return;
  }

  const range = rangeParam ? rangeParam : window.activeTextEditor?.selection;

  if (!range || (range && range.isEmpty)) {
    return;
  }

  const quickPick = await createExistingNoteUrisQuickPick();

  quickPick.onDidChangeSelection(async (selection) => {
    const targetPath = selection[0].detail;

    const targetUri = Uri.file(targetPath || '');

    if (!targetPath) {
      return;
    }

    const position = getMarkdownKitConfigProperty('sendRangeToExistingNote.position', 'start');
    const removeRangeFromSource = getMarkdownKitConfigProperty(
      'sendRangeToExistingNote.removeRangeFromSource',
      true,
    );
    const showTarget = getMarkdownKitConfigProperty('sendRangeToExistingNote.showTarget', true);

    // Order matters
    await sendText(targetUri, document.getText(range).trim(), position === 'start');

    if (removeRangeFromSource) {
      await deleteRange(document, range);
    }

    if (showTarget) {
      await showFile(targetUri);
    }

    quickPick.hide();
  });

  quickPick.onDidHide(() => quickPick.dispose());

  quickPick.show();
};

export default sendRangeToExistingNote;
