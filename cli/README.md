### CLI
```bash
Step 1 : npm install
Step 2 : npm run build
Step 3 : npm link(run it on other terminal as npm run build is on watch mode)
```

### Angular schematic
```bash
Step 1 : npm install
Step 2 : npm run build
Step 3 : npm link(run it on other terminal as npm run build is on watch mode)
```

### React schematic
```bash
Step 1 : npm install
Step 2 : npm run build
Step 3 : npm link(run it on other terminal as npm run build is on watch mode)
```

### Where the project needs to be created
`ptg-ui-cli`

After publishing
`npm i @ptg-ui/cli`


`If you have opted for MSAL authentication, please follow the steps outlined below:`
## Microsoft Authentication Login (MSAL)

### Register Your Application in the Azure Portal

- Go to [Azure Portal](https://portal.azure.com) 🔎
- Navigate to "Azure Active Directory" > "App registrations"
- Click On "New Registration"
- Complete the registration form with the following details:
  - Name: Your lication name.
  - Supported account types: Choose the appropriate option based on your needs.
  - Redirect URI: Set it to `http://localhost:3000` (or another URL based on your environment).
- Click **Register**

> After registering your application in Azure AD, make sure to copy the Client ID, Tenant ID, and redirect URI. Then, paste these values into the `authConfig.js` file located in **src>app>login>authConfig.js**
