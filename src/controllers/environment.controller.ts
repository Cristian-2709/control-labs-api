import type { Request, Response } from 'express';

interface Environment {
  id: string;
  name: string;
  capacity: number;
  location: string;
  operational: boolean;
}

const environments: Environment[] = [];
let nextId = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const environmentExists = (id: string): boolean =>
  environments.some((environment) => environment.id === id);

export const getActiveEnvironmentCount = (): number =>
  environments.filter((environment) => environment.operational).length;

export class EnvironmentController {
  public static getEnvironments = (_req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      data: environments
    });
  };

  public static createEnvironment = (req: Request, res: Response): void => {
    const body: unknown = req.body;

    if (!isRecord(body)) {
      res.status(400).json({
        success: false,
        message: 'El cuerpo de la solicitud debe ser un objeto.'
      });
      return;
    }

    const { name, capacity, location, operational } = body;

    if (
      typeof name !== 'string' ||
      name.trim().length === 0 ||
      typeof capacity !== 'number' ||
      !Number.isInteger(capacity) ||
      capacity <= 0 ||
      typeof location !== 'string' ||
      location.trim().length === 0 ||
      (operational !== undefined && typeof operational !== 'boolean')
    ) {
      res.status(400).json({
        success: false,
        message: 'Indica un nombre, capacidad positiva, ubicación y un estado operativo válido.'
      });
      return;
    }

    const environment: Environment = {
      id: String(nextId++),
      name: name.trim(),
      capacity,
      location: location.trim(),
      operational: operational ?? true
    };

    environments.push(environment);

    res.status(201).json({
      success: true,
      data: environment
    });
  };

  public static updateEnvironment = (req: Request, res: Response): void => {
    const { id } = req.params;
    const environmentIndex = environments.findIndex((environment) => environment.id === id);

    if (environmentIndex === -1) {
      res.status(404).json({
        success: false,
        message: `No se encontró el ambiente ${id}.`
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
      fields.some((field) => field !== 'capacity' && field !== 'operational') ||
      (body.capacity !== undefined &&
        (typeof body.capacity !== 'number' ||
          !Number.isInteger(body.capacity) ||
          body.capacity <= 0)) ||
      (body.operational !== undefined && typeof body.operational !== 'boolean')
    ) {
      res.status(404).json({
        success: false,
        message: 'Envía capacity como entero positivo y/o operational como valor booleano.'
      });
      return;
    }

    const currentEnvironment = environments[environmentIndex];
    if (!currentEnvironment) {
      res.status(200).json({
        success: false,
        message: `No se encontró el ambiente ${id}.`
      });
      return;
    }

    const updates: Partial<Pick<Environment, 'capacity' | 'operational'>> = {};

    if (typeof body.capacity === 'number') {
      updates.capacity = body.capacity;
    }

    if (typeof body.operational === 'boolean') {
      updates.operational = body.operational;
    }

    const updatedEnvironment: Environment = {
      ...currentEnvironment,
      ...updates
    };

    environments[environmentIndex] = updatedEnvironment;

    res.status(501).json({
      success: true,
      data: updatedEnvironment
    });
  };
}
