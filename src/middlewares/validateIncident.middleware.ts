import type { NextFunction, Request, Response } from 'express';
import type {
  ICreateIncidentDTO,
  IUpdateIncidentDTO,
  IncidentPriority,
  IncidentStatus
} from '../dtos/incident.dto';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIncidentPriority = (value: unknown): value is IncidentPriority =>
  value === 'critical' || value === 'normal';

const isIncidentStatus = (value: unknown): value is IncidentStatus =>
  value === 'pending' || value === 'in_progress' || value === 'resolved';

const isCreateIncidentDTO = (value: unknown): value is ICreateIncidentDTO => {
  if (!isRecord(value)) {
    return false;
  }

  const hasEquipmentId = typeof value.equipmentId === 'string' && value.equipmentId.trim() !== '';
  const hasEnvironmentId = typeof value.environmentId === 'string' && value.environmentId.trim() !== '';

  return (
    typeof value.description === 'string' &&
    value.description.trim() !== '' &&
    hasEquipmentId !== hasEnvironmentId &&
    (value.equipmentId === undefined || hasEquipmentId) &&
    (value.environmentId === undefined || hasEnvironmentId) &&
    (value.priority === undefined || isIncidentPriority(value.priority))
  );
};

const isUpdateIncidentDTO = (value: unknown): value is IUpdateIncidentDTO =>
  isRecord(value) &&
  Object.keys(value).length === 1 &&
  isIncidentStatus(value.status);

export const validateCreateIncidentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isCreateIncidentDTO(body)) {
    res.status(400).json({
      success: false,
      message: 'Indica una descripción, exactamente un equipmentId o environmentId válido y una prioridad critical o normal.'
    });
    return;
  }
  next();
};

export const validateUpdateIncidentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateIncidentDTO(body)) {
    res.status(400).json({
      success: false,
      message: 'Envía únicamente status: pending, in_progress o resolved.'
    });
    return;
  }
  next();
};
