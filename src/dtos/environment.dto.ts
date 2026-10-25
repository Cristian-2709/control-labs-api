export interface ICreateEnvironmentDTO {
  name: string;
  capacity: number;
  location: string;
  operational?: boolean;
}

export interface IUpdateEnvironmentDTO {
  capacity?: number;
  operational?: boolean;
}
