# Simplified SSO
Your organisation uses Microsoft ID. You have multiple web apps.
To better control the users, make use of Microsoft ID to authenticate users.

#### How it works
- Every web app will get a unique URI for login
- Direct user to the URI
- User will be automatically redirected to M365 for authentication
- M365 will redirect user to this page after successfully authenticated
- User will be automatically redirected to the web app (with an auth-code)
- Web App to use auth-code to retrieve user information (email, name and job title)

#### Instructions:

1. Register an App with Entra ID (https://learn.microsoft.com/en-us/power-apps/developer/data-platform/walkthrough-register-app-azure-active-directory)
   - Take note of the Tenant ID, Client ID, Client Secret, Redirect URI.
  
2. Set up AWS Lambda


For information on the Auth Flow: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
