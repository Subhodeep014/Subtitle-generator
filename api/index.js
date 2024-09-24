import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import uploadRouter from './routes/upload.route.js'
import downloadRouter from './routes/download.route.js'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Allow your Vite frontend
    credentials: true,
}));
// app.use(express.json({ limit: '100mb' }));
// app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use("/api/file",uploadRouter);
app.use("/api/get", downloadRouter)
app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`);
})