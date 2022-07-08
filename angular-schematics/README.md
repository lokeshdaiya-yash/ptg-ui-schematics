# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Setup Steps
Step 1 : npm install
Step 2 : npm run build
Step 3 : npm link(run it on other terminal as npm run build is on watch mode)
Step 4 : Globally install schematics using following commands:
        npm install -g @angular/cli
        npm install -g @angular-devkit/schematics-cli
        npm install -g typescript
        npm install -g @nrwl/angular
        npm install -g @nrwl/workspace

Step 5 : Run schematics on other path where you want the complete structure of your project
        Run Using(Prefarable) : ng new --collection @ptg/angular
        OR                    : schematics @ptg/angular:application

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
 




