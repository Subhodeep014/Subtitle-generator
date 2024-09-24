import { TranscribeClient, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import dotenv from 'dotenv';
import fs from 'fs';
import fetch from 'node-fetch';

dotenv.config();

const transcribe = new TranscribeClient({ region: process.env.AWS_REGION });

// Helper function to format time from seconds to hh:mm:ss,ms
const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
};

// Function to convert transcription JSON to SRT
const generateSrtFile = (items) => {
  let srtContent = '';
  let subtitleIndex = 1;

  items.forEach(item => {
    if (item.type === 'pronunciation') {
      const startTime = parseFloat(item.start_time);
      const endTime = parseFloat(item.end_time);
      const text = item.alternatives[0].content;

      // SRT Block
      srtContent += `${subtitleIndex}\n`;
      srtContent += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
      srtContent += `${text}\n\n`;

      subtitleIndex++;
    }
  });

  return srtContent;
};

// Function to get transcription job status and download result from S3
export const downloadTranscribeFile = async (req, res) => {
  const { jobName } = req.query;

  try {
    // Get Transcription Job Status
    const params = {
      TranscriptionJobName: jobName,
    };

    const data = await transcribe.send(new GetTranscriptionJobCommand(params));
    const status = data?.TranscriptionJob?.TranscriptionJobStatus;

    if (status === 'COMPLETED') {
      // Fetch the transcript file from S3
      const transcriptUri = data.TranscriptionJob.Transcript.TranscriptFileUri;

      const response = await fetch(transcriptUri);
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch transcript from S3' });
      }
      const transcriptData = await response.json(); // Contains the transcription text

      // Generate SRT file content
      const srtContent = generateSrtFile(transcriptData.results.items);

      // Write the SRT file to the file system (optional)
      const srtFileName = `transcription-${jobName}.srt`;
      fs.writeFileSync(srtFileName, srtContent);

      // Send the SRT content as a downloadable file
      res.setHeader('Content-Disposition', `attachment; filename="${srtFileName}"`);
      res.setHeader('Content-Type', 'text/srt');
      return res.send(srtContent); // This ends the request and sends the file content

    } else {
      // If transcription is not completed, return the current status
      return res.status(200).json({ status });
    }

  } catch (error) {
    console.error('Error fetching transcription status:', error);
    return res.status(500).json({ error: 'Failed to fetch transcription status' });
  }
};
