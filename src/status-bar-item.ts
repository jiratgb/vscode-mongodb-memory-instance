import * as vscode from 'vscode';

export class StatusBarItem implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    this.statusBarItem.text = 'MongoDB Memory: Stopped';
    this.statusBarItem.command = 'vscode-mongodb-memory-instance.start';
    this.statusBarItem.tooltip = 'Start MongoDB memory server';
    this.statusBarItem.show();
  }

  instanceStop() {
    this.statusBarItem.text = 'MongoDB Memory: Stopped';
    this.statusBarItem.command = 'vscode-mongodb-memory-instance.start';
    this.statusBarItem.tooltip = 'Start MongoDB memory server';
  }

  instanceStart(uri: string) {
    this.statusBarItem.text = `MongoDB Memory: Running at ${uri}`;
    this.statusBarItem.command = 'vscode-mongodb-memory-instance.stop';
    this.statusBarItem.tooltip = 'Stop MongoDB memory server';
  }

  dispose() {
    this.statusBarItem.dispose();
  }
}