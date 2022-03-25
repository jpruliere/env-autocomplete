const   vscode = require('vscode'),
        path = require('path'),
        fs = require('fs'),
        { EOL } = require('os'),
        { glob } = require('glob');

const findProjectDir = (fileName) => {
    const dir = path.dirname(fileName);

    if (fs.existsSync(dir + '/package.json')) {
        return dir;
    } else {
        return dir === '/' ? null : findProjectDir(dir);
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
                    .filter(line => !line.trim().startsWith('#') && line.trim().length > 0)
                    .forEach(envvarLitteral => envvars.push(envvarLitteral.split('=')));
            });
        }
        
        return envvars.map(envvar => {
            const completion = new vscode.CompletionItem(envvar[0].trim(), vscode.CompletionItemKind.Variable);
            completion.documentation = envvar[1].trim();

            return completion;
        });
    }
}

module.exports = provider;
