
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
│       ├── App.js                  // Main page (file upload, credit purchase UI, etc.)
│       └── components/
│           ├── FileUpload.js       // Handles S3 presigned URL upload with progress
│           └── VideoEditor.js      // Uses ffmpeg.wasm to overlay sound effects dynamically
├── server/
│   ├── index.js                    // Express entry point (mounts routes, security middleware, etc.)
│   ├── logger.js                   // Winston logger configuration
│   ├── s3.js                       // AWS S3 integration (presigned URL generation)
│   ├── stripe.js                   // Stripe integration (checkout session creation)
│   ├── queue.js                    // Bull queue configuration (for transcription/analysis jobs)
│   ├── transcription.js            // API functions to enqueue transcription/analysis jobs and check credit usage
│   ├── transcriptionWorker.js      // Worker that calls Deepgram and processes the file
│   ├── models/
│   │   ├── User.js                 // Extended Mongoose User model (with password reset tokens, credits, etc.)
│   │   └── AnalysisResult.js       // New model to store analysis results
│   └── routes/
│       ├── authRoutes.js           // Endpoints: register, login, email verification, password reset (with token storage/verification)
│       ├── fileRoutes.js           // Endpoint: generate S3 presigned URL for direct upload
│       ├── analysisRoutes.js       // Endpoints: /analyze, /reanalyze, etc. (checks free analysis & credits)
│       └── stripeRoutes.js         // Endpoints: create checkout session and handle Stripe webhooks (secured)
├── tests/
│   ├── unit/                       // Jest unit tests (e.g., for auth, S3, analysis)
│   │   └── auth.test.js
│   └── e2e/                        // Cypress end-to-end tests
│       └── fileUpload.spec.js
├── .github/
│   └── workflows/
│       └── nodejs.yml              // GitHub Actions CI/CD pipeline configuration
├── main.wasp                     // Wasp configuration (declares actions, routes, etc.)
└── fly.toml                      // Fly.io deployment configuration

```