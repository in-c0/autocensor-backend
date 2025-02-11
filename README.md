
## Overview

 backend for AutoCensor using Deepgram for transcription and FFMPEG.wasm for in‐browser video editing. We use Wasp-Lang as our full‐stack DSL


TODO:

Remember to configure S3 bucket with a lifecycle policy to delete objects after 24 hours

## Project Structure

```bash
AutoCensor/
├── client/
│   ├── public/
│   │   └── sound-effects/
│   │       ├── beep.mp3
│   │       ├── honk.mp3
│   │       ├── mute.mp3
│   │       ├── quack.mp3
│   │       ├── boom.mp3
│   │       └── trumpet.mp3
│   └── src/
│       ├── App.js                  // (Frontend implementation, not covered here)
│       └── components/
│           ├── FileUpload.js       // File upload with progress (using presigned URLs)
│           └── VideoEditor.js      // Video editor (using ffmpeg.wasm for overlaying sound effects)
├── server/
│   ├── index.js                    // Express entry point
│   ├── models/
│   │   ├── User.js                 // User model with minimal fields and credit count
│   │   └── Analysis.js             // Analysis results (stores file key and transcript)
│   ├── routes/
│   │   ├── authRoutes.js           // /api/auth/register & /api/auth/login endpoints
│   │   ├── fileRoutes.js           // /api/files/upload-url endpoint
│   │   ├── analysisRoutes.js       // /api/analyze endpoint
│   │   └── stripeRoutes.js         // /api/stripe/create-checkout-session endpoint
│   └── utils/
│       ├── s3.js                   // AWS S3 presigned URL generator
│       └── stripe.js               // Stripe checkout session creator
├── package.json
└── fly.toml                      // Fly.io deployment configuration


```