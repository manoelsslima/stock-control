import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { DASHBOARD_ROUTES } from './dashboard.routing';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    // Primeng
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    ChartModule,
    // shared
    SharedModule // para poder usar a toolbar do módulo shared
  ],
  providers: [
    MessageService,
    CookieService
  ]
})
export class DashboardModule { }
