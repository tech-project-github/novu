import {
  INotificationTemplateStep,
  IPreferenceChannels,
} from 'libs/shared/dist';

export interface INotificationTemplates {
  create(data: INotificationTemplatePayload);
  update(templateId: string, data: INotificationTemplatePayload);
  delete(templateId: string);
  getOne(templateId: string);
  updateStatus(templateId: string, active: boolean);
}

export interface INotificationTemplatePayload {
  name: string;
  notificationGroupId: string;
  tags?: string[];
  description?: string;
  steps?: INotificationTemplateStep[];
  active?: boolean;
  draft?: boolean;
  critical?: boolean;
  preferenceSettings?: IPreferenceChannels;
}
