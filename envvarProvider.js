const   vscode = require('vscode');
        path = require('path'),
        fs = require('fs'),
        { EOL } = require('os');

const findProjectDir = (fileName) => {
    const dir = path.dirname(fileName);

    if (fs.existsSync(dir + '/package.json')) {
        return dir;
    } else {
        return dir === '/' ? null : findProjectDir(dir);
    }
}

const isDotenvInDeps = (projectDir) => {
    const { dependencies, devDependencies } = require(`${projectDir}/package.json`);
    return dependencies && (dependencies.dotenv || dependencies.next) || devDependencies && devDependencies.dotenv;
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
        let envvars = Object.entries(process.env);

        if (projectDir && isDotenvInDeps(projectDir)) {
            const fileContent = fs.readFileSync(`${projectDir}/.env`, { encoding: 'utf8' });
            fileContent
                .split(EOL)
                // filter out comments
                .filter(line => !line.trim().startsWith('#'))
                .forEach(envvarLitteral => envvars.push(envvarLitteral.split('=')));
        }
        
        return envvars.map(envvar => {
            const completion = new vscode.CompletionItem(envvar[0].trim(), vscode.CompletionItemKind.Variable);
            completion.documentation = envvar[1].trim();

            return completion;
        });
    }
}

module.exports = provider;
