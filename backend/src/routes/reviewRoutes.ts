import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';

const router = Router();

router.get('/mess/:messId', ReviewController.getByMessId);
router.post('/', ReviewController.create);

export default router;
