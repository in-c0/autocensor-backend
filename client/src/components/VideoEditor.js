// client/src/components/VideoEditor.js
import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

function VideoEditor({ videoFile, censorshipData }) {
  const [ready, setReady] = useState(false);
  const [outputVideoUrl, setOutputVideoUrl] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Load FFmpeg on component mount.
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        await ffmpeg.load();
        setReady(true);
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
      }
    };
    loadFFmpeg();
  }, []);

  // Handler to process the video.
  const handleEditVideo = async () => {
    if (!ready) return;
    setProcessing(true);

    try {
      // Write the input video file into FFmpeg's in-memory file system.
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

      // Process censorship if there’s at least one segment.
      // (For simplicity, we demo one censorship segment. In production, loop over segments
      //  and construct an appropriate filtergraph.)
      if (censorshipData.length > 0) {
        const segment = censorshipData[0];
        const effectName = segment.effect.toLowerCase(); // e.g., "beep"
        const effectFileName = `${effectName}.mp3`;

        // Fetch the chosen sound effect from the public folder.
        const effectResponse = await fetch(`/sound-effects/${effectFileName}`);
        if (!effectResponse.ok) {
          throw new Error(`Failed to load sound effect: ${effectFileName}`);
        }
        const effectData = new Uint8Array(await effectResponse.arrayBuffer());
        ffmpeg.FS('writeFile', effectFileName, effectData);

        // Calculate delay in milliseconds.
        const delay = Math.floor(segment.start * 1000);
        // Build a filtergraph that delays the effect audio and mixes it with the original audio.
        // This command mutes nothing but overlays the sound effect at the given timestamp.
        // For a production-grade solution you may wish to mute the original audio during the segment.
        const filterComplex = `[1:a]adelay=${delay}|${delay}[sfx]; [0:a][sfx]amix=inputs=2:duration=first:dropout_transition=2[aout]`;

        await ffmpeg.run(
          '-i', 'input.mp4',
          '-i', effectFileName,
          '-filter_complex', filterComplex,
          '-map', '0:v',
          '-map', '[aout]',
          '-c:v', 'copy',
          'output.mp4'
        );
      } else {
        // If there’s no censorship data, simply copy the file.
        await ffmpeg.run('-i', 'input.mp4', 'output.mp4');
      }

      // Read the output file and create a URL.
      const data = ffmpeg.FS('readFile', 'output.mp4');
      const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(videoBlob);
      setOutputVideoUrl(url);
    } catch (error) {
      console.error('Video editing error:', error);
      alert('Video editing failed. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Video Editor</h2>
      {ready ? (
        <button onClick={handleEditVideo} disabled={processing}>
          {processing ? 'Processing Video...' : 'Apply Censorship'}
        </button>
      ) : (
        <p>Loading video processing engine...</p>
      )}
      {outputVideoUrl && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Edited Video</h3>
          <video src={outputVideoUrl} controls width="640" />
        </div>
      )}
    </div>
  );
}

export default VideoEditor;
