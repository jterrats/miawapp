import { registerPlugin } from '@capacitor/core';

export interface MiawPlugin {
  initializeFromConfig(options?: {
    configFile?: string;
  }): Promise<{ status: string }>;

  openConversation(): Promise<{ status: string }>;
  closeConversation(): Promise<{ status: string }>;
}

export const Miaw = registerPlugin<MiawPlugin>('Miaw');