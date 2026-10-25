import type { NextFunction, Request, Response } from 'express';
import type {
  ICreateEquipmentDTO,
  IUpdateEquipmentDTO,
  TechnicalStatus
} from '../dtos/equipment.dto';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isTechnicalStatus = (value: unknown): value is TechnicalStatus =>
  value === 'operational' || value === 'maintenance' || value === 'out_of_service';

const isCreateEquipmentDTO = (value: unknown): value is ICreateEquipmentDTO => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === 'string' &&
    value.name.trim() !== '' &&
    typeof value.environmentId === 'string' &&
    value.environmentId.trim() !== '' &&
    (value.technicalStatus === undefined || isTechnicalStatus(value.technicalStatus)) &&
    (value.location === undefined ||
      (typeof value.location === 'string' && value.location.trim() !== ''))
  );
};

const isUpdateEquipmentDTO = (value: unknown): value is IUpdateEquipmentDTO => {
  if (!isRecord(value)) {
    return false;
  }

  const fields = Object.keys(value);
  return (
    fields.length > 0 &&
    fields.every((field) => field === 'technicalStatus' || field === 'location') &&
    (value.technicalStatus === undefined || isTechnicalStatus(value.technicalStatus)) &&
    (value.location === undefined ||
      (typeof value.location === 'string' && value.location.trim() !== ''))
  );
};

export const validateCreateEquipmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isCreateEquipmentDTO(body)) {
    res.status(400).json({
      success: false,
      message: 'Indica name, environmentId válido y, opcionalmente, technicalStatus y location válidos.'
    });
    return;
  }
  next();
};

export const validateUpdateEquipmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateEquipmentDTO(body)) {
    res.status(400).json({
      success: false,
      message: 'Envía technicalStatus válido y/o una location no vacía.'
    });
    return;
  }
  next();
};
