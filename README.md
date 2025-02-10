
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
│   │       ├── ... etc.
│   └── src/
│       ├── App.js
│       └── components/
│           └── VideoEditor.js
├── server/
│   └── transcription.js
├── main.wasp
└── fly.toml

```