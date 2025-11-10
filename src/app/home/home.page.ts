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

// 👇 OJO: ya NO importamos InitializeOptions
import { Miaw } from 'capacitor-salesforce-miaw';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
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
  miawReady = false;

  constructor() {}

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      console.log('[Miaw] Solo disponible en app nativa');
      return;
    }

    try {
      // 👇 NO le pasamos nada: el plugin usará res/raw/config_file.json
      const res = await Miaw.initialize({
        serviceUrl: undefined,
        orgId: undefined,
        developerName: undefined
      });
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

    if (!this.miawReady) {
      console.warn('[Miaw] openChat llamado antes de initialize.');
      return;
    }

    this.isLoading = true;

    try {
      // Llamamos directamente al plugin nativo
      const res = await Miaw.openConversation();
      console.log('[Miaw] openConversation OK', res);
    } catch (err) {
      console.error('[Miaw] Error en openConversation', err);
    } finally {
      this.isLoading = false;
    }
  }

  async closeChat() {
    try {
      const res = await Miaw.closeConversation();
      console.log('[Miaw] closeConversation OK', res);
    } catch (err) {
      console.error('[Miaw] Error en closeConversation', err);
    }
  }
}
