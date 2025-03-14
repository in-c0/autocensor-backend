
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

TODO:

Remember to configure S3 bucket with a lifecycle policy to delete objects after 24 hours
