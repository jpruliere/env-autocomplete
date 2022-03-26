import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { EOL } from 'os';
import { glob } from 'glob';

const findProjectDir = (fileName: string): string | null => {
    const dir = path.dirname(fileName);

    if (fs.existsSync(dir + '/package.json')) {
        return dir;
    } else {
        return dir === '/' ? null : findProjectDir(dir);
    }
}

const provider = {
    provideCompletionItems: (document: vscode.TextDocument, position: vscode.Position) => {
        console.debug('started providing');

        const linePrefix = document.lineAt(position).text.slice(0, position.character);
        if (!linePrefix.endsWith('process.env.')) {
            return undefined;
        }

        console.log('we are there');

        const projectDir = findProjectDir(document.fileName);
        let envvars = Object.entries(process.env);

        if (projectDir) {
            const files = glob.sync(`${projectDir}/.env.*`);
            files.push(`${projectDir}/.env`);

            files.forEach(file => {
                let fileContent;
                try {
                    fileContent = fs.readFileSync(file, { encoding: 'utf8' });
                } catch (err) {
                    // this is usually because the file doesn't exist,
                    // which is often the case with the hardcoded .env file
                    return; // out of forEach callback
                }
                fileContent
                    .split(EOL)
                    // filter out comments
                    .filter(line => !line.trim().startsWith('#'))
                    .forEach(envvarLitteral => {
                        const splitted = envvarLitteral.split('=');
                        if (splitted.length > 1) {
                            envvars.push([splitted[0], splitted[1]]);
                        }
                    });
            });
        }
        
        return envvars.map(envvar => {
            const completion = new vscode.CompletionItem(envvar[0].trim(), vscode.CompletionItemKind.Variable);
            completion.documentation = envvar[1]?.trim();

            return completion;
        });
    }
}

export default provider;
