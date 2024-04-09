# Proto Digital Headless - S3 Plugin

> The official S3 plugin for Proto Digital Headless

This plugin registers the required media strategy functions to stream, upload, update and delete media from any S3 compatible storage solution.

## Installation

```bash
npm install @protoheadless/plugin-s3
```

## headless.config.ts/js

```typescript
export default headlessConfig({
  // ...other config
  plugins: [
    S3Plugin({
      clientConfig: {
        endpoint: `https://${process.env.HEADLESS_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: "auto",
        credentials: {
          accessKeyId: process.env.HEADLESS_S3_ACCESS_KEY as string,
          secretAccessKey: process.env.HEADLESS_S3_SECRET_KEY as string,
        },
      },
      bucket: "headless-cms",
    }),
  ],
});
```