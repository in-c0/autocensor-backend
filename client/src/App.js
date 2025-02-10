// client/src/App.js
import React, { useState } from 'react';
import VideoEditor from './components/VideoEditor';
import axios from 'axios';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [censorshipData, setCensorshipData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection.
  const onFileChange = (e) => {
    if (e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
      // In a production app, you might upload the file to cloud storage and obtain a URL.
    }
  };

  // Example: Submit file to backend for transcription via the Wasp action.
  const onTranscribe = async () => {
    if (!videoFile) return;
    setLoading(true);
    try {
      // For demonstration, we convert the file to an ArrayBuffer.
      // In production, consider using a proper file upload mechanism.
      const fileData = await videoFile.arrayBuffer();
      // Call the Wasp action “TranscribeAudio”. (Adjust URL as Wasp generates.)
      const response = await axios.post('/api/TranscribeAudio', { fileUrl: fileData });
      setTranscript(response.data);
      // Process the transcript to determine censorship segments.
      // For example, let’s assume that the API returns an array like:
      // [ { start: 12.5, end: 13.0, word: "badword", effect: "Beep" }, ... ]
      // For our demo, we simulate one segment.
      setCensorshipData([
        { start: 5.0, end: 5.5, effect: 'Beep' }
      ]);
    } catch (err) {
      console.error('Transcription error:', err.message);
      alert('Transcription failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>AutoCensor</h1>
      <input type="file" accept="video/*,audio/*" onChange={onFileChange} />
      <button onClick={onTranscribe} disabled={!videoFile || loading}>
        {loading ? 'Transcribing...' : 'Transcribe & Analyze'}
      </button>
      {videoFile && (
        <VideoEditor videoFile={videoFile} censorshipData={censorshipData} />
      )}
      {transcript && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Transcript</h3>
          <pre>{JSON.stringify(transcript, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
