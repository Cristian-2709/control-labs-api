import type { NextFunction, Request, Response } from 'express';
import type { ICreateEnvironmentDTO, IUpdateEnvironmentDTO } from '../dtos/environment.dto';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isCreateEnvironmentDTO = (value: unknown): value is ICreateEnvironmentDTO => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === 'string' &&
    value.name.trim() !== '' &&
    typeof value.capacity === 'number' &&
    Number.isInteger(value.capacity) &&
    value.capacity > 0 &&
    typeof value.location === 'string' &&
    value.location.trim() !== '' &&
    (value.operational === undefined || typeof value.operational === 'boolean')
  );
};

const isUpdateEnvironmentDTO = (value: unknown): value is IUpdateEnvironmentDTO => {
  if (!isRecord(value)) {
    return false;
  }

  const fields = Object.keys(value);
  return (
    fields.length > 0 &&
    fields.every((field) => field === 'capacity' || field === 'operational') &&
    (value.capacity === undefined ||
      (typeof value.capacity === 'number' &&
        Number.isInteger(value.capacity) &&
        value.capacity > 0)) &&
    (value.operational === undefined || typeof value.operational === 'boolean')
  );
};

export const validateCreateEnvironmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isCreateEnvironmentDTO(body)) {
    res.status(400).json({
      success: false,
      message: 'Indica un nombre, capacidad positiva, ubicación y un estado operativo válido.'
    });
    return;
  }
  next();
};

export const validateUpdateEnvironmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  if (!isUpdateEnvironmentDTO(body)) {
    res.status(400).json({
      success: false,
      message: 'Envía capacity como entero positivo y/o operational como valor booleano.'
    });
    return;
  }
  next();
};
