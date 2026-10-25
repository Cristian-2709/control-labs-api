import { Router } from 'express';
import { EnvironmentController } from '../controllers/environment.controller';
import {
  validateCreateEnvironmentPayload,
  validateUpdateEnvironmentPayload
} from '../middlewares/validateEnvironment.middleware';

const router = Router();

router.get('/', EnvironmentController.getEnvironments);
router.post('/', validateCreateEnvironmentPayload, EnvironmentController.createEnvironment);
router.patch('/:id', validateUpdateEnvironmentPayload, EnvironmentController.updateEnvironment);

export default router;
