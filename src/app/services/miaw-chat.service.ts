import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Miaw } from 'capacitor-salesforce-miaw';

interface InitializeOptions {
  serviceUrl?: string;
  orgId?: string;
  developerName?: string;
  configFileName?: string;
}

@Injectable({ providedIn: 'root' })

export class MiawChatService {
  private initialized = false;
  private initializing = false;

  private config: InitializeOptions = {
    configFileName: 'configFile.json'
  };

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      if(this.platform.is('capacitor')) {
        this.init().catch(err => console.error('Error initializing Miaw', err));
      }
    });
  }

  private async init(): Promise<void> {
    if (this.initialized || this.initializing) return;
    this.initializing = true;
    try {
      await Miaw.initialize(this.config);
      this.initialized = true;
    } catch (err) {
      console.error('Error initializing Miaw', err);
    } finally {
      this.initializing = false;
    }
  }

  async openConversation() : Promise<void> {
    if (!this.initialized) return;
    try {
      await Miaw.openConversation();
    } catch (err) {
      console.error('Error opening Miaw', err);
      throw err;
    }
  }

  async closeConversation(): Promise<void> {
    if (!this.initialized) return;
    try {
      await Miaw.closeConversation();
    } catch (err) {
      console.error('Error closing Miaw', err);
      throw err;
    }
  }
}
