export type TechnicalStatus = 'operational' | 'maintenance' | 'out_of_service';

export interface ICreateEquipmentDTO {
  name: string;
  environmentId: string;
  technicalStatus?: TechnicalStatus;
  location?: string;
}

export interface IUpdateEquipmentDTO {
  technicalStatus?: TechnicalStatus;
  location?: string;
}
