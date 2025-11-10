import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Miaw } from '../plugins/miaw.plugins';

@Injectable({ providedIn: 'root' })

export class MiawChatService {
  private initialized = false;
  private initializing = false;

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
      console.log('[MiawChatService] 🔹 Calling Miaw.initialize() with:', {
        configFileName: 'configFile.json'
      });

      const result = await Miaw.initialize({
        configFileName: 'configFile.json'
      });

      console.log('[MiawChatService] ✅ Miaw.initialize() result:', result);
      this.initialized = true;
    } catch (err) {
      console.error('[MiawChatService] ❌ Error initializing Miaw:', err);
    } finally {
      this.initializing = false;
    }
  }

  async openConversation() {
    return Miaw.openConversation();
  }

  async closeConversation() {
      return Miaw.closeConversation();
  }
}
