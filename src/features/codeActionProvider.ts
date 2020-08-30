import { CodeActionProvider } from 'vscode';

const codeActionProvider: CodeActionProvider = {
  provideCodeActions(document, range) {
    if (range.isEmpty) {
      return [];
    }

    return [
      {
        title: 'Extract range to a new note',
        command: 'markdown-kit.extractRangeToNewNote',
        arguments: [document, range],
      },
      {
        title: 'Send range to an existing note',
        command: 'markdown-kit.sendRangeToExistingNote',
        arguments: [document, range],
      },
    ];
  },
};

export default codeActionProvider;
