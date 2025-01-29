import { strings } from "@angular-devkit/core";
import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { addDepsToPackageJson, getWorkspace } from "@nrwl/workspace";
import { join, normalize } from "path";
import {
  reactReduxVersion,
  reduxVersion,
  i18nextVersion,
  i18nextBrowserLanguagedetectorVersion,
  reactI18nextVersion,
  materialUICoreVersion,
  muiMaterialVersion,
  emotionReactVersion,
  emotionStyledVersion,
  bootstrapVersion,
  reactBootstrapVersion,
} from "../utils/version";

// Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
export default function (options: any): Rule {
  return async (host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const newProjectRoot =
      (workspace.extensions.newProjectRoot as string | undefined) ?? "";
    const isRootApp = options.projectRoot !== undefined;
    const appDir = isRootApp
      ? normalize(options.projectRoot || "")
      : join(normalize(newProjectRoot), strings.dasherize(options.name));
    options.appDir = appDir;
    let originalOptionsObject = JSON.parse(JSON.stringify(options));
    // The chain rule allows us to chain multiple rules and apply them one after the other.

    return chain([
      (_tree: Tree, context: SchematicContext) => {
        // Show the options for this Schematics.
        context.logger.info("Application->: " + JSON.stringify(options));
      },

      // The schematic Rule calls the schematic from the same collection, with the options
      // passed in. Please note that if the schematic has a schema, the options will be
      // validated and could throw, e.g. if a required option is missing.
      externalSchematic("@nrwl/react", "application", {
        ...options,
      }),
      //schematic('my-other-schematic', { option: true }),
      setFramework(originalOptionsObject, isRootApp),
      setReduxTpPackageJson(originalOptionsObject),
      setI18nToPackageJson(originalOptionsObject),
      originalOptionsObject.redux
        ? addDashboardToProject(originalOptionsObject, isRootApp)
        : noop,
      // The mergeWith() rule merge two trees; one that's coming from a Source (a Tree with no
      // base), and the one as input to the rule. You can think of it like rebasing a Source on
      // top of your current set of changes. In this case, the Source is that apply function.
      // The apply() source takes a Source, and apply rules to it. In our case, the Source is
      // url(), which takes an URL and returns a Tree that contains all the files from that URL
      // in it. In this case, we use the relative path `./files`, and so two files are going to
      // be created (test1, and test2).
      // We then apply the template() rule, which takes a tree and apply two templates to it:
      //   path templates: this template replaces instances of __X__ in paths with the value of
      //                   X from the options passed to template(). If the value of X is a
      //                   function, the function will be called. If the X is undefined or it
      //                   returns null (not empty string), the file or path will be removed.
      //   content template: this is similar to EJS, but does so in place (there's no special
      //                     extension), does not support additional functions if you don't pass
      //                     them in, and only work on text files (we use an algorithm to detect
      //                     if a file is binary or not).

      mergeWith(
        apply(url("./files"), [
          applyTemplates({
            utils: strings,
            ...originalOptionsObject,
            appName: originalOptionsObject.name,
            isRootApp,
          }),
          move(appDir),
        ]),
        MergeStrategy.Overwrite
      ),
      originalOptionsObject.routing &&
      originalOptionsObject.redux &&
      originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./files-route+redux+i18n"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(`apps/${options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      originalOptionsObject.routing &&
      !originalOptionsObject.redux &&
      !originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./files-route"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(`apps/${options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      !originalOptionsObject.routing &&
      originalOptionsObject.redux &&
      !originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./files-redux"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(`apps/${options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      !originalOptionsObject.routing &&
      !originalOptionsObject.redux &&
      originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./files-i18n"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(`apps/${options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      originalOptionsObject.routing &&
      originalOptionsObject.redux &&
      !originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./files-route+redux"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(`apps/${options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      originalOptionsObject.routing &&
      !originalOptionsObject.redux &&
      originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./files-route+i18n"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(`apps/${options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      !originalOptionsObject.routing &&
      originalOptionsObject.redux &&
      originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./files-redux+i18n"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(`apps/${options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      !originalOptionsObject.routing &&
      !originalOptionsObject.redux &&
      !originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./files-route"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(`apps/${options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
    ]);
  };
}
export function setFramework(options: any, isRootApp: boolean) {
  const tasks = [];
  if (options.framework === "material") {
    tasks.push(addMaterialToPackageJson());
  }
  if (options.auth === "custom") {
    tasks.push(addLoginToProject(options, isRootApp, "./login/"));
    tasks.push(addAuthServiceToProject(options, isRootApp));
  }
  if (options.auth === "msal") {
    tasks.push(addLoginToProject(options, isRootApp, "./msal/"));
  }
  if (options.framework === "bootstrap") {
    tasks.push(addBootstrapToPackageJson());
    tasks.push(updateStyles(options));
  }
  if (tasks.length > 0) return chain(tasks);
  else return noop;
}

export function setReduxTpPackageJson(options: any): Rule {
  if (!options.redux) {
    return noop;
  }
  return chain([
    addDepsToPackageJson(
      {
        "react-redux": reactReduxVersion,
        redux: reduxVersion,
      },
      {},
      false
    ),
  ]);
}

export function setI18nToPackageJson(options: any): Rule {
  if (!options.i18n) {
    return noop;
  }
  return chain([
    addDepsToPackageJson(
      {
        i18next: i18nextVersion,
        "i18next-browser-languagedetector":
          i18nextBrowserLanguagedetectorVersion,
        "react-i18next": reactI18nextVersion,
      },
      {},
      false
    ),
  ]);
}

export function addDashboardToProject(_options: any, isRootApp: boolean): Rule {
  const inputUrl = "./redux-i18-dashboard/";
  return mergeWith(
    apply(url(inputUrl), [
      applyTemplates({
        utils: strings,
        ..._options,
        appName: "components",
        isRootApp,
      }),
      move(`apps/${_options.name}/src/app/components/`),
    ]),
    MergeStrategy.Overwrite
  );
}

export function addLoginToProject(
  _options: any,
  isRootApp: boolean,
  inputUrl: string
): Rule {
  return mergeWith(
    apply(url(inputUrl), [
      applyTemplates({
        utils: strings,
        ..._options,
        appName: "components",
        isRootApp,
      }),
      move(`apps/${_options.name}/src/app/login/`),
    ]),
    MergeStrategy.Overwrite
  );
}
export function addAuthServiceToProject(
  _options: any,
  isRootApp: boolean
): Rule {
  let inputUrl = "./services/";
  return mergeWith(
    apply(url(inputUrl), [
      applyTemplates({
        utils: strings,
        ..._options,
        appName: "components",
        isRootApp,
      }),
      move(`apps/${_options.name}/src/app/services/`),
    ]),
    MergeStrategy.Overwrite
  );
}

export function addMaterialToPackageJson(): Rule {
  return addDepsToPackageJson(
    {
      "@material-ui/core": materialUICoreVersion,
      "@mui/material": muiMaterialVersion,
      "@emotion/react": emotionReactVersion,
      "@emotion/styled": emotionStyledVersion,
    },
    {},
    false
  );
}

export function addBootstrapToPackageJson(): Rule {
  return addDepsToPackageJson(
    {
      bootstrap: bootstrapVersion,
      "react-bootstrap": reactBootstrapVersion,
    },
    {},
    false
  );
}

export function updateStyles(options: any) {
  return (host: Tree) => {
    let content = ``;
    if (options.framework === "bootstrap") {
      content = `@import "~bootstrap/dist/css/bootstrap.css";`;
    }
    host.overwrite(`apps/${options.name}/src/styles.${options.style}`, content);
    return host;
  };
}
