import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Home = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [transcriptionStatus, setTranscriptionStatus] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Handle file upload to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('api/file/upload-video', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setUploading(false);
        setUploadStatus('success');

        // Poll for transcription status after successful upload
        pollTranscriptionStatus(data.transcribeJob.TranscriptionJob.TranscriptionJobName);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error(error);
      setUploading(false);
      setUploadStatus('error');
    }
  };

  const pollTranscriptionStatus = (jobName) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/get/transcribe-file?jobName=${jobName}`); // Send jobName as a query parameter
  
        // Get and log the content type for debugging
        const contentType = response.headers.get('Content-Type');
        // console.log('Content-Type:', contentType);
  
        // Check if contentType contains 'text/srt' or 'application/json'
        if (contentType.includes('text/srt')) {
          // If the response is an SRT file, download it
          clearInterval(interval);
  
          // Create a Blob from the response body
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
  
          // Create a link to download the file
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `transcription-${jobName}.srt`);
  
          document.body.appendChild(link);
          link.click();
  
          setUploadStatus('completed');
          setTranscriptionStatus("completed")
        } else if (contentType.includes('application/json')) {
          // If the response is JSON, handle the transcription status
          const data = await response.json();
          const status = data.status;
  
          setTranscriptionStatus(status);
  
          if (status === 'COMPLETED') {
            clearInterval(interval); // Stop polling once transcription is done
          }
        } else {
          throw new Error(`Unexpected content type: ${contentType}`);
        }
      } catch (error) {
        console.error('Error fetching transcription status:', error);
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds
  };
  
  
  
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Video Subtitle Generator</CardTitle>
          <p className="text-center text-gray-500">
            Upload your video or audio file, and we'll generate subtitles for you!
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept="audio/*,video/*"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              {file ? (
                <span className="text-sm text-gray-600">{file.name}</span>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-600">
                    Select an audio or video file
                  </span>
                </div>
              )}
            </label>
          </div>
          {uploading && (
            <div className="mb-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2 text-center">{uploadProgress}% uploaded</p>
            </div>
          )}
          {uploadStatus === 'success' && (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your file has been uploaded. Subtitles are being generated.</AlertDescription>
            </Alert>
          )}
          {uploadStatus === 'error' && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>There was an error uploading your file. Please try again.</AlertDescription>
            </Alert>
          )}
          {transcriptionStatus && transcriptionStatus === 'IN_PROGRESS' && (
            <p className="text-sm text-blue-500 text-center mb-4">Transcription is in progress...</p>
          )}
          {uploadStatus === 'completed' && (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Transcription Complete</AlertTitle>
              <AlertDescription>Your subtitles are ready!</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading} 
            className="w-full"
          >
            {uploading ? <><Loader2/> Generating subtitle</> : 'Upload and Generate Subtitles'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
