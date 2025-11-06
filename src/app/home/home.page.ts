import { Component } from '@angular/core';
import { Miaw } from '../plugins/miaw.plugins';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ],
})
export class HomePage {
  isOpening = false;

  async openChat() {
    try {
      this.isOpening = true;

      await Miaw.initializeFromConfig({
        configFile: 'configFile.json', // o el nombre que uses en assets
      });

      await Miaw.openConversation();
    } catch (err) {
      console.error('Error abriendo chat', err);
    } finally {
      this.isOpening = false;
    }
  }

  async closeChat() {
    try {
      await Miaw.closeConversation();
    } catch (err) {
      console.error('Error cerrando chat', err);
    }
  }
}
