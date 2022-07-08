import { Rule, SchematicsException, Tree } from "@angular-devkit/schematics";
import { applyChangesToString, ChangeType } from "@nrwl/devkit";
import { insert } from "@nrwl/workspace";
import { insertImport } from "@nrwl/workspace/src/utils/ast-utils";
import { addImportToModule } from "./ast-utils";
import ts = require("typescript");

export function addImportToAppModule(
  moduleName: string,
  modulePath: string,
  symbolName = moduleName,
  importOnly = false
) {
  return (host: Tree) => {
    const appModulePath = "src/app/app.module.ts";
    const text = host.read(appModulePath);
    if (text === null) {
      throw new SchematicsException(`File ${appModulePath} does not exist.`);
    }
    const sourceText = text.toString();
    const source = ts.createSourceFile(
      appModulePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    insert(host, appModulePath, [
      insertImport(source, appModulePath, moduleName, modulePath),
      ...(!importOnly ? addImportToModule(source, modulePath, symbolName) : []),
    ]);
    return host;
  };
}

export function insertStatement(path: string, statement: string): Rule {
  return (tree: Tree) => {
    const contents = tree?.read(path)?.toString() as string;

    const sourceFile = ts.createSourceFile(
      path,
      contents,
      ts.ScriptTarget.ESNext
    );

    const importStatements = sourceFile.statements.filter(
      ts.isImportDeclaration
    );
    const index =
      importStatements.length > 0
        ? importStatements[importStatements.length - 1].getEnd()
        : 0;

    if (importStatements.length > 0) {
      statement = "\n" + statement;
    }

    const newContents = applyChangesToString(contents, [
      {
        type: ChangeType.Insert,
        index,
        text: statement,
      },
    ]);

    tree.overwrite(path, newContents);
    return tree;
  };
}
