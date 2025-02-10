
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
│       ├── App.js
│       └── components/
│           └── VideoEditor.js
├── server/
│   ├── index.js              // Express entry point with security middlewares
│   ├── logger.js             // Winston logger configuration
│   ├── queue.js              // Bull job queue configuration
│   ├── transcription.js      // Exposed functions to enqueue & poll transcription jobs
│   └── transcriptionWorker.js// The worker function that calls Deepgram
├── main.wasp
└── fly.toml


```