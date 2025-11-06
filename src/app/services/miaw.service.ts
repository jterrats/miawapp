import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';

type MiawPlugin = {
  initialize(opts: {
    orgId: string;
    developerName: string;
    serviceUrl: string;
  }): Promise<void>;
  openConversation(): Promise<void>;
  closeConversation(): Promise<void>;
};

const Miaw = registerPlugin<MiawPlugin>('SFMiawPlugin');

@Injectable({ providedIn: 'root' })
export class MiawService {
  async init() {
    await Miaw.initialize({
      orgId: '00DO300000EnBAL',
      developerName: 'SC_AComerClubMobile',
      serviceUrl: 'https://loyaltysfgrg--uat.sandbox.my.salesforce-scrt.com'
    });
    console.log('Miaw initialized');
  }

  open() { return Miaw.openConversation(); }
  close() { return Miaw.closeConversation(); }
}
