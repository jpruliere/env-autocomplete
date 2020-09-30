const vscode = require('vscode');

const path = require('path'),
      fs = require('fs'),
      { EOL } = require('os');

const findProjectDir = (fileName) => {
    const dir = path.dirname(fileName);

    if (fs.existsSync(dir + '/package.json')) {
        return dir;
    } else {
        if (dir === '/') {
            return null;
        }
        return findProjectDir(dir);
    }
}

const provider = {
    provideCompletionItems(document, position) {
        console.debug('started providing');

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('process.env.')) {
            return undefined;
        }

        console.log('we are there');

        const projectDir = findProjectDir(document.fileName);

        const package = require(`${projectDir}/package.json`);

        const dotenvIsThere = package.dependencies.dotenv || package.devDependencies.dotenv;

        const additionals = [];
        if (dotenvIsThere) {
            const fileContent = fs.readFileSync(`${projectDir}/.env`, { encoding: 'utf8' });
            fileContent.split(EOL).forEach(envvarLitteral => additionals.push(envvarLitteral.split('=')));
        }

        const envvars = [...additionals, ...Object.entries(process.env)];
        
        const completions = envvars.map(envvar => {
            const completion = new vscode.CompletionItem(envvar[0], vscode.CompletionItemKind.Variable);
            completion.documentation = envvar[1];

            return completion;
        });

        return completions;
    }
}

module.exports = provider;