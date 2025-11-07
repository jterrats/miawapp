import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';

type MiawPlugin = {
  initialize(opts: {
    orgId: string;
    developerName: string;
    serviceUrl: string;
    configFileName: string;
  }): Promise<void>;
  openConversation(): Promise<void>;
  closeConversation(): Promise<void>;
};

const Miaw = registerPlugin<MiawPlugin>('SFMiawPlugin');

@Injectable({ providedIn: 'root' })
export class MiawService {
  async init() {
    await Miaw.initialize({
      orgId: '',
      developerName: '',
      serviceUrl: '',
      configFileName: 'configFile.json'
    });
    console.log('Miaw initialized');
  }

  open() { return Miaw.openConversation(); }
  close() { return Miaw.closeConversation(); }
}
