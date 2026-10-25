import type { Request, Response } from 'express';
import type {
  ICreateEquipmentDTO,
  IUpdateEquipmentDTO,
  TechnicalStatus
} from '../dtos/equipment.dto';
import { environmentExists } from './environment.controller';

interface Equipment {
  id: string;
  name: string;
  environmentId: string;
  technicalStatus: TechnicalStatus;
  location?: string;
}

const equipmentList: Equipment[] = [];
let nextId = 1;

const isTechnicalStatus = (value: unknown): value is TechnicalStatus =>
  value === 'operational' || value === 'maintenance' || value === 'out_of_service';

export const equipmentExists = (id: string): boolean =>
  equipmentList.some((equipment) => equipment.id === id);

export const getOperationalEquipmentCount = (): number =>
  equipmentList.filter((equipment) => equipment.technicalStatus === 'operational').length;

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
    const { name, environmentId, technicalStatus, location } = req.body as ICreateEquipmentDTO;

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

    const body = req.body as IUpdateEquipmentDTO;

    const currentEquipment = equipmentList[equipmentIndex];
    if (!currentEquipment) {
      res.status(404).json({
        success: false,
        message: `No se encontró el equipo ${id}.`
      });
      return;
    }

    const updates: Partial<Pick<Equipment, 'technicalStatus' | 'location'>> = {};

    if (body.technicalStatus !== undefined) {
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
