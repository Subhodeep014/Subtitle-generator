import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { TranscribeClient, StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv'

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Setup AWS S3 and Transcribe clients
const s3 = new S3Client({ region: process.env.AWS_REGION });
const transcribe = new TranscribeClient({ region: process.env.AWS_REGION });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage, 
        limits : {fileSize : 100 * 1024 * 1024} 
    }).single('file'); // Single file upload

export const uploadVideo = async (req, res, next) => { 
  upload(req, res, async (err) => {
    if (err) {
        console.error('Multer Error:', err);
        return res.status(500).json({ error: 'File upload failed' });
    }

    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      // Upload to S3
      const fileContent = fs.readFileSync(path.join(__dirname, '../../uploads/', file.filename));
      const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file.filename, // File name
            Body: fileContent,
        };

      await s3.send(new PutObjectCommand(uploadParams));

      // Start Transcription Job
      const transcriptionParams = {
        TranscriptionJobName: `Transcription-${Date.now()}`,
        LanguageCode: 'en-US', // language options for extending the project if required
        Media: {
          MediaFileUri: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${file.filename}`,
        },
        // OutputBucketName: process.env.S3_BUCKET_NAME, // Save transcript in S3 bucket
        };

        const transcribeJob = await transcribe.send(new StartTranscriptionJobCommand(transcriptionParams));
      
        return res.status(200).json({ message: 'File uploaded and transcription started', transcribeJob });

    }catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'File upload or transcription failed' });
    }
  });
};