interface IGoogleAuthConfig {
  clientId: string;
  callbackUrl: string;
}

interface IAppConfig {
  domain: string;
  sessionSecret: string;
}

interface ISendgridConfig {
  apiKey: string;
  templateId: string;
}

interface IConfig {
  googleAuth: IGoogleAuthConfig;
  app: IAppConfig;
  sendgrid: ISendgridConfig;
}

const config: IConfig = {
  "googleAuth": {
    "clientId": process.env.GOOGLE_AUTH_CLIENT_ID || "",
    "callbackUrl": "/auth/google/callback",
  },
  "app": {
    "domain": "https://sign-dash.onrender.com",
    "sessionSecret": process.env.SESSION_SECRET || "",
  },
  "sendgrid": {
    "apiKey": process.env.SENDGRID_API_KEY || "",
    "templateId": "d-b76830e0967b4c77bac1dea2a2bdb43e",
  },
}

export default config;