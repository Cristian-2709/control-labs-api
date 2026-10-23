import type { Request, Response } from 'express';
import { environmentExists } from './environment.controller';

type TechnicalStatus = 'operational' | 'maintenance' | 'out_of_service';

interface Equipment {
  id: string;
  name: string;
  environmentId: string;
  technicalStatus: TechnicalStatus;
  location?: string;
}

const equipmentList: Equipment[] = [];
let nextId = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isTechnicalStatus = (value: unknown): value is TechnicalStatus =>
  value === 'operational' || value === 'maintenance' || value === 'out_of_service';

export const equipmentExists = (id: string): boolean =>
  equipmentList.some((equipment) => equipment.id === id);

export class GestionEquiposController {
  public static getEquipment = (req: Request, res: Response): void => {
    const { environmentId } = req.query;

    if (environmentId !== undefined && typeof environmentId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'El filtro environmentId debe ser un solo identificador.'
      });
      return;
    }

    const results = typeof environmentId === 'string'
      ? equipmentList.filter((equipment) => equipment.environmentId === environmentId)
      : equipmentList;

    res.status(200).json({
      success: true,
      data: results
    });
  };

  public static createEquipment = (req: Request, res: Response): void => {
    const body: unknown = req.body;

    if (!isRecord(body)) {
      res.status(400).json({
        success: false,
        message: 'El cuerpo de la solicitud debe ser un objeto.'
      });
      return;
    }

    const { name, environmentId, technicalStatus, location } = body;

    if (
      typeof name !== 'string' ||
      name.trim().length === 0 ||
      typeof environmentId !== 'string' ||
      environmentId.trim().length === 0 ||
      (technicalStatus !== undefined && !isTechnicalStatus(technicalStatus)) ||
      (location !== undefined && (typeof location !== 'string' || location.trim().length === 0))
    ) {
      res.status(400).json({
        success: false,
        message: 'Indica name, environmentId válido y, opcionalmente, technicalStatus y location válidos.'
      });
      return;
    }

    if (!environmentExists(environmentId)) {
      res.status(404).json({
        success: false,
        message: `No se encontró el ambiente ${environmentId}.`
      });
      return;
    }

    const equipment: Equipment = {
      id: String(nextId++),
      name: name.trim(),
      environmentId,
      technicalStatus: isTechnicalStatus(technicalStatus) ? technicalStatus : 'operational',
      ...(typeof location === 'string' ? { location: location.trim() } : {})
    };

    equipmentList.push(equipment);

    res.status(201).json({
      success: true,
      data: equipment
    });
  };

  public static updateEquipment = (req: Request, res: Response): void => {
    const { id } = req.params;
    const equipmentIndex = equipmentList.findIndex((equipment) => equipment.id === id);

    if (equipmentIndex === -1) {
      res.status(404).json({
        success: false,
        message: `No se encontró el equipo ${id}.`
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

    const fields = Object.keys(body);
    if (
      fields.length === 0 ||
      fields.some((field) => field !== 'technicalStatus' && field !== 'location') ||
      (body.technicalStatus !== undefined && !isTechnicalStatus(body.technicalStatus)) ||
      (body.location !== undefined &&
        (typeof body.location !== 'string' || body.location.trim().length === 0))
    ) {
      res.status(400).json({
        success: false,
        message: 'Envía technicalStatus válido y/o una location no vacía.'
      });
      return;
    }

    const currentEquipment = equipmentList[equipmentIndex];
    if (!currentEquipment) {
      res.status(404).json({
        success: false,
        message: `No se encontró el equipo ${id}.`
      });
      return;
    }

    const updates: Partial<Pick<Equipment, 'technicalStatus' | 'location'>> = {};

    if (isTechnicalStatus(body.technicalStatus)) {
      updates.technicalStatus = body.technicalStatus;
    }

    if (typeof body.location === 'string') {
      updates.location = body.location.trim();
    }

    const updatedEquipment: Equipment = {
      ...currentEquipment,
      ...updates
    };

    equipmentList[equipmentIndex] = updatedEquipment;

    res.status(200).json({
      success: true,
      data: updatedEquipment
    });
  };
}
