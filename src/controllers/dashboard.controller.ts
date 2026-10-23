import type { Request, Response } from 'express';
import { getActiveEnvironmentCount } from './environment.controller';
import { getOperationalEquipmentCount } from './gestionequipos.controller';
import { getUnresolvedCriticalIncidentCount } from './gestion-novedades.controller';
import { UserController } from './user.controller';

export class DashboardController {
  public static getSummary = (_req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: {
        users: UserController.getUserCount(),
        activeEnvironments: getActiveEnvironmentCount(),
        operationalEquipment: getOperationalEquipmentCount(),
        unresolvedCriticalIncidents: getUnresolvedCriticalIncidentCount()
      }
    });
  };
}
