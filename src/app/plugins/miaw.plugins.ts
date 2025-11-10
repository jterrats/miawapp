import { registerPlugin } from '@capacitor/core';

export interface MiawPlugin {
  initialize(options?: {
    configFileName?: string;
    Url?: string;
    OrganizationId?: string;
    DeveloperName?: string;
  }): Promise<{ status: string }>;

  openConversation(): Promise<{ status: string }>;
  closeConversation(): Promise<{ status: string }>;
}

export const Miaw = registerPlugin<MiawPlugin>('Miaw');