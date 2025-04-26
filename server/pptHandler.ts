import fs from 'fs';
import path from 'path';
import multer from 'multer';
import JSZip from 'jszip';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

// Create uploads directory if it doesn't exist
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');

// Initialize directories
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
  console.log('Created uploads directory');
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR);
  console.log('Created images directory');
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp and original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configure file filter to accept only image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG) are allowed'));
  }
};

// Configure upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

/**
 * Upload images for TAT from the admin dashboard.
 * This middleware is already configured to accept only JPG/PNG images
 * and save them in the 'uploads/images' directory.
 */
export const uploadTATImages = upload.single('tatImage'); // Use this middleware for single image uploads

/**
 * Get a random set of 11 images for the TAT test.
 * This function ensures the images are fetched from the 'uploads/images' directory
 * and returns their paths relative to the server.
 * 
 * @returns Array of image URLs to be sent to the TAT.tsx file.
 */
export async function getRandomTATImageSet(): Promise<string[]> {
  try {
    const imageFiles = fs.readdirSync(IMAGES_DIR).filter(file => /\.(jpg|jpeg|png)$/i.test(file));

    if (imageFiles.length < 11) {
      throw new Error('Not enough images available. At least 11 images are required.');
    }

    const randomImages = getRandomItems(imageFiles, 11);
    return randomImages.map(file => `/uploads/images/${file}`); // Paths relative to the server

  } catch (error) {
    console.error('Error fetching random images:', error);
    throw error;
  }
}

// Utility function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Middleware to handle file upload errors
export function handleUploadErrors(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
}

/**
 * Extract images from a .pptx file and save them to the images directory.
 * This function is used to process .pptx files and extract images for TAT.
 * @param pptxFilePath Path to the .pptx file.
 * @returns Array of saved image file paths.
 */
export async function extractImagesFromPPTX(pptxFilePath: string): Promise<string[]> {
  const imagePaths: string[] = [];

  try {
    const pptxData = fs.readFileSync(pptxFilePath);
    const zip = await JSZip.loadAsync(pptxData);

    // Iterate through the files in the .pptx archive
    for (const fileName of Object.keys(zip.files)) {
      if (fileName.startsWith('ppt/media/') && /\.(jpg|jpeg|png)$/i.test(fileName)) {
        const fileData = await zip.files[fileName].async('nodebuffer');
        const outputFilePath = path.join(IMAGES_DIR, path.basename(fileName));
        fs.writeFileSync(outputFilePath, fileData);
        imagePaths.push(`/uploads/images/${path.basename(fileName)}`);
      }
    }
  } catch (error) {
    console.error('Error extracting images from PPTX:', error);
    throw error;
  }

  return imagePaths;
}

const router = express.Router();

/**
 * POST API to upload TAT images.
 * Uses the `uploadTATImages` middleware to handle file uploads.
 */
router.post('/api/tat/images', uploadTATImages, (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `../uploads/images/${req.file.filename}`;
    res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;