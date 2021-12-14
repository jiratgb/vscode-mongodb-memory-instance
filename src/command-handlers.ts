import type { MongoInstanceManager } from './mongodb-instance-manager';
import type { StatusBarItem } from './status-bar-item';
import * as vscode from 'vscode';

export class CommandHandler implements vscode.Disposable {
  private readonly statusBarItem: StatusBarItem;
  private readonly instanceManager: MongoInstanceManager;
  private commands: vscode.Disposable[] = [];

  constructor(statusBarItem: StatusBarItem, instanceManager: MongoInstanceManager) {
    this.statusBarItem = statusBarItem;
    this.instanceManager = instanceManager;

    this.commands.push(
      vscode.commands.registerCommand('vscode-mongodb-memory-instance.start', () => this.handleStartCommand()),
      vscode.commands.registerCommand('vscode-mongodb-memory-instance.stop', () => this.handleStopCommand()),
    );
  }

  async showStartProgress() {
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Starting the database',
      cancellable: true,
    }, async (progress, token) => {
      token.onCancellationRequested(async () => {
        await this.instanceManager.stopAndCleanupInstance();
      });
      await this.instanceManager.startInstance();
      return Promise.resolve();
    });
  }

  async handleStartCommand() {
    if (this.instanceManager.isInstanceRunning()) {
      vscode.window.showErrorMessage('Server is still running');
    }

    // Get port number
    const port = await vscode.window.showInputBox({ title: 'Port', prompt: 'Please enter the port number (required)', value: '27017' });
    if (port === undefined) {
      return;
    }

    // Get DB name
    const dbName = await vscode.window.showInputBox({ title: 'Database name', prompt: 'Please enter the database name', });

    if (this.instanceManager.isInstanceInitialized()) {
      await this.instanceManager.stopAndCleanupInstance();
    }
    this.instanceManager.initializeInstance(Number.parseInt(port, 10), dbName);

    await this.showStartProgress();

    const dbUri = this.instanceManager.getUri();
    if (dbUri) {
      vscode.window.showInformationMessage(`Running MongoDB at ${dbUri}`);
      this.statusBarItem.instanceStart(dbUri);
    } else {
      vscode.window.showErrorMessage('Cannot start MongoDB');
    }
  }

  async handleStopCommand() {
    await this.instanceManager.stopAndCleanupInstance();
    vscode.window.showInformationMessage('Server is stopped');
    this.statusBarItem.instanceStop();
  }

  dispose() {
    this.commands.forEach((command) => {
      try {
        command.dispose();
      } catch (_) { }
    });
    this.commands = [];
  }
}
