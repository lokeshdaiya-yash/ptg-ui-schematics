import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import * as path from 'path';
import { dirSync } from 'tmp';

function createSandbox() {
  console.log(`Creating a sandbox...`);
  const tmpDir = dirSync().name;
  console.log(`tempDir`, tmpDir);

  writeFileSync(
    path.join(tmpDir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@angular/cli': '~12.2.9',
        '@nrwl/angular': '^12.9.0',
        '@nrwl/workspace': '^12.0.0',
        typescript: '^4.4.3',
      },
      license: 'MIT',
    })
  );

  execSync(`npm install --silent`, {
    cwd: tmpDir,
    stdio: [0, 1, 2],
  });

  execSync(`npm link @ptg-ui/angular-schematics --silent`, {
    cwd: tmpDir,
    stdio: [0, 1, 2],
  });

  return tmpDir;
}

function createApp(tmpDir: string) {
  console.log('Inside createApp Angular');
  const collection = `${tmpDir}/node_modules/@ptg-ui/angular-schematics/src/collection.json`;
  console.log('collectionTest..', collection);

  // const command = `${tmpDir}/node_modules/.bin/ng new --collection=${collection} --strict false`;
  const command = `${tmpDir}/node_modules/.bin/ng new --collection=${collection} --strict false`;
  console.log(command);
  console.log('current directory', process.cwd());

  execSync(`${command}`, {
    stdio: [0, 1, 2],
    cwd: process.cwd(),
  });
  console.log('createApp Function Completed');
}

function addVSCodeExtensions() {
  const extensionsList = [
    'simontest.simontest',
    'nrwl.angular-console',
    'tabnine.tabnine-vscode',
    'mrmlnc.vscode-scss',
    'esbenp.prettier-vscode',
    'ms-vscode.vscode-typescript-tslint-plugin',
    'vscode-icons-team.vscode-icons',
    'Angular.ng-template',
  ];
  const extensions = extensionsList
    .map((ext) => `--install-extension ${ext}`)
    .join(' ');
  execSync(`code ${extensions}`, {
    // stdio: [0, 1, 2],
    cwd: process.cwd(),
  });
}

export function invokeAngularGenerator() {
  const temp = createSandbox();
  createApp(temp);
  addVSCodeExtensions();
}
