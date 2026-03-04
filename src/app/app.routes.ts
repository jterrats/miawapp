import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';

export const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'home', component: HomePage },
];

