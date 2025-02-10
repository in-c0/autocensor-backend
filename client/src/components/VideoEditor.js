// client/src/components/VideoEditor.js
import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

function VideoEditor({ videoFile, censorshipData }) {
  const [ready, setReady] = useState(false);
  const [outputVideoUrl, setOutputVideoUrl] = useState(null);
  const [processing, setProcessing] = useState(false);

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

  // Build a dynamic filter_complex string based on multiple flagged segments.
  const buildFilterGraph = (segments) => {
    // Write each effect file into the FS and build an input mapping.
    let filterInputs = [];
    let filterDelays = [];
    segments.forEach((segment, index) => {
      const effectFile = `${segment.effect.toLowerCase()}.mp3`;
      // Each effect file should have been preloaded in FFmpeg FS.
      filterInputs.push(`[${index + 1}:a]adelay=${Math.floor(segment.start * 1000)}|${Math.floor(segment.start * 1000)}[sfx${index}]`);
      // Later, all effect audio streams will be mixed.
      filterDelays.push(`[sfx${index}]`);
    });
    // Combine original audio [0:a] with all delayed effect streams.
    const mixInputs = ['[0:a]', ...filterDelays].join('');
    const filterGraph = `${filterInputs}; ${mixInputs}amix=inputs=${segments.length + 1}:duration=first:dropout_transition=2[aout]`;
    return filterGraph;
  };

  const handleEditVideo = async () => {
    if (!ready) return;
    setProcessing(true);

    try {
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

      // Preload all sound effect files.
      const effects = ['beep', 'honk', 'mute', 'quack', 'boom', 'trumpet'];
      for (const effect of effects) {
        const res = await fetch(`/sound-effects/${effect}.mp3`);
        if (!res.ok) throw new Error(`Failed to load sound effect ${effect}.mp3`);
        const effectData = new Uint8Array(await res.arrayBuffer());
        ffmpeg.FS('writeFile', `${effect}.mp3`, effectData);
      }

      let args = [];
      if (censorshipData && censorshipData.length > 0) {
        // Build input arguments: original video plus one input per sound effect (order matters).
        args = ['-i', 'input.mp4'];
        // Add each sound effect file as a separate input (assume each flagged segment uses its corresponding effect).
        censorshipData.forEach((segment) => {
          args.push('-i', `${segment.effect.toLowerCase()}.mp3`);
        });
        const filterComplex = buildFilterGraph(censorshipData);
        args.push('-filter_complex', filterComplex, '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', 'output.mp4');
      } else {
        args = ['-i', 'input.mp4', 'output.mp4'];
      }

      await ffmpeg.run(...args);

      const data = ffmpeg.FS('readFile', 'output.mp4');
      const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
      setOutputVideoUrl(URL.createObjectURL(videoBlob));
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
