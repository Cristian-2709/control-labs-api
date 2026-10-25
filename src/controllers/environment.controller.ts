import type { Request, Response } from 'express';
import type { ICreateEnvironmentDTO, IUpdateEnvironmentDTO } from '../dtos/environment.dto';

interface Environment {
  id: string;
  name: string;
  capacity: number;
  location: string;
  operational: boolean;
}

const environments: Environment[] = [];
let nextId = 1;

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
    const { name, capacity, location, operational } = req.body as ICreateEnvironmentDTO;

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

    const body = req.body as IUpdateEnvironmentDTO;

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
