import type { Request, Response } from 'express';
import type {
  ICreateIncidentDTO,
  IUpdateIncidentDTO,
  IncidentPriority,
  IncidentStatus
} from '../dtos/incident.dto';
import { environmentExists } from './environment.controller';
import { equipmentExists } from './gestionequipos.controller';

interface Incident {
  id: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  reportedAt: string;
  equipmentId?: string;
  environmentId?: string;
}

const incidents: Incident[] = [];
let nextId = 1;

const isIncidentPriority = (value: unknown): value is IncidentPriority =>
  value === 'critical' || value === 'normal';

export const getUnresolvedCriticalIncidentCount = (): number =>
  incidents.filter((incident) => incident.priority === 'critical' && incident.status !== 'resolved').length;

export class GestionNovedadesController {
  public static getIncidents = (_req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: incidents
    });
  };

  public static createIncident = (req: Request, res: Response): void => {
    const { description, equipmentId, environmentId, priority } = req.body as ICreateIncidentDTO;
    const hasEquipmentId = equipmentId !== undefined;
    const hasEnvironmentId = environmentId !== undefined;

    if (hasEquipmentId && !equipmentExists(equipmentId)) {
      res.status(404).json({
        success: false,
        message: `No se encontró el equipo ${equipmentId}.`
      });
      return;
    }

    if (hasEnvironmentId && !environmentExists(environmentId)) {
      res.status(404).json({
        success: false,
        message: `No se encontró el ambiente ${environmentId}.`
      });
      return;
    }

    const incident: Incident = {
      id: String(nextId++),
      description: description.trim(),
      status: 'pending',
      priority: isIncidentPriority(priority) ? priority : 'normal',
      reportedAt: new Date().toISOString(),
      ...(hasEquipmentId ? { equipmentId } : {}),
      ...(hasEnvironmentId ? { environmentId } : {})
    };

    incidents.push(incident);

    res.status(201).json({
      success: true,
      data: incident
    });
  };

  public static updateIncident = (req: Request, res: Response): void => {
    const { id } = req.params;
    const incidentIndex = incidents.findIndex((incident) => incident.id === id);

    if (incidentIndex === -1) {
      res.status(404).json({
        success: false,
        message: `No se encontró la novedad ${id}.`
      });
      return;
    }

    const body = req.body as IUpdateIncidentDTO;

    const currentIncident = incidents[incidentIndex];
    if (!currentIncident) {
      res.status(404).json({
        success: false,
        message: `No se encontró la novedad ${id}.`
      });
      return;
    }

    const updatedIncident: Incident = {
      ...currentIncident,
      status: body.status
    };

    incidents[incidentIndex] = updatedIncident;

    res.status(200).json({
      success: true,
      data: updatedIncident
    });
  };
}
