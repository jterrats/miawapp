import { registerPlugin } from '@capacitor/core';

export interface MiawPlugin {
  initialize(options?: {
    configFileName?: string;
    Url?: string;
    OrganizationId?: string;
    DeveloperName?: string;
    userVerificationRequired?: boolean;
  }): Promise<{ status: string }>;

  setBackendUrl(options: { backendUrl: string }): Promise<{ status: string }>;
  setAuthenticatedUser(options: { email: string }): Promise<{ status: string }>;

  openConversation(): Promise<{ status: string }>;
  closeConversation(): Promise<{ status: string }>;
  logout(): Promise<{ status: string }>;
}

export const Miaw = registerPlugin<MiawPlugin>('Miaw');