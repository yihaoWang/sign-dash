interface IGoogleAuthConfig {
  clientId: string;
  callbackUrl: string;
}

interface IAppConfig {
  domain: string;
}

interface ISendgridConfig {
  apiKey: string;
}

interface IConfig {
  googleAuth: IGoogleAuthConfig;
  app: IAppConfig;
  sendgrid: ISendgridConfig;
}

const config: IConfig = {
  "googleAuth": {
    "clientId": process.env.GOOGLE_AUTH_CLIENT_ID || '',
    "callbackUrl": "/auth/google/callback",
  },
  "app": {
    "domain": "https://sign-dash.onrender.com",
  },
  "sendgrid": {
    "apiKey": process.env.SENDGRID_API_KEY || '',
  },
}

export default config;