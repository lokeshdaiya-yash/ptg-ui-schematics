import { execSync } from 'child_process';
import { writeFileSync,existsSync,readdirSync,lstatSync,unlinkSync,rmdirSync } from 'fs';
import * as path from 'path';
import { dirSync } from 'tmp';
import * as inquirer from "inquirer";



async function createSandbox() {
  console.log(`Creating a sandbox...`);
  const tmpDir = dirSync().name;
  console.log(`tempDir`, tmpDir);
  try {
    writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({
        dependencies: {
          '@angular/cli': '~14.2.3',
          '@nrwl/angular': '~14.7.0',
          '@nrwl/workspace': '~14.7.0',
          'typescript': '^4.7.0',
        },
        license: 'MIT',
      })
    );
    console.log('package.json created successufully');
  }catch(error){
    cleanup(tmpDir);
    console.error('Error creating package.json', error);
  }

  try{
    execSync(`npm install`, {
      cwd: tmpDir,
      stdio: [0, 1, 2],
    });
    console.log('Dependencies installed successfully');
  }catch(error){
    cleanup(tmpDir);
    console.error('error on dependency installation', error);
  }

  try{
    execSync(`npm install @ptg-ui/angular-schematics`, {
      cwd: tmpDir,
      stdio: [0, 1, 2],
    });
  }catch(error){
    cleanup(tmpDir);
    console.error('Error on adding @ptg-ui/angular-schematics', error);
  }
  return tmpDir;
}

//open when require to take name by inquirer
// async function takeAppName(){
//   return inquirer
//   .prompt([
//     {
//       name: "ApplicationName",
//       message: `Enter Application Name`,
//       type: "input",
//     },
//   ])
//   .then((a) => {
//     return a.ApplicationName;
//   });
// }
async function createApp(tmpDir: string) {
  console.log('Inside createApp Angular');
  const collection = `${tmpDir}/node_modules/@ptg-ui/angular-schematics/src/collection.json`;
  // const projectAppName= await takeAppName();
  // console.log('projectAppName', projectAppName);
  const command = `${tmpDir}/node_modules/.bin/ng new --collection=${collection} --strict false`;
  console.log('current directory', process.cwd());
  try {
    execSync(`${command}`, {
      stdio: [0, 1, 2],
      cwd: process.cwd(),
    });
  } catch(err) {
    cleanup(tmpDir);
    console.log({err});
  }
  cleanup(tmpDir);
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

//cleanup function
function cleanup(dirPath:string) {
  if (existsSync(dirPath)) {
    readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (lstatSync(curPath).isDirectory()) {
        // Recursively delete directory
        cleanup(curPath);
      } else {
        // Delete file
        unlinkSync(curPath);
      }
    });
    // Remove the empty directory
    rmdirSync(dirPath);
  } else {
    console.warn(`Directory does not exist: ${dirPath}`);
  }
}

export async function invokeAngularGenerator() {
  const temp = await createSandbox();
  createApp(temp);
  addVSCodeExtensions();
}
