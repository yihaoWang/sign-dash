# sign-dash

## Demo App
Check the live demo app in [Sign Dash](https://sign-dash.onrender.com/)

See the [API Docs](https://sign-dash.onrender.com/api-docs/)

## Run in your machine
### Required
- Node.js >= v16

### Install
Set up env
```shell
export GOOGLE_AUTH_CLIENT_ID="${YOUR_GOOGLE_CLIENT_ID}"
export FB_AUTH_CLIENT_ID="${YOUR_FB_CLIENT_ID}"
export SENDGRID_API_KEY="${YOUR_SENDGRID_API_KEY}"
export SESSION_SECRET="${SESSION_KEY}"
export DATABASE_URL="${DATABASE_URL}"
export REDIS_URL="${REDIS_URL}"
```

Install app
```shell
yarn install
```

Run App
```shell
yarn dev
```
