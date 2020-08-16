import { CodeActionProvider } from 'vscode';

const extractRangeToNewNoteProvider: CodeActionProvider = {
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
    ];
  },
};

export default extractRangeToNewNoteProvider;
