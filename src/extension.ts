// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommandHandler } from './command-handlers';
import { MongoInstanceManager } from './mongodb-instance-manager';
import { StatusBarItem } from './status-bar-item';

let instanceManager: MongoInstanceManager;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const statusBarItem = new StatusBarItem();

	const instanceManager = new MongoInstanceManager();

	const commandHandler = new CommandHandler(statusBarItem, instanceManager);

	context.subscriptions.push(
		statusBarItem,
		commandHandler,
	);
}

// this method is called when your extension is deactivated
export async function deactivate() {
	await instanceManager.stopAndCleanupInstance();
}
