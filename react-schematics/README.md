# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Okta Integration

1. Answer the following question with okta while running

```bash
ptg-ui-cli
```

`Would you like to add Authentication to this application?` => `okta`

2. Configure Okta Client, here all changes related to will automatically get added following config in `okta.config.ts` file.

   1. yourOktaDomain - okta domain
   2. clientId - clientId from okta application

Example: `okta.config.ts`
const ISSUER=https://{yourOktaDomain}/oauth2/default
const CLIENT_ID={clientId}

3. After serving application click on login it will redirect you to okta login page if configuration are valid

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
