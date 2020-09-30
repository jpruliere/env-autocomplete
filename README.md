# env-autocomplete

This extension provides auto-completion to any `process.env` mentions inside a JS file. It is _dotenv aware_, which means it will add any environment variables you declared in a `.env` file at the root of your project.

## Features

**Project manifest detection** : looks for a `package.json` in current or any parent directory and parses it, looking for [dotenv](https://www.npmjs.com/package/dotenv) in your dependencies.

**.env parsing** : parses your favorite flat file to add any variable you wrote there

**Minimal OS dependency** : uses VSCode own Node environment to access environment variables, ensuring maximal compatibility.

## Requirements

Any version of VSCode should do the trick. Let me know if anything goes south while using this extension.

## Release Notes

### 1.0.0

First try, _works fine on my computer_ :rofl: