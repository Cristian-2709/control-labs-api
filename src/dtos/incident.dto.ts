export type IncidentStatus = 'pending' | 'in_progress' | 'resolved';
export type IncidentPriority = 'critical' | 'normal';

export interface ICreateIncidentDTO {
  description: string;
  equipmentId?: string;
  environmentId?: string;
  priority?: IncidentPriority;
}

export interface IUpdateIncidentDTO {
  status: IncidentStatus;
}
