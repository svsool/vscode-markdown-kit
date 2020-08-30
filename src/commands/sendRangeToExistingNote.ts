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
  const position = new vscode.Position(shouldAppend || doc.lineCount === 0 ? 0 : doc.lineCount, 0);
  const hasOneEmptyLine = doc.lineCount === 1 && doc.lineAt(0).text.trim() === '';
  const lastLineHasContent = doc.lineAt(doc.lineCount - 1).text.trim() !== '';
  const maybeLeadingNewLine = !shouldAppend || (!shouldAppend && lastLineHasContent) ? '\n' : '';
  const maybeTrailingNewLine =
    (shouldAppend && !hasOneEmptyLine) || doc.lineCount === 0 || !shouldAppend ? '\n' : '';
  const maybePushLine = shouldAppend || (!shouldAppend && lastLineHasContent) ? '\n' : '';
  const content = maybePushLine + maybeLeadingNewLine + text + maybeTrailingNewLine;
  workspaceEdit.set(uri, [vscode.TextEdit.insert(position, content)]);

  await vscode.workspace.applyEdit(workspaceEdit);

  const insertPos =
    shouldAppend || doc.lineCount === 0
      ? doc.positionAt(text.length)
      : doc.positionAt(doc.offsetAt(new vscode.Position(doc.lineCount, 0)) + ('\n' + text).length);

  await doc.save();

  return insertPos;
};

const updateSelection = (editor: vscode.TextEditor, pos: vscode.Position) => {
  editor.selection = new vscode.Selection(pos.line, pos.character, pos.line, pos.character);
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
    const insertPos = await sendText(
      targetUri,
      document.getText(range).trim(),
      position === 'start',
    );

    if (removeRangeFromSource) {
      await deleteRange(document, range);
    }

    if (showTarget) {
      const editor = await showFile(targetUri);

      updateSelection(editor, insertPos);
    } else {
      vscode.window.showInformationMessage(
        `Range successfully sent to "${path.basename(targetUri.fsPath)}".`,
      );
    }

    quickPick.hide();
  });

  quickPick.onDidHide(() => quickPick.dispose());

  quickPick.show();
};

export default sendRangeToExistingNote;
