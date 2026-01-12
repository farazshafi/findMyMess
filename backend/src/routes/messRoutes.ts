import { Router } from 'express';
import { MessController } from '../controllers/MessController';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', MessController.getAll);
router.get('/:id', MessController.getById);

router.post('/', (req, res, next) => {
    upload.single('logo')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ error: 'File upload error', details: err });
        }
        next();
    });
}, MessController.create);

router.put('/:id', (req, res, next) => {
    upload.single('logo')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ error: 'File upload error', details: err });
        }
        next();
    });
}, MessController.update);
router.delete('/:id', MessController.delete);

export default router;
