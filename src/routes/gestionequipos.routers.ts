import { Router } from 'express';
import { GestionEquiposController } from '../controllers/gestionequipos.controller';
import {
  validateCreateEquipmentPayload,
  validateUpdateEquipmentPayload
} from '../middlewares/validateEquipment.middleware';

const router = Router();

router.get('/', GestionEquiposController.getEquipment);
router.post('/', validateCreateEquipmentPayload, GestionEquiposController.createEquipment);
router.patch('/:id', validateUpdateEquipmentPayload, GestionEquiposController.updateEquipment);

export default router;
