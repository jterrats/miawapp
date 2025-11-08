import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';

import { Miaw, InitializeOptions } from 'capacitor-salesforce-miaw';
import { MiawChatService } from '../services/miaw-chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  // 👇 IMPORTANTE: aquí registramos los componentes de Ionic que usamos en la plantilla
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonSpinner,
  ],
})
export class HomePage {
  isLoading = false;
  private miawReady = false;

  constructor(private miawChatService: MiawChatService) {}

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      console.log('[Miaw] Solo disponible en app nativa');
      return;
    }

    const options: InitializeOptions = {
      configFileName: 'configFile.json',
    };

    try {
      const res = await Miaw.initialize(options);
      console.log('[Miaw] initialize OK', res);
      this.miawReady = true;
    } catch (err) {
      console.error('[Miaw] Error en initialize', err);
    }
  }

  async openChat() {
    if (!Capacitor.isNativePlatform()) {
      alert('El chat solo está disponible en la app instalada');
      return;
    }

    this.isLoading = true;
    try {
      await this.miawChatService.openConversation();
      console.log('[Miaw] home openChat OK');
    } catch (err) {
      console.error('[Miaw] home error openChat', err);
    } finally {
      this.isLoading = false;
    }
  }

  async closeChat() {
    try {
      const res = await this.miawChatService.closeConversation();
      console.log('[MIAW] closeConversation', res);
    } catch (err) {
      console.error('[MIAW] error closeChat', err);
    }
  }
}
