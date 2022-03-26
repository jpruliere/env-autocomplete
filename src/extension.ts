// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import envvarProvider from './envvarProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('"env-autocomplete" is active!');

	const javascriptProviderDisposable = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascript'}, envvarProvider, '.');
	const typescriptProviderDisposable = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'typescript'}, envvarProvider, '.');
	const javascriptreactProviderDisposable = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascriptreact'}, envvarProvider, '.');
	const typescriptreactProviderDisposable = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'typescriptreact'}, envvarProvider, '.');


	context.subscriptions.push(javascriptProviderDisposable, typescriptProviderDisposable, javascriptreactProviderDisposable, typescriptreactProviderDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}