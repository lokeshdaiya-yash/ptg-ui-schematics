#!/usr/bin/env node
import * as inquirer from "inquirer";
import { invokeAngularGenerator } from "./generators/angular";
import { invokeReactGenerator } from "./generators/react";
/**
 * Executions Starts
 */

getArgs().then((appType) => {
  invokeCli(appType);
});

/**
 * Executions Ends
 */

function invokeCli(appType: string) {
  switch (appType) {
    case "angular":
      invokeAngularGenerator();
      break;
    case "react":
      invokeReactGenerator();
    break;
    default:
      console.log(`${appType} generator is under development`);
      break;
  }
}

function getArgs() {
  const options: { value: string; name: string }[] = [
    {
      name: "Angular",
      value: "angular",
    },
    {
      name: "React",
      value: "react",
    },
    {
      name: "Vue",
      value: "vue",
    },
  ];
  return inquirer
    .prompt([
      {
        name: "ApplicationType",
        message: `Select Application Type`,
        type: "list",
        default: "angular",
        choices: options,
      },
    ])
    .then((a) => {
      return a.ApplicationType;
    });
}

// const command = `ng new --collection=@ptg/angular/src/collection.json --strict false`;
// console.log(command);
// console.log("current directory", process.cwd());

// execSync(`${command}`, {
//   stdio: [0, 1, 2],
//   cwd: process.cwd(),
// });

// TODO : implement i18n
