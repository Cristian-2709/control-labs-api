import { Router } from 'express';
import { GestionNovedadesController } from '../controllers/gestion-novedades.controller';

const router = Router();

router.get('/', GestionNovedadesController.getIncidents);
router.post('/', GestionNovedadesController.createIncident);
router.patch('/:id', GestionNovedadesController.updateIncident);

export default router;
