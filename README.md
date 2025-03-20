
## Overview

 backend for AutoCensor using Deepgram for transcription and FFMPEG.wasm for in‐browser video editing. We use Wasp-Lang as our full‐stack DSL

Check Deployment Status with:

```bash
flyctl status
```

Run server locally:

```bash
node server/index.js
```

Configure TLS version >1.2:

```bash
$env:NODE_OPTIONS="--tls-min-v1.2"
```

Configure .env variables:
```bash
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET=your_s3_bucket
STRIPE_SECRET_KEY=your_stripe_secret_key
```
For local testing of MongoDB TLS issues, the code appends `tlsAllowInvalidCertificates=true` to the connection string automatically if not in production.




## Testing Endpoints


### auth/google:

In your browser, visit http://localhost:3000/auth/google.
After successful authentication, you should be redirected to http://localhost:3000 (or your configured FRONTEND_URL) and receive a session cookie (connect.sid).
Check your browser’s Developer Tools under Application → Cookies to confirm that the session cookie is set.

### files/upload-url

Using Postman, send a POST request to:
```bash
http://localhost:3000/api/files/upload-url
```
with a raw JSON body:
```json
{
  "fileName": "sample.mp4",
  "fileType": "video/mp4"
}
```
The response will contain a `url` (presigned URL) and a `key` (S3 object key).
Using the returned presigned URL, create a PUT request in Postman:
 - Set the URL to the presigned URL from the response.
 - In the Headers tab, set Content-Type to video/mp4.
 - In the Body tab, select binary and choose the file (sample.mp4) from your system.
 - Send the request. A 200 OK response indicates the file was successfully uploaded. You can verify this in your S3 console.

### api/analyze

Retrieve the session cookie from your browser’s Developer Tools (under Application → Cookies).
Then, in Postman, add this cookie to your request by adding it in the header key: 'Cookie' and value: 'connect.sid=...'


TODO:

Remember to configure S3 bucket with a lifecycle policy to delete objects after 24 hours
