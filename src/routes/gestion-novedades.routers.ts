import { Router } from 'express';
import { GestionNovedadesController } from '../controllers/gestion-novedades.controller';
import {
  validateCreateIncidentPayload,
  validateUpdateIncidentPayload
} from '../middlewares/validateIncident.middleware';

const router = Router();

router.get('/', GestionNovedadesController.getIncidents);
router.post('/', validateCreateIncidentPayload, GestionNovedadesController.createIncident);
router.patch('/:id', validateUpdateIncidentPayload, GestionNovedadesController.updateIncident);

export default router;
