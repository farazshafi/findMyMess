import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'findmymess_logos',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    } as any,
});

export const upload = multer({ storage: storage });
