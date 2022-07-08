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
import {
  addDepsToPackageJson,
  formatFiles,
  getWorkspace,
} from "@nrwl/workspace";
import { join, normalize } from "path";
import { addImportToAppModule, insertStatement } from "../utils/utils";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function application(options: any): Rule {
  return async (host: Tree, _context: SchematicContext) => {
    // console.log(tree);

    const workspace = await getWorkspace(host);
    const newProjectRoot =
      (workspace.extensions.newProjectRoot as string | undefined) || "";
    const isRootApp = options.projectRoot !== undefined;
    const appDir = isRootApp
      ? normalize(options.projectRoot || "")
      : join(normalize(newProjectRoot), strings.dasherize(options.name));
    options.appDir = appDir;
    // const sourceDir = `${appDir}/src/app`;

     var originalOptionsObject=JSON.parse(JSON.stringify(options));
    // console.log('originalOptionsObject::'+JSON.stringify(originalOptionsObject));
     const keysToDelete=['framework','ngrx','i18n','appDir'];
    /*--get schema compatible with application schema---*/
     let inputToApplicationSchema=deleteKeys(options,keysToDelete);
     //console.log('modified::'+JSON.stringify(inputToApplicationSchema));

    return chain([
      
    externalSchematic("@schematics/angular", "application", {
        ...inputToApplicationSchema,
        style: "scss",
        skipInstall: true,
        strict: true,
      }),
      addImportToAppModule("SharedModule", "./shared/shared.module"),
      addImportToAppModule("CoreModule", "./core/core.module"),
      originalOptionsObject.i18n ? addI18n() : noop,
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
      originalOptionsObject.i18n
        ? mergeWith(
            apply(url("./i18n-files"), [
              applyTemplates({
                utils: strings,
                ...originalOptionsObject,
                appName: originalOptionsObject.name,
                isRootApp,
              }),
              move(appDir),
            ]),
            MergeStrategy.Overwrite
          )
        : noop,
      setFramework(originalOptionsObject,isRootApp,appDir,originalOptionsObject.i18n),
      setNGRX(originalOptionsObject),

      formatFiles(),
    ]);
  };
}

export function setFramework(_options: any,isRootApp: boolean,appDir: string,isI18nSeleted:boolean): Rule {
  if (_options.framework === "material") {
    return chain([addMaterialToPackageJson(), updateStyles(_options)]);
  }

  if (_options.framework === "bootstrap") {
    return chain([addBootstrapToPackageJson(), updateStyles(_options)]);
  }

  if (_options.framework === "tailwind") {
    return chain([addTailwindToPackageJson(), updateStyles(_options),createTailwindConfig(_options,isRootApp,appDir,isI18nSeleted)]);
  }

  return noop;
}

export function setNGRX(_options: any): Rule {
  if (!_options.ngrx) {
    return noop;
  }
  return chain([
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
    addDepsToPackageJson(
      {
        "@nrwl/angular": "12.9.0",
        "@nrwl/workspace": "12.9.0",
      },
      {}
    ),
  ]);
}

export function addMaterialToPackageJson(): Rule {
  return addDepsToPackageJson(
    {
      "@angular/material": "^12.2.9",
      "@angular/cdk": "^12.2.9",
    },
    {},
    false
  );
}

export function addBootstrapToPackageJson(): Rule {
  return addDepsToPackageJson(
    {
      bootstrap: "^4.0.0",
    },
    {},
    false
  );
}
export function addTailwindToPackageJson(): Rule {
  return addDepsToPackageJson(
    {
      "tailwindcss": "^2.2.0"
    },
    {},
    false
  );
}

export function updateStyles(options: any) {
  return (host: Tree) => {
    let content = `
    @import './app/app.theme';

    @include app-theme();
    
  `;
    if (options.framework === "material") {
      content = `
    @import "@angular/material/prebuilt-themes/indigo-pink.css";
    body {
      height: 100%;
    }
    body {
      margin: 0;
      font-family: Roboto, "Helvetica Neue", sans-serif;
    }
    ${content} 
    `;
    }
    if (options.framework === "bootstrap") {
      content = ` 
    @import "~bootstrap/dist/css/bootstrap.css";
    ${content}
    `;
    }
    if (options.framework === "tailwind") {
      content = ` 
      @import 'tailwindcss/base';
      @import 'tailwindcss/components';
      @import 'tailwindcss/utilities';
    ${content}
    `;
    }
    host.overwrite(`src/styles.scss`, content);
    return host;
  };
}

export function createTailwindConfig(_options:any,isRootApp: boolean,appDir: string,isI18nSeleted:boolean): Rule {
 let inputUrl=isI18nSeleted?"./tailwind-files/tailwind+i18n-files/":"./tailwind-files/tailwind-i18n-files/";
 return mergeWith(
    apply(url(inputUrl), [
      applyTemplates({
        utils: strings,
        ..._options,
        appName: _options.name,
        isRootApp,
      }),
      move(appDir),
    ]),
    MergeStrategy.Overwrite
  )
      
}

export function addI18n(): Rule {
  return chain([
    addImportToAppModule(
      `
         TranslateModule,
         TranslateLoader
         `,
      "@ngx-translate/core",
      `
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: translateHttpLoaderFactory,
            deps: [HttpClient]
          }
        })
        `
    ),
    addImportToAppModule(`HttpClientModule`, "@angular/common/http"),
    addImportToAppModule(`HttpClient`, "@angular/common/http", undefined, true),
    addImportToAppModule(
      `TranslateHttpLoader`,
      "@ngx-translate/http-loader",
      undefined,
      true
    ),
    insertStatement(
      "src/app/app.module.ts",
      `export function translateHttpLoaderFactory(http: HttpClient) {
          return new TranslateHttpLoader(http);
        }`
    ),
    addDepsToPackageJson(
      {
        "@ngx-translate/core": "13.0.0",
        "@ngx-translate/http-loader": "6.0.0",
      },
      {}
    ),
  ]);
}

 function deleteKeys(inputObj:any,keysToDelete: string[]): any
{
  keysToDelete.forEach(key => delete inputObj[key]);
  console.log(inputObj);
  return inputObj;
}
