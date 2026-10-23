import type { Request, Response } from 'express';
import { environmentExists } from './environment.controller';
import { equipmentExists } from './gestionequipos.controller';

type IncidentStatus = 'pending' | 'in_progress' | 'resolved';

interface Incident {
  id: string;
  description: string;
  status: IncidentStatus;
  reportedAt: string;
  equipmentId?: string;
  environmentId?: string;
}

const incidents: Incident[] = [];
let nextId = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIncidentStatus = (value: unknown): value is IncidentStatus =>
  value === 'pending' || value === 'in_progress' || value === 'resolved';

export class GestionNovedadesController {
  public static getIncidents = (_req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: incidents
    });
  };

  public static createIncident = (req: Request, res: Response): void => {
    const body: unknown = req.body;

    if (!isRecord(body)) {
      res.status(400).json({
        success: false,
        message: 'El cuerpo de la solicitud debe ser un objeto.'
      });
      return;
    }

    const { description, equipmentId, environmentId } = body;
    const hasEquipmentId = typeof equipmentId === 'string' && equipmentId.trim().length > 0;
    const hasEnvironmentId = typeof environmentId === 'string' && environmentId.trim().length > 0;

    if (
      typeof description !== 'string' ||
      description.trim().length === 0 ||
      hasEquipmentId === hasEnvironmentId ||
      (equipmentId !== undefined && !hasEquipmentId) ||
      (environmentId !== undefined && !hasEnvironmentId)
    ) {
      res.status(400).json({
        success: false,
        message: 'Indica una descripción y exactamente un equipmentId o environmentId válido.'
      });
      return;
    }

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

    const body: unknown = req.body;
    if (!isRecord(body)) {
      res.status(400).json({
        success: false,
        message: 'El cuerpo de la solicitud debe ser un objeto.'
      });
      return;
    }

    if (
      Object.keys(body).length !== 1 ||
      !isIncidentStatus(body.status)
    ) {
      res.status(400).json({
        success: false,
        message: 'Envía únicamente status: pending, in_progress o resolved.'
      });
      return;
    }

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
