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

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(options: any): Rule {
  console.log(options);
  return async (host: Tree, _context: SchematicContext) => {
    // console.log(tree);

    const workspace = await getWorkspace(host);
    const newProjectRoot =
      (workspace.extensions.newProjectRoot as string | undefined) || "";
    const isRootApp = options.projectRoot !== undefined;
    const appDir = isRootApp
      ? normalize(options.projectRoot || "")
      : join(normalize(newProjectRoot), strings.dasherize(options.name));
    // const sourceDir = `${appDir}/src/app`;

    return chain([
      externalSchematic("@schematics/angular", "module", {
        name: "shared",
        project: options.name,
        module: "app.module.ts",
      }),
      externalSchematic("@schematics/angular", "module", {
        name: "core",
        project: options.name,
        module: "app.module.ts",
      }),
      setFramework(options, host),
      setNGRX(options),
      mergeWith(
        apply(url("./files"), [
          applyTemplates({
            utils: strings,
            ...options,
            appName: options.name,
            isRootApp,
          }),
          move(appDir),
        ]),
        MergeStrategy.Overwrite
      ),
    ]);
  };
}

export function setFramework(_options: any, host: Tree): Rule {
  if (_options.framework === "material") {
    return chain([addMaterialToPackageJson(), updateStyles(host)]);
  }

  if (_options.framework === "bootstrap") {
    return chain([addBootstrapToPackageJson(), updateStyles(host)]);
  }

  return noop;
}

export function setNGRX(_options: any): Rule {
  if (!_options.ngrx) {
    return noop;
  }
  return chain([
    // addNrwlToPackageJson(),
    externalSchematic("@nrwl/angular", "ngrx", {
      name: "app",
      module: "src/app/app.module.ts",
      facade: true,
      root: true,
      syntax: "classes",
    }),
    externalSchematic("@nrwl/angular", "ngrx", {
      name: "app",
      module: "src/app/core/core.module.ts",
      facade: true,
      root: false,
      syntax: "classes",
    }),
  ]);
}

export function addMaterialToPackageJson(): Rule {
  return addDepsToPackageJson(
    {
      "@angular/material": "latest",
      "@angular/cdk": "latest",
    },
    {}
  );
}

export function addBootstrapToPackageJson(): Rule {
  return addDepsToPackageJson(
    {
      bootstrap: "latest",
      "@angular/cdk": "latest",
    },
    {}
  );
}

export function addNrwlToPackageJson(): Rule {
  console.log("adding nrwl packages");
  return addDepsToPackageJson(
    {
      "@nrwl/angular": "11.3.2",
      "@nrwl/workspace": "11.3.2",
    },
    {}
  );
}

export function updateStyles(options: any) {
  let content = `
    @import './app/app.theme';

    @include app-theme();
    
  `;
  if (options.framework === "material") {
    content =
      content +
      `
    @import "@angular/material/prebuilt-themes/indigo-pink.css";
    body {
      height: 100%;
    }
    body {
      margin: 0;
      font-family: Roboto, "Helvetica Neue", sans-serif;
    }
    
    `;
  }
  if (options.framework === "bootstrap") {
    content =
      content +
      ` 
    @import "~bootstrap/dist/css/bootstrap.css"
    `;
  }
  return (host: Tree) => {
    host.overwrite(`src/styles.scss`, content);
    return host;
  };
}
