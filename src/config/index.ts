interface IGoogleAuthConfig {
  clientId: string;
  callbackUrl: string;
}

interface IFBAuthConfig {
  clientId: string;
  secretId: string;
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

interface IRedisConfig {
  url: string;
}

interface IConfig {
  googleAuth: IGoogleAuthConfig;
  fbAuth: IFBAuthConfig;
  app: IAppConfig;
  sendgrid: ISendgridConfig;
  redis: IRedisConfig;
}

const config: IConfig = {
  "googleAuth": {
    "clientId": process.env.GOOGLE_AUTH_CLIENT_ID || "",
    "callbackUrl": "/auth/google/callback",
  },
  "fbAuth": {
    "clientId": process.env.FB_AUTH_CLIENT_ID || "",
    "secretId": process.env.FB_AUTH_SECRET_ID || "",
    "callbackUrl": "/auth/fb/callback",
  },
  "app": {
    "domain": process.env.SIGN_DASH_DOMAIN || 'http://localhost:3000',
    "sessionSecret": process.env.SESSION_SECRET || "",
  },
  "sendgrid": {
    "apiKey": process.env.SENDGRID_API_KEY || "",
    "templateId": "d-b76830e0967b4c77bac1dea2a2bdb43e",
  },
  "redis": {
    "url": process.env.REDIS_URL || "localhost",
  }
}

export default config;