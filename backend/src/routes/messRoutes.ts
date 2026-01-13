import { Router } from 'express';
import { MessController } from '../controllers/MessController';
import { upload } from '../middleware/uploadMiddleware';
import { adminAuth } from '../middleware/adminAuth';
import rateLimit from 'express-rate-limit';

const router = Router();

const submissionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 submissions per windowMs
    message: 'Too many submissions from this IP, please try again after 15 minutes'
});

router.get('/', MessController.getAll);
router.get('/pending', adminAuth, MessController.getPending);
router.get('/:id', MessController.getById);

router.post('/', submissionLimiter, (req, res, next) => {
    upload.single('logo')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ error: 'File upload error', details: err });
        }
        next();
    });
}, MessController.create);

router.patch('/:id/status', adminAuth, MessController.updateStatus);

router.put('/:id', adminAuth, (req, res, next) => {
    upload.single('logo')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ error: 'File upload error', details: err });
        }
        next();
    });
}, MessController.update);

router.delete('/:id', adminAuth, MessController.delete);

export default router;
