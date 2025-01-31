import { strings } from "@angular-devkit/core";
import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from "@angular-devkit/schematics";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function greeter(_options: any): Rule {
  return async (host: Tree, _context: SchematicContext) => {
    // const workspace = await getWorkspace(host);
    // const newProjectRoot =
    //   (workspace.extensions.newProjectRoot as string | undefined) ?? "";
    const isRootApp = _options.projectRoot !== undefined;
    // const appDir = isRootApp
    //   ? normalize(_options.projectRoot || "")
    //   : join(normalize(newProjectRoot), strings.dasherize(_options.name));
    // _options.appDir = appDir;
    let originalOptionsObject = JSON.parse(JSON.stringify(_options));
    console.log(host);
    return chain([
      (tree: Tree, _content: SchematicContext) => {
        console.log("tree in chain", tree.branch);
      },
      mergeWith(
        apply(url("./files-route"), [
          applyTemplates({
            utils: strings,
            auth: "okta",
            ...originalOptionsObject,
            appName: originalOptionsObject.name,
            isRootApp,
          }),
          move(`apps/${_options.name}`),
        ]),
        MergeStrategy.Overwrite
      ),
      mergeWith(
        apply(url("./okta/"), [
          applyTemplates({}),
          move(`apps/${_options.name}/src/app/okta/`),
        ]),
        MergeStrategy.Overwrite
      ),
      (tree: Tree, _context: SchematicContext) => {
        return tree;
      },
    ]);
  };
}
