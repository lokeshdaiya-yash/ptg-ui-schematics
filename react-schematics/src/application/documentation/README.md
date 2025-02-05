This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="150"></p>

🔎 **Smart, Extensible Build Framework**

## Development server

Run `nx serve my-app` or `npm start` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Microsoft Authentication Login (MSAL)
`If you have opted for MSAL authentication, please follow the steps outlined below:`

### Register Your Application in the Azure Portal

- Go to [Azure Portal](https://portal.azure.com) 🔎
- Navigate to "Azure Active Directory" > "App registrations"
- Click On "New Registration"
- Complete the registration form with the following details:
  - Name: Your application name.
  - Supported account types: Choose the appropriate option based on your needs.
  - Redirect URI: Set it to `http://localhost:4200` (or another URL based on your environment).
- Click **Register**

> After registering your application in Azure AD, make sure to copy the Client ID, Tenant ID, and redirect URI. Then, paste these values into the `msalConfig.js` located at **src>app>login>msalConfig.js** or add them directly in `environment file` located at **src>environments>environment.ts** and restart the application.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
