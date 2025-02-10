// client/src/components/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onUploadComplete, onError }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadProgress(0);
  };

  const uploadFile = async () => {
    try {
      // Request a presigned URL from the backend.
      const { data } = await axios.post('/api/files/generate-presigned-url', {
        fileName: file.name,
        fileType: file.type,
      });
      const { url, key } = data;

      // Upload the file directly to S3.
      await axios.put(url, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      onUploadComplete({ key, fileUrl: `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/${key}` });
    } catch (error) {
      onError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="video/*,audio/*" />
      {file && <button onClick={uploadFile}>Upload File</button>}
      {uploadProgress > 0 && <progress value={uploadProgress} max="100">{uploadProgress}%</progress>}
    </div>
  );
}

export default FileUpload;
