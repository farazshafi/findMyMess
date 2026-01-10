import { Router } from 'express';
import { MessController } from '../controllers/MessController';

const router = Router();

router.get('/', MessController.getAll);
router.get('/:id', MessController.getById);
router.post('/', MessController.create);
router.put('/:id', MessController.update);
router.delete('/:id', MessController.delete);

export default router;
