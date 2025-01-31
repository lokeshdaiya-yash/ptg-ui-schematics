import { execSync } from "child_process";
import inquirer = require("inquirer");

export function reactAppGenerator() {
  getArgs().then((a) => {
    execSync(
      `npx create-nx-workspace@13.0.0 ${a.workspace}  --preset empty --nx-cloud=false`,
      {
        cwd: process.cwd(),
        stdio: [0, 1, 2],
      }
    );
    execSync(
      `npm install @angular-devkit/core@12.2.9 @angular-devkit/schematics@12.2.9 --force`,
      {
        cwd: `${process.cwd()}/${a.workspace}`,
        stdio: [0, 1, 2],
      }
    );

    execSync(`npm install @ptg-ui/react-schematics --force`, {
      cwd: `${process.cwd()}/${a.workspace}`,
      stdio: [0, 1, 2],
    });

    execSync(
      `nx generate @ptg-ui/react-schematics:application --name ${a.name} --style ${a.style} --framework ${a.framework} --routing ${a.routing} --redux ${a.redux} --i18n ${a.i18n} --auth ${a.auth}`,
      {
        cwd: `${process.cwd()}/${a.workspace}`,
        stdio: [0, 1, 2],
      }
    );

    const npmPkgs = [];
    if (a.auth) {
      if (a.auth === "msal") {
        npmPkgs.push("@azure/msal-react");
        npmPkgs.push("@azure/msal-browser");
      } else if (a.auth === "okta") {
        npmPkgs.push("@okta/okta-auth-js");
        npmPkgs.push("@okta/okta-react");
      }
    }

    if (a.routing) {
      npmPkgs.push("react-router-dom@6.28.0");
    }
    console.log(npmPkgs.join(" "));
    execSync(`npm install --f ${npmPkgs.join(" ")}`, {
      cwd: `${process.cwd()}/${a.workspace}`,
      stdio: [0, 1, 2],
    });
  });
}

function getArgs() {
  const frameWorkOptions: { value: string; label: string }[] = [
    {
      value: "none",
      label: "None",
    },
    {
      value: "material",
      label: "Material",
    },
    {
      value: "bootstrap",
      label: "Bootstrap",
    },
  ];
  const styleOptions: { value: string; label: string }[] = [
    {
      value: "css",
      label: "CSS",
    },
    {
      value: "scss",
      label: "SASS(.scss)",
    },
    {
      value: "styl",
      label: "Stylus(.styl)",
    },
    {
      value: "less",
      label: "LESS",
    },
  ];
  const authOptions: { value: string; label: string }[] = [
    {
      value: "custom",
      label: "Custom",
    },
    {
      value: "msal",
      label: "Msal",
    },
    {
      value: "okta",
      label: "Okta",
    },
  ];
  return inquirer
    .prompt([
      {
        name: "workspace",
        message: `Workspace name (e.g., org name)`,
        type: "string",
      },
      {
        name: "name",
        message: `What name would you like to use for the application?`,
        type: "string",
      },
      {
        name: "framework",
        message: `Which framework would you like to use?`,
        type: "list",
        default: "none",
        choices: frameWorkOptions,
      },
      {
        name: "auth",
        message: `Would you like to add Authentication to this application?`,
        type: "list",
        default: "custom",
        choices: authOptions,
      },
      {
        name: "style",
        message: `Which stylesheet format would you like to use?`,
        type: "list",
        default: "css",
        choices: styleOptions,
      },
      {
        name: "routing",
        message: "Would you like to add React Router to this application?",
        type: "confirm",
      },
      {
        name: "redux",
        message: "Would you like to add Redux to this application?",
        type: "confirm",
      },
      {
        name: "i18n",
        message: "would you like to Adds i18n in project?",
        type: "confirm",
      },
    ])
    .then((a) => {
      return a;
    });
}

function addVSCodeExtensions() {
  const extensionsList = [
    "tabnine.tabnine-vscode",
    "mrmlnc.vscode-scss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-tslint-plugin",
    "vscode-icons-team.vscode-icons",
    "dsznajder.es7-react-js-snippets",
    "burkeholland.simple-react-snippets",
  ];
  const extensions = extensionsList
    .map((ext) => `--install-extension ${ext}`)
    .join(" ");
  execSync(`code ${extensions}`, {
    // stdio: [0, 1, 2],
    cwd: process.cwd(),
  });
}

export function invokeReactGenerator() {
  reactAppGenerator();
  addVSCodeExtensions();
}
