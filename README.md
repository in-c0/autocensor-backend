
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
│       ├── App.js                  // Frontend (not detailed here)
│       └── components/
│           ├── FileUpload.js       // File upload with presigned URL and progress
│           └── VideoEditor.js      // Video editor using ffmpeg.wasm for sound effects
├── server/
│   ├── index.js                    // Express entry point
│   ├── passportConfig.js           // Passport configuration for Google OAuth
│   ├── models/
│   │   ├── User.js                 // User model (with basic fields and credits)
│   │   └── Analysis.js             // Analysis results model (file key, transcript, etc.)
│   ├── routes/
│   │   ├── authRoutes.js           // OAuth endpoints (login, callback, logout)
│   │   ├── fileRoutes.js           // Endpoint for generating S3 presigned URLs
│   │   ├── analysisRoutes.js       // Endpoint for analysis (requires authentication)
│   │   └── stripeRoutes.js         // Endpoint for creating a Stripe checkout session
│   └── utils/
│       ├── s3.js                   // AWS S3 presigned URL generator
│       └── stripe.js               // Stripe checkout session creator
├── package.json
└── fly.toml                      // Fly.io deployment configuration

```