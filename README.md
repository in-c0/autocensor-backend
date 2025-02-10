
## Overview

 backend for AutoCensor using Deepgram for transcription and FFMPEG.wasm for in‐browser video editing. We use Wasp-Lang as our full‐stack DSL


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
│       ├── App.js              // Frontend: video file selection, S3 upload via presigned URLs, etc.
│       └── components/
│           └── VideoEditor.js  // Uses ffmpeg.wasm for simple censoring (overlay/mute) based on transcript
├── server/
│   ├── index.js                // Express entry point (mounts routes, security middleware, etc.)
│   ├── logger.js               // Winston logger configuration
│   ├── s3.js                   // AWS S3 integration (presigned URL generation)
│   ├── stripe.js               // Stripe integration (checkout session creation)
│   ├── queue.js                // Bull queue configuration (for transcription/analysis jobs)
│   ├── transcription.js        // API functions: enqueues transcription/analysis jobs and checks free vs. credit usage
│   ├── transcriptionWorker.js  // Worker that calls Deepgram (or other processing) for a job
│   ├── models/
│   │   └── User.js             // Mongoose User model (includes emailVerified, credits, free analysis counters)
│   └── routes/
│       ├── authRoutes.js       // Endpoints: register, login, verify email, forgot/reset password
│       ├── fileRoutes.js       // Endpoint: generate S3 presigned URL for direct upload
│       ├── analysisRoutes.js   // Endpoints: /analyze, /reanalyze, etc. (checks free analysis & credits)
│       └── stripeRoutes.js     // Endpoints: create checkout session and handle Stripe webhooks
├── main.wasp                   // Wasp configuration (declares actions, routes, etc.)
└── fly.toml                    // Fly.io deployment configuration (with env variables)


```