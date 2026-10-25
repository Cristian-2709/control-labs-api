import type { NextFunction, Request, Response } from 'express';
import type { IUserDTO } from '../dtos/user.dto';

const isUserDTO = (value: unknown): value is IUserDTO =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const validateUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isUserDTO(body)) {
    res.status(400).json({
      success: false,
      message: 'El cuerpo de la solicitud debe ser un objeto.'
    });
    return;
  }

  next();
};
