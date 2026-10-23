import { Router } from 'express';
import { GestionEquiposController } from '../controllers/gestionequipos.controller';

const router = Router();

router.get('/', GestionEquiposController.getEquipment);
router.post('/', GestionEquiposController.createEquipment);
router.patch('/:id', GestionEquiposController.updateEquipment);

export default router;
