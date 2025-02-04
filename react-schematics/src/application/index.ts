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
import { ApplicationSchema } from "./schema";

/**
 * Rule to generate a new application
 * @param _options your schema options
 * @returns Rule
 */
export default function (_options: ApplicationSchema): Rule {
  return async (_host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(_host);
    const newProjectRoot =
      (workspace.extensions.newProjectRoot as string | undefined) ?? "";
    const isRootApp = _options.projectRoot !== undefined;
    const appDir = isRootApp
      ? normalize(_options.projectRoot || "")
      : join(normalize(newProjectRoot), strings.dasherize(_options.name));
    _options.appDir = appDir;
    let originalOptionsObject: ApplicationSchema = JSON.parse(
      JSON.stringify(_options)
    );

    /**
     * The chain rule allows us to chain multiple rules and apply them one after the other.
     */
    return chain([
      (_tree: Tree, context: SchematicContext) => {
        context.logger.info("Provided Options->: " + JSON.stringify(_options));
      },

      /**
       * The schematic Rule calls the schematic from the same collection,
       * with the _options passed in. Please note that if the schematic has a schema,
       * the _options will be validated and could throw, e.g. if a required option is missing.
       */
      externalSchematic("@nrwl/react", "application", {
        ..._options,
      }),
      setFramework(originalOptionsObject, isRootApp),
      setReduxTpPackageJson(originalOptionsObject),
      setI18nToPackageJson(originalOptionsObject),
      originalOptionsObject.redux
        ? addDashboardToProject(originalOptionsObject, isRootApp)
        : noop,

      /**
       * Development Guide
       * The mergeWith() rule merge two trees; one that's coming from a Source (a Tree with no base),
       * and the one as input to the rule. You can think of it like rebasing a Source on top of your current set of changes.
       * In this case, the Source is that apply function.
       */

      /**
       * The apply() source takes a Source, and apply rules to it. In our case, the Source is url(),
       * which takes an URL and returns a Tree that contains all the files from that URL in it.
       * In this case, we use the relative path `./files`, and so two files are going to be created (test1, and test2).
       */

      /**
       * We then apply the template() rule, which takes a tree and apply two templates to it: path templates:
       * this template replaces instances of __X__ in paths with the value of X from the _options passed to template().
       * If the value of X is a function, the function will be called. If the X is undefined or it returns null (not empty string),
       * the file or path will be removed. content template: this is similar to EJS, but does so in place (there's no special extension),
       *  does not support additional functions if you don't pass them in,
       * and only work on text files (we use an algorithm to detect if a file is binary or not).
       */

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
              move(`apps/${_options.name}`),
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
              move(`apps/${_options.name}`),
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
              move(`apps/${_options.name}`),
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
              move(`apps/${_options.name}`),
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
              move(`apps/${_options.name}`),
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
              move(`apps/${_options.name}`),
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
              move(`apps/${_options.name}`),
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
              move(`apps/${_options.name}`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      /**
       * If the user selects Okta as the authentication provider, the schematics will add the necessary files to the project.
       */
      originalOptionsObject.auth === "okta"
        ? mergeWith(
            apply(url("./okta/"), [
              applyTemplates({}),
              move(`apps/${_options.name}/src/app/okta/`),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      /**
       *  This is environment file for the project. The keys can be added as per the configuration.
       */
      mergeWith(
        apply(url("./environments/"), [
          applyTemplates({ ...originalOptionsObject }),
          move(`apps/${_options.name}/src/environments/`),
        ]),
        MergeStrategy.Overwrite
      ),
    ]);
  };
}
export function setFramework(_options: any, isRootApp: boolean) {
  const tasks = [];
  if (_options.framework === "material") {
    tasks.push(addMaterialToPackageJson());
  }
  if (_options.auth === "custom") {
    tasks.push(addLoginToProject(_options, isRootApp, "./login/"));
    tasks.push(addAuthServiceToProject(_options, isRootApp));
  }
  if (_options.auth === "msal") {
    tasks.push(addLoginToProject(_options, isRootApp, "./msal/"));
  }
  if (_options.framework === "bootstrap") {
    tasks.push(addBootstrapToPackageJson());
    tasks.push(updateStyles(_options));
  }
  if (tasks.length > 0) return chain(tasks);
  else return noop;
}

export function setReduxTpPackageJson(_options: any): Rule {
  if (!_options.redux) {
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

export function setI18nToPackageJson(_options: any): Rule {
  if (!_options.i18n) {
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

export function updateStyles(_options: any) {
  return (host: Tree) => {
    let content = ``;
    if (_options.framework === "bootstrap") {
      content = `@import "~bootstrap/dist/css/bootstrap.css";`;
    }
    host.overwrite(
      `apps/${_options.name}/src/styles.${_options.style}`,
      content
    );
    return host;
  };
}
